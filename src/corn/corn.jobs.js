// ===================== Cron Jobs Registry =====================
// ملف مركزي يُسجّل كل المهام الدورية — يُستدعى مرة واحدة عند بدء السيرفر

import cron from "node-cron";
import { sendAdminReportEmail }        from "../utils/automation/admin.report.service.js";
import { sendPendingDonationReminders } from "../utils/automation/donation.reminder.service.js";

export const registerCronJobs = () => {

  // ── 1) Admin Report — كل 3 أيام الساعة 8 صباحاً ──
  cron.schedule("*/10 * * * * *", async () => {
    console.log("[Cron] 🕗 Running Admin Report Job...");
    try {
      await sendAdminReportEmail();
    } catch (err) {
      console.error("[Cron] ❌ Admin Report Job failed:", err.message);
    }
  }, { timezone: "Africa/Cairo" });

  // ── 2) Donation Reminders — كل يوم الساعة 8 صباحاً ──
  cron.schedule("*/10 * * * * *", async () => {
    console.log("[Cron] 🕘 Running Donation Reminder Job...");
    try {
      await sendPendingDonationReminders();
    } catch (err) {
      console.error("[Cron] ❌ Donation Reminder Job failed:", err.message);
    }
  }, { timezone: "Africa/Cairo" });

  console.log("[Cron] ✅ All cron jobs registered.");
};
