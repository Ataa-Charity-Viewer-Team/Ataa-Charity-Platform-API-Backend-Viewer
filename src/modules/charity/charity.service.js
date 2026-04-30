import { userModel, roles } from "../../database/model/user.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";
import { decryptPhone, encryptPhone } from "../../utils/encryption/encryption.js";
import { customAlphabet } from "nanoid";

export const getAllCharities = async (req, res, next) => {
  const data = await advancedPagination(charityModel); 
  res.status(200).json({ success: true, data });
};

export const getCharity = async (req, res, next) => {
  const { id } = req.params;
  const charity = await charityModel.findById(id);
  if (!charity) {
    return next(new Error("Charity not found", { cause: 404 }));
  }
  if (!charity.phone) {
    return next(new Error("Charity phone not found", { cause: 404 }));
  }
  charity.phone = decryptPhone({ cipherText: charity.phone });
  return res.status(200).json({ success: true, charity });
};

export const createCharity = async (req, res, next) => {
  const { email, phone } = req.body;
 
  const existing = await charityModel.findOne({ email });
  if (existing) {
    return next(new Error("Email already exists", { cause: 409 }));
  }
  
  const encryptedPhone = encryptPhone({ cipherText: phone });
  const charity = await charityModel.create({
    ...req.body,
    phone: encryptedPhone,
    licenseNumber: customAlphabet("0123456789", 8)(), // ID وسيط
    userId: req.user._id
  }); 
  const result = await charityModel.findById(charity._id).select("-__v -phone");
  return res.status(201).json({ success: true, message: "Charity created successfully", charity: result });
};

export const updateCharity = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const { phone } = req.body;
  const charity = await charityModel.findById(id);
  if (!charity) {
    return next(new Error("Charity not found", { cause: 404 }));
  }
if (charity.createdBy?.toString() !== user._id.toString())     
   return next(new Error(" You don't have permission to update this charity", { cause: 403 }));

  if (phone) {
    req.body.phone = encryptPhone({ cipherText: phone });
  }
  const updated = await charityModel.findByIdAndUpdate(id, req.body, { new: true }).select("-__v -phone");
  return res.status(200).json({ success: true, message: "Charity updated successfully", charity: updated });
};

export const deleteCharity = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const charity = await charityModel.findById(id);
  if (!charity) {
    return next(new Error("Charity not found", { cause: 404 }));
  }
if (charity.createdBy?.toString() !== user._id.toString())     
   return next(new Error(" You don't have permission to delete this charity", { cause: 403 }));
  await charityModel.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Charity deleted successfully"
  });
};
