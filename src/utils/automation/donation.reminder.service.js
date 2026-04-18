// ===================== Donation Reminder Service =====================
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
import { userModel } from "../../database/model/user.model.js";
import { sendEmails } from "../sendemails/sendemail.nodemailer.js";

export const sendPendingDonationReminders = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const staleDonations = await donationModel
    .find({
      status:         donationStatus.pending,
      isReminderSent: { $ne: true },
      createdAt:      { $lte: threeDaysAgo },
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

    // ✅ 1 — إشعار جوه الـ DB
    notificationsToCreate.push({
      userId:     donation.charityId.userId,
      donationId: donation._id,
      content:    "لديك تبرع معلق منذ أكثر من 3 أيام، يرجى مراجعته واتخاذ الإجراء المناسب.",
      status:     notificationStatus.unread,
    });

    donationIdsToUpdate.push(donation._id);

    // ✅ 2 — إيميل للجمعية
    const charityUser = await userModel
      .findById(donation.charityId.userId, "email")
      .lean();

    if (charityUser?.email) {
      await sendEmails({
        to:      charityUser.email,
        subject: "⏳ تذكير: لديك تبرع معلق — منصة عطاء",
        html:    `
          <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px;">
            <h2>تذكير بتبرع معلق</h2>
            <p>جمعية <strong>${donation.charityId.charityName}</strong>،</p>
            <p>لديك تبرع معلق منذ أكثر من 3 أيام.</p>
            <p>يرجى مراجعته واتخاذ الإجراء المناسب في أقرب وقت.</p>
            <br/>
            <p>منصة عطاء 🤝</p>
          </div>
        `,
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