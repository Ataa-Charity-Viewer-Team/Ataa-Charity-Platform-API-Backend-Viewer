import { advancedPagination } from "../../middleware/pagination.middleware.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
// ===================== 1) Get Stats ===========================
export const getStats = async (req, res, next) => {
  // const {charityId} = req.params;
  const { user } = req;
const charity = await charityModel.findOne({
  userId: user._id
});
console.log(user._id);
console.log(user.roleType);
  // if (!charity) return next(new Error("Charity not found", { cause: 404 }));
 
  const Total_Donations = await donationModel.countDocuments({ charityId: charity._id });
  const Pending_Donations = await donationModel.countDocuments({ charityId: charity._id, status: donationStatus.pending });
  const Accepted_Donations = await donationModel.countDocuments({ charityId: charity._id, status: donationStatus.accepted });
console.log(Total_Donations, Pending_Donations, Accepted_Donations, charity._id,"charityId");
  return res.status(200).json({
    success: true,
    stats: { Total_Donations, Pending_Donations, Accepted_Donations }
  });
};

// ===================== 2) Get Donations ================================
export const getCharityDonations = async (req, res, next) => {
        // const { charityId } = req.params;
  const { user } = req;
const charity = await charityModel.findOne({
  userId: user._id
});
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const data = await donationModel
    .find({ charityId: charity._id })
    .populate("donorId", "name email phone imageUrl address")
    .populate("charityId", "charityName address email")
    .sort({ createdAt: -1 }); 

  return res.status(200).json({
    success: true,
    count: data.length,
    data
  });
};
// ===================== 3) Get Requests ================================
export const getCharityRequests = async (req, res, next) => {
  // const { charityId } = req.params;
  const { user } = req;
const charity = await charityModel.findOne({
  userId: user._id
});
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const data = await advancedPagination(donationModel, { charityId: charity._id, status: donationStatus.pending });
  return res.status(200).json({ success: true, data });
};

// ===================== 4) Update Request Status ================================
export const updateRequestStatus = async (req, res, next) => {
  // const { id , charityId} = req.params;
  const { id } = req.params;
  const {user} = req;
  const { status } = req.body;

  const charity = await charityModel.findOne({
  userId: user._id
});
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  const request = await donationModel.findOne({ _id: id, charityId: charity._id });
  if (!request) return next(new Error("Request not found", { cause: 404 }));

  if (request.status === donationStatus.accepted) {
    return next(new Error("Already accepted", { cause: 400 }));
  }

  const updatedRequest = await donationModel.findByIdAndUpdate(
    id,
    { status },
    { new: true });

  await notificationModel.create({
    userId: request.donorId,
    donationId: request._id,
    content: `Your donation request has been ${status}`,
    status: notificationStatus.unread
  });
  return res.status(200).json({
    success: true,
    message: "Request updated successfully",
    request: updatedRequest,
  });
};
