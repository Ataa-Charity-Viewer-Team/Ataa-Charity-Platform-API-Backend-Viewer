import { donationModel } from "../../dataBase/Model/Donation.model.js";
import { charityModel } from "../../dataBase/Model/Charity.model.js";
import { advancedPagination } from '../../Middleware/pagination.middleware.js';
import cloudinary from "../../Utils/UploadFile/cloudnairy.uploadServer.js";
// ===================== upload to cloudinary ======================
const uploadToCloud = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `donations/${userId}` },
      (error, result) => {
        error ? reject(error) : resolve(result);
      }
    ).end(buffer);
  });
};
// ===================== create donation ======================
export const createDonation = async (req, res, next) => {
  const { user } = req;
  const { charityId, type, size, quantity, description } = req.body;

  const charity = await charityModel.findById(charityId);
  if (!charity) {
    return next(new Error("Charity not found", { cause: 404 }));
  }

  const imageUrl = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadToCloud(file.buffer, user._id);
    imageUrl.push({ public_id, secure_url });
  }

  const donation = await donationModel.create({ ...req.body, donorId: user._id, imageUrl });
  return res.status(201).json({ success: true, message: "Donation created successfully", donation });
};
// ===================== get my donations ======================
export const getMyDonations = async (req, res, next) => {
  const { user } = req;
  const data = await advancedPagination(donationModel, { donorId: user._id });
  res.status(200).json({ success: true, data });
};