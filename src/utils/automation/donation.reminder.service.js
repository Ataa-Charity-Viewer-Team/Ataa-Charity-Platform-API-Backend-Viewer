// ===================== Donation Reminder Service =====================
// يفحص التبرعات المعلقة منذ +3 أيام ويرسل notification للجمعية — مرة واحدة فقط

import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";

export const sendPendingDonationReminders = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  // اجلب التبرعات المعلقة القديمة اللي لم يُرسَل لها تذكير
  const staleDonations = await donationModel
    .find({
      status:          donationStatus.pending,
      isReminderSent:  { $ne: true },
      createdAt:       { $lte: threeDaysAgo },
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
      content:    "لديك تبرع معلق منذ أكثر من 3 أيام، يرجى مراجعته واتخاذ الإجراء المناسب.",
      status:     notificationStatus.unread,
    });
    donationIdsToUpdate.push(donation._id);
  }

  if (!notificationsToCreate.length) return;

  // insertMany + updateMany دفعة واحدة — أكفأ من loop
  await notificationModel.insertMany(notificationsToCreate);
  await donationModel.updateMany(
    { _id: { $in: donationIdsToUpdate } },
    { $set: { isReminderSent: true } }
  );

  console.log(`[DonationReminder] ✅ Sent ${notificationsToCreate.length} reminders.`);
};
