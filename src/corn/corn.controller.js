// ===================== Cron Controller =====================
// Vercel بيبعت GET request لكل endpoint على الجدول المحدد في vercel.json
// مش محتاج node-cron خالص على Vercel

import { Router } from "express";
import { sendAdminReportEmail }         from "../utils/automation/admin.report.service.js";
import { sendPendingDonationReminders } from "../utils/automation/donation.reminder.service.js";

const router = Router();

// ── حماية بسيطة: Vercel بيبعت header خاص ──────────────────────
// لو مفيش header، يعني حد خارجي بيحاول يستدعي الـ endpoint يدوياً
const verifyCronSecret = (req, res, next) => {
  const secret = req.headers["authorization"];
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

// ── 1) Admin Report — كل 3 أيام الساعة 8 صباحاً ───────────────
// vercel.json: "0 8 */3 * *"
router.get("/admin-report", verifyCronSecret, async (req, res) => {
  console.log("[Cron] 🕗 Admin Report triggered by Vercel...");
  try {
    await sendAdminReportEmail();
    return res.status(200).json({ success: true, job: "admin-report" });
  } catch (err) {
    console.error("[Cron] ❌ Admin Report failed:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── 2) Donation Reminder — كل يوم الساعة 9 صباحاً ─────────────
// vercel.json: "0 9 * * *"
router.get("/donation-reminder", verifyCronSecret, async (req, res) => {
  console.log("[Cron] 🕘 Donation Reminder triggered by Vercel...");
  try {
    await sendPendingDonationReminders();
    return res.status(200).json({ success: true, job: "donation-reminder" });
  } catch (err) {
    console.error("[Cron] ❌ Donation Reminder failed:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
