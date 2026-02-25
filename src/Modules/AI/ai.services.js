// =============================== import modules ================================
import dotenv from 'dotenv';
dotenv.config();
import Groq from "groq-sdk";
import { chatModel } from '../../dataBase/Model/Ai.model.js';
// =============================== Groq API Key File Env ================================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// ===============================1) Chat  ================================
export const chat = async (req, res) => {
  // ====================== send message  ================================
  const { message } = req.body;
  // ====================== get user id  ================================
  const { user } = req;
  // ====================== check user id  ================================
  if (!user){
    return res.status(400).json({ message: "user not found" });
  } 
  // ====================== check message  ================================
  if (!message){
    return res.status(400).json({ message: "message required" });
  } 
  // ====================== check message offline  ================================
  const messageOffline = await chatModel.findOne({ message, userId: user._id });
  // ====================== if message offline  ================================
  if (messageOffline) {
    return res.status(200).json({success:true, reply: messageOffline.reply });
  }
  // ====================== send message connect api ================================
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: message }],
  });
// ====================== save message offline ================================
  const reply = response.choices[0].message.content;
  await chatModel.create({  reply, userId: user._id, message });
  res.status(200).json({success:true,reply });
};
// ================================2) Analysis Image  ================================
export const analysis = async (req, res) => {
  const { message } = req.body;
  const { user } = req;

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  if (!req.files?.length){
  return res.status(400).json({ message: "No images uploaded" });
  } 
  const file = req.files[0];

  const { choices } = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}` }},
        { type: "text", text: message || "Analysis the image and provide a summary" }],
}],
  });
  const reply = choices[0].message.content;
  await chatModel.create({ reply, userId: user._id, message });
  res.status(200).json({ success: true, reply });
};