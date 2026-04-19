// ===================== Donation Reminder Service =====================
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
import { sendEmails } from "../sendemails/sendemail.nodemailer.js";

export const sendPendingDonationReminders = async ({
  hoursThreshold = 1,
  notificationContent = ({ hours, type, quantity }) =>
    `لديك تبرع معلق بـ ${quantity} قطعة من "${type}" منذ أكثر من ${hours} ${hours === 1 ? "ساعة" : "ساعات"}، يرجى مراجعته واتخاذ الإجراء المناسب.`,
  emailSubject = ({ hours }) =>
    `⏳ تذكير: لديك تبرع معلق منذ أكثر من ${hours} ${hours === 1 ? "ساعة" : "ساعات"} — منصة عطاء`,
  emailTemplate = ({ charityName, donorName, type, quantity, size, condition, dateDonation, hours }) => {
    const donationDate = new Date(dateDonation).toLocaleDateString("ar-EG", {
      year:  "numeric",
      month: "long",
      day:   "numeric",
    });
    const donationTime = new Date(dateDonation).toLocaleTimeString("ar-EG", {
      hour:   "2-digit",
      minute: "2-digit",
    });

    return `
      <div style="font-family: Arial, sans-serif; direction: rtl; padding: 32px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2e7d32; font-size: 24px; margin: 0;">منصة عطاء 🤝</h1>
          <p style="color: #757575; font-size: 13px; margin: 6px 0 0;">تذكير تلقائي — تبرع معلق</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin-bottom: 24px;" />
        <p style="font-size: 16px; color: #212121;">جمعية <strong>${charityName}</strong>،</p>
        <p style="font-size: 15px; color: #424242; line-height: 1.8;">
          نود إعلامكم بأن المتبرع <strong>${donorName}</strong> أرسل تبرعًا بانتظار مراجعتكم منذ أكثر من
          <strong>${hours} ${hours === 1 ? "ساعة" : "ساعات"}</strong>.
          يرجى اتخاذ الإجراء المناسب في أقرب وقت.
        </p>
        <div style="background-color: #f9f9f9; border-right: 4px solid #2e7d32; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 14px; font-size: 15px; color: #2e7d32;">📦 تفاصيل التبرع</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #424242;">
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 8px 0; font-weight: bold; width: 40%;">المتبرع</td>
              <td style="padding: 8px 0;">${donorName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 8px 0; font-weight: bold;">نوع التبرع</td>
              <td style="padding: 8px 0;">${type}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 8px 0; font-weight: bold;">الكمية</td>
              <td style="padding: 8px 0;">${quantity} قطعة</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 8px 0; font-weight: bold;">المقاس</td>
              <td style="padding: 8px 0;">${size}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 8px 0; font-weight: bold;">الحالة</td>
              <td style="padding: 8px 0;">${condition}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 8px 0; font-weight: bold;">تاريخ التبرع</td>
              <td style="padding: 8px 0;">${donationDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">الساعة</td>
              <td style="padding: 8px 0;">${donationTime}</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 14px; color: #757575; line-height: 1.8;">
          للحفاظ على ثقة المتبرعين يرجى مراجعة التبرع والرد في أقرب وقت ممكن.
        </p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
        <p style="text-align: center; font-size: 12px; color: #9e9e9e; margin: 0;">
          هذا البريد أُرسل تلقائيًا من منصة عطاء — يرجى عدم الرد عليه.
        </p>
      </div>
    `;
  },
} = {}) => {

  const thresholdDate = new Date();
  thresholdDate.setHours(thresholdDate.getHours() - hoursThreshold);

  const staleDonations = await donationModel
    .find({
      status:         donationStatus.pending,
      isReminderSent: { $ne: true },
      createdAt:      { $lte: thresholdDate },
    })
    .populate("charityId", "userId charityName email")
    .populate("donorId",   "userName")
    .lean();

  if (!staleDonations.length) {
    console.log("[DonationReminder] ✅ No stale donations found.");
    return;
  }

  console.log(`[DonationReminder] 🔔 Found ${staleDonations.length} stale donations.`);

  const notificationsToCreate = [];
  const donationIdsToUpdate   = [];

  for (const donation of staleDonations) {
    const charityEmail  = donation.charityId?.email;
    const charityName   = donation.charityId?.charityName;
    const charityUserId = donation.charityId?.userId;

    if (!charityEmail || !charityUserId) {
      console.warn(`[DonationReminder] ⚠️ Donation ${donation._id} — charity data missing. Skipping.`);
      continue;
    }

    const donorName = donation.donorId?.userName || "متبرع";

    notificationsToCreate.push({
      userId:     charityUserId,
      donationId: donation._id,
      content:    notificationContent({
        hours:    hoursThreshold,
        type:     donation.type,
        quantity: donation.quantity,
      }),
      status: notificationStatus.unread,
    });

    donationIdsToUpdate.push(donation._id);

    await sendEmails({
      to:      charityEmail,
      subject: emailSubject({ hours: hoursThreshold }),
      html:    emailTemplate({
        charityName,
        donorName,
        type:         donation.type,
        quantity:     donation.quantity,
        size:         donation.size,
        condition:    donation.condition,
        dateDonation: donation.dateDonation || donation.createdAt,
        hours:        hoursThreshold,
      }),
    });

    console.log(`[DonationReminder] 📧 Email sent to ${charityEmail}`);
  }

  if (!notificationsToCreate.length) return;

  await notificationModel.insertMany(notificationsToCreate);
  await donationModel.updateMany(
    { _id: { $in: donationIdsToUpdate } },
    { $set: { isReminderSent: true } }
  );

  console.log(`[DonationReminder] ✅ Sent ${notificationsToCreate.length} reminders.`);
};