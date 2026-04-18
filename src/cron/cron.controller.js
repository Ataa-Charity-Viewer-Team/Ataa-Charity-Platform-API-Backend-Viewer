// ===================== Cron Controller =====================
import { Router } from "express";
import { sendAdminReportEmail } from "../utils/automation/admin.report.service.js";
import { sendPendingDonationReminders } from "../utils/automation/donation.reminder.service.js";

const router = Router();

// ===================== 1) Admin Report =====================
router.get("/admin-report", async (req, res) => {
  console.log("[Cron] 🕗 Admin Report triggered...");

  try {
    await sendAdminReportEmail();

    return res.status(200).json({
      success: true,
      job: "admin-report",
      message: "Admin report sent successfully",
    });
  } catch (err) {
    console.error("[Cron] ❌ Admin Report failed:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});



// ===================== 2) Donation Reminder =====================
router.get("/donation-reminder", async (req, res) => {
  console.log("[Cron] 🕘 Donation Reminder triggered...");

  try {
    await sendPendingDonationReminders();

    return res.status(200).json({
      success: true,
      job: "donation-reminder",
      message: "Donation reminders sent successfully",
    });
  } catch (err) {
    console.error("[Cron] ❌ Donation Reminder failed:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;