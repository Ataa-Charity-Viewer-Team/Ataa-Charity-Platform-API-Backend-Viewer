import { advancedPagination } from "../../middleware/pagination.middleware.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";

// helper: جيب الجمعية وتحقق إنها موجودة
const getCharityByLicense = async (license, next) => {
  const charity = await charityModel.findOne({ licenseNumber: license });
  if (!charity) { next(new Error("Charity not found", { cause: 404 })); return null; }
  return charity;
};

// ===================== 1) Get Stats ===========================
export const getStats = async (req, res, next) => {
  const { license } = req.params;
  const charity = await getCharityByLicense(license, next);
  if (!charity) return;

  const Total_Donations    = await donationModel.countDocuments({ charityId: charity._id });
  const Pending_Donations  = await donationModel.countDocuments({ charityId: charity._id, status: donationStatus.pending });
  const Accepted_Donations = await donationModel.countDocuments({ charityId: charity._id, status: donationStatus.accepted });

  return res.status(200).json({
    success: true,
    stats: { Total_Donations, Pending_Donations, Accepted_Donations },
  });
};

// ===================== 2) Get Donations ================================
export const getCharityDonations = async (req, res, next) => {
  const { license } = req.params;
  const charity = await getCharityByLicense(license, next);
  if (!charity) return;

  const data = await donationModel
    .find({ charityId: charity._id })
    .populate("donorId", "_id imageUrl address")
    .populate("charityId", "charityName address")
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, count: data.length, data });
};

// ===================== 3) Get Requests ================================
export const getCharityRequests = async (req, res, next) => {
  const { license } = req.params;
  const charity = await getCharityByLicense(license, next);
  if (!charity) return;

  const data = await advancedPagination(donationModel, { charityId: charity._id, status: donationStatus.pending });
  return res.status(200).json({ success: true, data });
};

// ===================== 4) Update Request Status ================================
export const updateRequestStatus = async (req, res, next) => {
  const { id, license } = req.params;
  const { status } = req.body;

  const charity = await getCharityByLicense(license, next);
  if (!charity) return;

  // إصلاح: تحقق إن الـ donation فعلاً بتاع الجمعية دي
  const request = await donationModel.findOne({ _id: id, charityId: charity._id });
  if (!request) return next(new Error("Request not found or not yours", { cause: 404 }));

  if (request.status === donationStatus.accepted) {
    return next(new Error("Already accepted", { cause: 400 }));
  }

  const updatedRequest = await donationModel.findByIdAndUpdate(id, { status }, { new: true });

  await notificationModel.create({
    userId:     request.donorId,
    donationId: request._id,
    content:    `Your donation request has been ${status}`,
    status:     notificationStatus.unread,
  });

  return res.status(200).json({ success: true, message: "Request updated successfully", request: updatedRequest });
};
