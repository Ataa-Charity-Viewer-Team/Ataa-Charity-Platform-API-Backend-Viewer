// cron.service.js

import { sendAdminReportEmail } from "../utils/automation/admin.report.service.js";
import { sendPendingDonationReminders } from "../utils/automation/donation.reminder.service.js";

export const adminReport = async () => {
  console.log("[Cron] 🕗 Admin Report triggered...");
  await sendAdminReportEmail();

  return {
    job: "admin-report",
    message: "Admin report sent successfully",
  };
};

export const donationReminder = async () => {
  console.log("[Cron] 🕘 Donation Reminder triggered...");
  await sendPendingDonationReminders();

  return {
    job: "donation-reminder",
    message: "Donation reminders sent successfully",
  };
};