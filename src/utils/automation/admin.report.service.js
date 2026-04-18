// ===================== Admin Report Service =====================
// يجيب الإحصائيات الحقيقية من الـ DB ويرسل إيميل للأدمن كل 3 أيام
import { userModel } from "../../database/model/user.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { sendEmails } from "../sendemails/sendemail.nodemailer.js";
import { generateAdminReportHTML } from "../sendemails/generate.report.js";

// ── Collect stats ──
const collectStats = async () => {
  const stats = await donationModel.aggregate([
  {
    $group: {
      _id: null,
      totalDonations: { $sum: 1 },
      pendingDonations: {
        $sum: { $cond: [{ $eq: ["$status", donationStatus.pending] }, 1, 0] }
      },
      acceptedDonations: {
        $sum: { $cond: [{ $eq: ["$status", donationStatus.accepted] }, 1, 0] }
      },
      rejectedDonations: {
        $sum: { $cond: [{ $eq: ["$status", donationStatus.rejected] }, 1, 0] }
      }
    }
  }
]);

const result = stats[0];
};

// ── Main service ──
export const sendAdminReportEmail = async () => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      console.error("[AdminReport] ❌ ADMIN_EMAIL not set");
      return;
    }

    const stats = await collectStats();

    const html = generateAdminReportHTML(stats);

    await sendEmails({
      to: process.env.ADMIN_EMAIL,
      subject: "📊 التقرير الدوري — منصة عطاء",
      html,
    });

    console.log(`[AdminReport] ✅ Sent to ${process.env.ADMIN_EMAIL}`);
    console.log("[AdminReport] 📊 Stats:", stats);

  } catch (err) {
    console.error("[AdminReport] ❌ Failed:", err.message);
  }
};