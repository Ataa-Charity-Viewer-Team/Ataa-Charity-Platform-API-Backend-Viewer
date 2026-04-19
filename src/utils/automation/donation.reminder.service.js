import { donationModel, donationStatus, reminderStatus } from "../../database/model/donation.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
import { sendEmails } from "../sendemails/sendemail.nodemailer.js";

// ==================== Helpers ====================
const timeAgoText = (hoursAgo) =>
  hoursAgo < 24
    ? `${hoursAgo} ساعة`
    : `${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? "يوم" : "أيام"}`;

const buildEmailSubject = ({ hoursAgo, isFinal }) =>
  isFinal
    ? `🚨 آخر تذكير: تبرع معلق منذ 3 أيام — منصة عطاء`
    : `⏳ تذكير: تبرع معلق منذ ${timeAgoText(hoursAgo)} — منصة عطاء`;

const buildEmailTemplate = ({ charityName, donorName, type, quantity, size, condition, dateDonation, hoursAgo, isFinal }) => {
  const rows = [
    ["المتبرع",      donorName],
    ["نوع التبرع",   type],
    ["الكمية",       `${quantity} قطعة`],
    ["المقاس",       size],
    ["الحالة",       condition],
    ["تاريخ التبرع", new Date(dateDonation).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })],
    ["الساعة",       new Date(dateDonation).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })],
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:8px 0;font-weight:bold;width:40%;">${label}</td>
      <td style="padding:8px 0;">${value}</td>
    </tr>`).join("");

  const warningBanner = isFinal ? `
    <div style="background:#fff3e0;border-right:4px solid #e65100;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#e65100;font-weight:bold;">
        ⚠️ هذا آخر تذكير — مضى على التبرع 3 أيام دون مراجعة.
      </p>
    </div>` : "";

  return `
    <div style="font-family:Arial,sans-serif;direction:rtl;padding:32px;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;background:#fff;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#2e7d32;font-size:24px;margin:0;">منصة عطاء 🤝</h1>
        <p style="color:#757575;font-size:13px;margin:6px 0 0;">تذكير تلقائي — تبرع معلق</p>
      </div>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin-bottom:24px;" />
      ${warningBanner}
      <p style="font-size:16px;color:#212121;">جمعية <strong>${charityName}</strong>،</p>
      <p style="font-size:15px;color:#424242;line-height:1.8;">
        المتبرع <strong>${donorName}</strong> أرسل تبرعًا منذ <strong>${timeAgoText(hoursAgo)}</strong> بانتظار مراجعتكم.
      </p>
      <div style="background:#f9f9f9;border-right:4px solid #2e7d32;border-radius:8px;padding:16px 20px;margin:24px 0;">
        <h3 style="margin:0 0 14px;font-size:15px;color:#2e7d32;">📦 تفاصيل التبرع</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#424242;">
          ${tableRows}
        </table>
      </div>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
      <p style="text-align:center;font-size:12px;color:#9e9e9e;margin:0;">
        هذا البريد أُرسل تلقائيًا من منصة عطاء — يرجى عدم الرد عليه.
      </p>
    </div>`;
};

// ==================== Process Donations ====================
const processDonations = async ({ donations, isFinal, now }) => {
  const notificationsToCreate = [];
  const idsToUpdate           = [];

  await Promise.all(donations.map(async (donation) => {
    const charityEmail  = donation.charityId?.email;
    const charityName   = donation.charityId?.charityName;
    const charityUserId = donation.charityId?.userId;

    if (!charityEmail || !charityUserId) {
      console.warn(`[DonationReminder] ⚠️ Donation ${donation._id} — missing charity data. Skipping.`);
      return;
    }

    const donorName = donation.donorId?.userName || "متبرع";
    const hoursAgo  = Math.floor((now - new Date(donation.createdAt)) / (1000 * 60 * 60));

    try {
      await sendEmails({
        to:      charityEmail,
        subject: buildEmailSubject({ hoursAgo, isFinal }),
        html:    buildEmailTemplate({
          charityName, donorName, hoursAgo, isFinal,
          type:         donation.type,
          quantity:     donation.quantity,
          size:         donation.size,
          condition:    donation.condition,
          dateDonation: donation.dateDonation || donation.createdAt,
        }),
      });

      notificationsToCreate.push({
        userId:     charityUserId,
        donationId: donation._id,
        content: isFinal
          ? `⚠️ آخر تذكير — تبرع "${donation.type}" معلق منذ 3 أيام.`
          : `لديك تبرع معلق بـ ${donation.quantity} قطعة من "${donation.type}" منذ ${timeAgoText(hoursAgo)}، يرجى مراجعته.`,
        status: notificationStatus.unread,
      });

      idsToUpdate.push(donation._id);
      console.log(`[DonationReminder] ${isFinal ? "🚨 Final" : "📧 Reminder"} → ${charityEmail} (${hoursAgo}h)`);

    } catch (err) {
      console.error(`[DonationReminder] ❌ Failed → ${charityEmail}`, err.message);
    }
  }));

  return { notificationsToCreate, idsToUpdate };
};

// ==================== Main Function ====================
export const sendPendingDonationReminders = async () => {
  const now          = new Date();
  const minDate      = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const maxDate      = new Date(now.getTime() - 1 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const [staleDonations, finalWarningDonations] = await Promise.all([
    // ✅ لسه ما اتبعتلهاش أي reminder
    donationModel.find({
      status:         donationStatus.pending,
      reminderStatus: "none",
      createdAt:      { $gte: minDate, $lte: maxDate },
    })
    .populate("charityId", "userId charityName email")
    .populate("donorId",   "userName")
    .lean(),

    // ✅ اتبعتلها reminder عادي بس لسه ما اتبعتلهاش final
    donationModel.find({
      status:         donationStatus.pending,
      reminderStatus: "reminder_sent",
      createdAt:      { $lte: threeDaysAgo },
    })
    .populate("charityId", "userId charityName email")
    .populate("donorId",   "userName")
    .lean(),
  ]);

  if (!staleDonations.length && !finalWarningDonations.length) {
    console.log("[DonationReminder] ✅ No pending donations.");
    return;
  }

  console.log(`[DonationReminder] 🔔 Stale: ${staleDonations.length} | Final: ${finalWarningDonations.length}`);

  const [staleResult, finalResult] = await Promise.all([
    processDonations({ donations: staleDonations,        isFinal: false, now }),
    processDonations({ donations: finalWarningDonations, isFinal: true,  now }),
  ]);

  const allNotifications = [...staleResult.notificationsToCreate, ...finalResult.notificationsToCreate];

  await Promise.all([
    allNotifications.length
      ? notificationModel.insertMany(allNotifications)
      : Promise.resolve(),

    // ✅ بدل isReminderSent: true
    staleResult.idsToUpdate.length
      ? donationModel.updateMany(
          { _id: { $in: staleResult.idsToUpdate } },
          { $set: { reminderStatus: "reminder_sent" } }
        )
      : Promise.resolve(),

    // ✅ بدل isFinalReminderSent: true
    finalResult.idsToUpdate.length
      ? donationModel.updateMany(
          { _id: { $in: finalResult.idsToUpdate } },
          { $set: { reminderStatus: "final_sent" } }
        )
      : Promise.resolve(),
  ]);

  console.log(`[DonationReminder] ✅ Done — ${allNotifications.length} notifications created.`);
};