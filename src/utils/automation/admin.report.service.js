// ===================== Admin Report Service =====================
// يجيب الإحصائيات الحقيقية من الـ DB ويرسل إيميل للأدمن كل 3 أيام

import { userModel }    from "../../database/model/user.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { sendEmails }   from "../sendemails/sendemail.nodemailer.js";
import { generateAdminReportHTML } from "../sendemails/generate.report.js";

// ── Collect stats ──
const collectStats = async () => {
  // ✅ Promise.all بيشغّل الكل بالتوازي — أسرع من واحدة ورا التانية
  // ✅ أضفنا totalUsers و totalCharities اللي كانوا ناقصين
  const [
    totalUsers,
    totalCharities,
    totalDonations,
    pendingDonations,
    acceptedDonations,
    rejectedDonations,
  ] = await Promise.all([
    userModel.countDocuments({ roleType: "user" }),
    charityModel.countDocuments(),
    donationModel.countDocuments(),
    donationModel.countDocuments({ status: donationStatus.pending }),
    donationModel.countDocuments({ status: donationStatus.accepted }),
    donationModel.countDocuments({ status: donationStatus.rejected }),
  ]);

  return {
    totalUsers,
    totalCharities,
    totalDonations,
    pendingDonations,
    acceptedDonations,
    rejectedDonations,
  };
};

// ── Main service ──
export const sendAdminReportEmail = async () => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      console.error("[AdminReport] ❌ ADMIN_EMAIL not set");
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

  } catch (err) {
    console.error("[AdminReport] ❌ Failed:", err.message);
  }
};
