// ========================== # Cron Service # ==========================
import { sendAdminReportEmail } from "../utils/automation/admin.report.service.js";
import { sendPendingDonationReminders } from "../utils/automation/donation.reminder.service.js";

// ===================== Admin Report =====================
export const adminReport = async (req, res) => {
  console.log("[Cron] 🕗 Admin Report triggered...");
  await sendAdminReportEmail();
  return res.status(200).json({ success: true, job: "adminReport", message: "Admin report sent successfully." });
};

// ===================== Donation Reminder =====================
export const donationReminder = async (req, res) => {
  console.log("[Cron] 🕘 Donation Reminder triggered...");
  await sendPendingDonationReminders();
  return res.status(200).json({ success: true, job: "donationReminder", message: "Donation reminders sent successfully." });
};