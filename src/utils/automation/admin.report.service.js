// ===================== Admin Report Service =====================
// يجيب الإحصائيات الحقيقية من الـ DB ويرسل إيميل للأدمن كل 3 أيام

import { userModel }     from "../../database/model/user.model.js";
import { charityModel }  from "../../database/model/charity.model.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { sendEmails }    from "../sendemails/sendemail.nodemailer.js";
import { generateAdminReportHTML } from "../sendemails/generate.report.js";

// ── جمع الإحصائيات بالتوازي من الـ DB ──
const collectStats = async () => {
  const [totalUsers, totalCharities, totalDonations, pendingDonations, acceptedDonations, rejectedDonations] =
    await Promise.all([
      userModel.countDocuments({ roleType: "user" }),
      charityModel.countDocuments(),
      donationModel.countDocuments(),
      donationModel.countDocuments({ status: donationStatus.pending }),
      donationModel.countDocuments({ status: donationStatus.accepted }),
      donationModel.countDocuments({ status: donationStatus.rejected }),
    ]);

  return { totalUsers, totalCharities, totalDonations, pendingDonations, acceptedDonations, rejectedDonations };
};

// ── الدالة الرئيسية تُستدعى من الـ cron ──
export const sendAdminReportEmail = async () => {
  if (!process.env.ADMIN_EMAIL) {
    console.error("[AdminReport] ❌ ADMIN_EMAIL not set in .env — aborting.");
    return;
  }

  const stats = await collectStats();
  const html  = generateAdminReportHTML(stats);

  await sendEmails({
    to:      process.env.ADMIN_EMAIL,
    subject: "📊 التقرير الدوري — منصة عطاء",
    html,
  });

  console.log(`[AdminReport] ✅ Sent to ${process.env.ADMIN_EMAIL}`);
  console.log("[AdminReport] 📊 Stats:", stats);
};
