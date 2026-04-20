import { advancedPagination } from "../../middleware/pagination.middleware.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
// ===================== 1) Get Stats ================================
export const getStats = async (req, res, next) => {
  const charity = await charityModel.findOne({ userId: req.user._id });
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const Total_Donations = await donationModel.countDocuments({ charityId: charity._id });
  const Pending_Donations = await donationModel.countDocuments({ charityId: charity._id, status: donationStatus.pending });
  const Accepted_Donations = await donationModel.countDocuments({ charityId: charity._id, status: donationStatus.accepted });

  return res.status(200).json({
    success: true,
    stats: { Total_Donations, Pending_Donations, Accepted_Donations }
  });
};

// ===================== 2) Get Donations ================================
export const getCharityDonations = async (req, res, next) => {
  const { user } = req;
  const charity = await charityModel.findOne({ userId: user._id });
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const data = await advancedPagination(donationModel, { charityId: charity._id,  charityId: charity._id, status: { $ne: donationStatus.accepted } });
  return res.status(200).json({ success: true, data });
};

// ===================== 3) Get Requests ================================
export const getCharityRequests = async (req, res, next) => {
  const { user } = req;
  const charity = await charityModel.findOne({ userId: user._id });
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const data = await advancedPagination(donationModel, { charityId: charity._id, status: donationStatus.pending });
  return res.status(200).json({ success: true, data });
};
// ===================== 4) get donations ================================

export const getCharityDonations = async (req, res, next) => {
  const { user } = req;
  const charity = await charityModel.findOne({ userId: user._id });
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const data = await advancedPagination(donationModel, { charityId: charity._id, status: donationStatus.accepted });
  return res.status(200).json({ success: true, data });
};