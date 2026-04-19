// ===================== Donation Reminder Service =====================
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
import { userModel } from "../../database/model/user.model.js";
import { sendEmails } from "../sendemails/sendemail.nodemailer.js";


export const sendPendingDonationReminders = async ({
  daysThreshold = 1,
  notificationContent = (days) => `لديك تبرع معلق منذ أكثر من ${days} أيام، يرجى مراجعته واتخاذ الإجراء المناسب.`,
  emailSubject = "⏳ تذكير: لديك تبرع معلق — منصة عطاء",
  emailTemplate = ({ charityName, days }) => `
    <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px;">
      <h2>تذكير بتبرع معلق</h2>
      <p>جمعية <strong>${charityName}</strong>،</p>
      <p>لديك تبرع معلق منذ أكثر من ${days} أيام.</p>
      <p>يرجى مراجعته واتخاذ الإجراء المناسب في أقرب وقت.</p>
      <br/>
      <p>منصة عطاء 🤝</p>
    </div>
  `,
} = {}) => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  const staleDonations = await donationModel
    .find({
      status:         donationStatus.pending,
      isReminderSent: { $ne: true },
      createdAt:      { $lte: thresholdDate },
    })
    .populate("charityId", "userId charityName")
    .lean();

  if (!staleDonations.length) {
    console.log("[DonationReminder] ✅ No stale donations found.");
    return;
  }

  console.log(`[DonationReminder] 🔔 Found ${staleDonations.length} stale donations.`);

  const notificationsToCreate = [];
  const donationIdsToUpdate   = [];

  for (const donation of staleDonations) {
    if (!donation.charityId?.userId) {
      console.warn(`[DonationReminder] ⚠️ Donation ${donation._id} — charityId missing. Skipping.`);
      continue;
    }

    notificationsToCreate.push({
      userId:     donation.charityId.userId,
      donationId: donation._id,
      content:    notificationContent(daysThreshold),
      status:     notificationStatus.unread,
    });

    donationIdsToUpdate.push(donation._id);

    const charityUser = await userModel
      .findById(donation.charityId.userId, "email")
      .lean();

    if (charityUser?.email) {
      await sendEmails({
        to:      charityUser.email,
        subject: emailSubject,
        html:    emailTemplate({ charityName: donation.charityId.charityName, days: daysThreshold }),
      });
      console.log(`[DonationReminder] 📧 Email sent to ${charityUser.email}`);
    }
  }

  if (!notificationsToCreate.length) return;

  await notificationModel.insertMany(notificationsToCreate);
  await donationModel.updateMany(
    { _id: { $in: donationIdsToUpdate } },
    { $set: { isReminderSent: true } }
  );

  console.log(`[DonationReminder] ✅ Sent ${notificationsToCreate.length} reminders.`);
};