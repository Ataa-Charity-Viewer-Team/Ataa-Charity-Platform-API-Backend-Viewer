import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { notificationModel } from "../../database/model/notification.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";

// ===================== 1) Get Pending Donations =====================
export const getPendingDonations = async (req, res, next) => {
  const data = await advancedPagination(donationModel, {
    status: donationStatus.pending,
  });
  return res.status(200).json({ success: true, data });
};

// ===================== 2) Approve or Reject Donation =====================
export const updateDonationStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const donation = await donationModel.findById(id);
  if (!donation) return next(new Error("Donation not found", { cause: 404 }));

  if (donation.status !== donationStatus.pending)
    return next(new Error("Donation already processed", { cause: 400 }));

  const updated = await donationModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  await notificationModel.create({
    userId: donation.donorId,
    donationId: donation._id,
    content: status === donationStatus.accepted
      ? "✅ تم قبول تبرعك من قبل الأدمن"
      : "❌ تم رفض تبرعك من قبل الأدمن",
  });

  return res.status(200).json({
    success: true,
    message: "Donation status updated",
    donation: updated,
  });
};