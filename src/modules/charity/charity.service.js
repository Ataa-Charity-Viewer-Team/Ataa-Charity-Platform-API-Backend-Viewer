import { userModel, roles } from "../../database/model/user.model.js";
import { charityModel, charityApprovalStatus } from "../../database/model/charity.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";
import { decryptPhone, encryptPhone } from "../../utils/encryption/encryption.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";

// ===================== Get All Charities =====================
export const getAllCharities = async (req, res, next) => {
  const data = await advancedPagination(charityModel, {
  select: "charityName email address description approvalStatus"  });

  res.status(200).json({ success: true, data });
};
// ===================== Get Single Charity =====================
export const getCharity = async (req, res, next) => {
  const { id } = req.params;
  const charity = await charityModel.findById(id);
  if (!charity) {
    return next(new Error("Charity not found", { cause: 404 }));
  }
  if (charity.phone) {
    charity.phone = decryptPhone({ cipherText: charity.phone });
  }
  return res.status(200).json({ success: true, charity });
};
// ===================== Update Charity (Charity Owner Only) =====================
export const updateCharity = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const { charityName, email, phone, address, description } = req.body;

  const charity = await charityModel.findById(id);
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  if (
    user.role !== roles.admin &&
    charity.userId?.toString() !== user._id.toString()
  ) {
    return next(
      new Error("You don't have permission to update this charity", { cause: 403 })
    );
  }

  const updateData = { charityName, email, address, description };

  if (phone) updateData.phone = encryptPhone({ cipherText: phone });

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const updated = await charityModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .select("-__v -phone");

  return res.status(200).json({
    success: true,
    message: "Charity updated successfully",
    charity: updated,
  });
};

// ===================== Delete Charity (Admin or Owner) =====================
export const deleteCharity = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const charity = await charityModel.findById(id);
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  if (
    user.role !== roles.admin &&
    charity.userId?.toString() !== user._id.toString()
  ) {
    return next(
      new Error("You don't have permission to delete this charity", { cause: 403 })
    );
  }

  await charityModel.findByIdAndDelete(id);
  return res.status(200).json({ success: true, message: "Charity deleted successfully" });
};

// ===================== Admin: Approve Charity =====================
export const approveCharity = async (req, res, next) => {
  const { id } = req.params;

  const charity = await charityModel.findByIdAndUpdate(
    id,
    { approvalStatus: charityApprovalStatus.approved, rejectionReason: null },
    { new: true }
  );
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  await notificationModel.create({
    userId: charity.userId,
    content: "Your charity account has been approved. You can now login.",
    status: notificationStatus.unread,
  });

  return res.status(200).json({
    success: true,
    message: "Charity approved successfully",
    charity,
  });
};

// ===================== Admin: Reject Charity =====================
export const rejectCharity = async (req, res, next) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  const charity = await charityModel.findByIdAndUpdate(
    id,
    {
      approvalStatus: charityApprovalStatus.rejected,
      rejectionReason: rejectionReason || "No reason provided",
    },
    { new: true }
  );
  if (!charity) return next(new Error("Charity not found", { cause: 404 }));

  await notificationModel.create({
    userId: charity.userId,
    content: `Your charity account has been rejected. Reason: ${charity.rejectionReason}`,
    status: notificationStatus.unread,
  });

  return res.status(200).json({
    success: true,
    message: "Charity rejected",
    charity,
  });
};