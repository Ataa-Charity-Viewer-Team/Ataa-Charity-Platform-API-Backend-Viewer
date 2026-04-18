// ===================== Admin Report Service =====================
import { userModel }    from "../../database/model/user.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { sendEmails }   from "../sendemails/sendemail.nodemailer.js";
import { generateAdminReportHTML } from "../sendemails/generate.report.js";

// ── Collect stats ──
const collectStats = async () => {
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
    const admins = await userModel.find({ roleType: "admin" }, "email").lean();

    if (!admins.length) {
      console.error("[AdminReport] ❌ No admins found in DB");
      return;
    }

    const adminEmails = admins.map(a => a.email).join(",");
    const stats = await collectStats();
    const html  = generateAdminReportHTML(stats);

    await sendEmails({
      to:      adminEmails,
      subject: "📊 التقرير الدوري — منصة عطاء",
      html,
    });

    console.log(`[AdminReport] ✅ Sent to ${adminEmails}`);
    console.log("[AdminReport] 📊 Stats:", stats);

  } catch (err) {
    console.error("[AdminReport] ❌ Failed:", err.message);
  }
};