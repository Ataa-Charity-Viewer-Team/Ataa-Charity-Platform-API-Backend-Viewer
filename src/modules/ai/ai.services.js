// // =============================== import modules ================================
// import dotenv from 'dotenv';
// dotenv.config();
// import Groq from "groq-sdk";
// import { chatModel } from '../../database/model/ai.model.js';
// // =============================== Groq API Key File Env ================================
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// // ===============================1) Chat  ================================
// export const chat = async (req, res, next) => {
//   // ====================== send message  ================================
//   const { message } = req.body;
//   // ====================== get user id  ================================
//   const { user } = req;
//   // ====================== check user id  ================================
//   if (!user) {
// return next(new Error("user not found", { cause: 400 }));  }
//   // ====================== check message  ================================
//   if (!message) {
//     return res.status(400).json({ message: "message required" });
//   }
//   // ====================== check message offline  ================================
//   const messageOffline = await chatModel.findOne({ message, userId: user._id });
//   // ====================== if message offline  ================================
//   if (messageOffline) {
//     return res.status(200).json({ success: true, reply: messageOffline.reply });
//   }
//   // ====================== send message connect api ================================
//   const response = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{ role: "user", content: message }],
//   });
//   // ====================== save message offline ================================
//   const reply = response.choices[0].message.content;
//   await chatModel.create({ reply, userId: user._id, message });
//   res.status(200).json({ success: true, reply });
// };
// // ================================2) Analysis Image  ================================
// export const analysis = async (req, res,next) => {
//   const { message } = req.body;
//   const { user } = req;

//   if (!user) {
// return next(new Error("user not found", { cause: 400 }));  }
//   if (!req.files?.length) {
//     return res.status(400).json({ message: "No images uploaded" });
//   }
//   const file = req.files[0];

//   const { choices } = await groq.chat.completions.create({
//     model: "meta-llama/llama-4-scout-17b-16e-instruct",
//     messages: [{
//       role: "user",
//       content: [
//         { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}` } },
//         { type: "text", text: message || "Analysis the image and provide a summary" }],
//     }],
//   });
//   const reply = choices[0].message.content;
//   await chatModel.create({ reply, userId: user._id, message });
//   res.status(200).json({ success: true, reply });
// };
import dotenv from 'dotenv';
dotenv.config();
import Groq from "groq-sdk";
import { chatModel } from '../../database/model/ai.model.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ======= Helper: Check Internet =======
const isOnline = async () => {
  try {
    await fetch("https://api.groq.com", { method: "HEAD", signal: AbortSignal.timeout(3000) });
    return true;
  } catch {
    return false;
  }
};

// =============== 1) Chat ===============
export const chat = async (req, res, next) => {
  const { message } = req.body;
  const { user } = req;

  if (!user) return next(new Error("user not found", { cause: 400 }));
  if (!message) return res.status(400).json({ message: "message required" });

  const online = await isOnline();

  // ✅ لو مفيش نت → رجّع من الـ DB
  if (!online) {
    const messageOffline = await chatModel.findOne({ message, userId: user._id });
    if (messageOffline) {
      return res.status(200).json({ success: true, reply: messageOffline.reply, source: "offline" });
    }
    return res.status(503).json({ message: "No internet connection and no cached reply found" });
  }

  // ✅ في نت → دايمًا API (رد جديد)
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: message }],
  });

  const reply = response.choices[0].message.content;

  // ✅ احفظ أو حدّث الرد في الـ DB
  await chatModel.findOneAndUpdate(
    { message, userId: user._id },
    { reply },
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true, reply, source: "online" });
};

// =========== 2) Analysis Image ===========
export const analysis = async (req, res, next) => {
  const { message } = req.body;
  const { user } = req;

  if (!user) return next(new Error("user not found", { cause: 400 }));
  if (!req.files?.length) return res.status(400).json({ message: "No images uploaded" });

  const online = await isOnline();
  if (!online) {
    return res.status(503).json({ message: "No internet connection, image analysis requires internet" });
  }

  const file = req.files[0];

  const { choices } = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}` } },
        { type: "text", text: message || "Analysis the image and provide a summary" },
      ],
    }],
  });

  const reply = choices[0].message.content;
  await chatModel.create({ reply, userId: user._id, message });
  res.status(200).json({ success: true, reply, source: "online" });
};