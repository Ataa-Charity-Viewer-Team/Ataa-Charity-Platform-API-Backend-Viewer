import { donationModel } from "../../database/model/donation.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { advancedPagination } from '../../middleware/pagination.middleware.js';
import cloudinary from "../../utils/uploadfile/cloudnairy.uploadserver.js";

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
  const { charityId, description } = req.body;

  let items;
  try {
    items = typeof req.body.items === "string"
      ? JSON.parse(req.body.items)
      : req.body.items;
  } catch {
    return next(new Error("Items format is invalid", { cause: 400 }));
  }

  if (!items || items.length === 0) {
    return next(new Error("At least one item is required", { cause: 400 }));
  }

  const charity = await charityModel.findById(charityId);
  if (!charity) {
    return next(new Error("Charity not found", { cause: 404 }));
  }

  const imageUrl = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const { secure_url, public_id } = await uploadToCloud(file.buffer, user._id);
      imageUrl.push({ public_id, secure_url });
    }
  }

  const donation = await donationModel.create({
    donorId: user._id,
    charityId,
    description,
    items,
    imageUrl,
  });

  return res.status(201).json({
    success: true,
    message: "Donation created successfully",
    donation,
  });
};

// ===================== get my donations ======================
export const getMyDonations = async (req, res, next) => {
  const { user } = req;
  const data = await advancedPagination(donationModel, { donorId: user._id });
  res.status(200).json({ success: true, data });
};