// import mongoose from "mongoose";

// export const charitySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User_Data",
//       required: true,
//     },
//     charityName: {
//       type: String,
//       required: [true, "Name is required"],
//       minlength: [3, "Name must be at least 3 characters"],
//       maxlength: [30, "Name must not exceed 30 characters"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       match: [
//         /^[a-zA-Z]{1,}\d{0,}[a-zA-Z0-9]{1,}[@][a-z]{1,}[\.](com|\.edu|\.net){1,3}$/,
//         "Invalid email format",
//       ],
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: [true, "Phone is required"],
//       trim: true,
//     },
//     address: {
//       type: String,
//       minlength: [5, "Address must be at least 5 characters"],
//       maxlength: [100, "Address must not exceed 100 characters"],
//       required: [true, "Address is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Description is required"],
//       minlength: [10, "Description must be at least 10 characters"],
//       maxlength: [500, "Description must not exceed 500 characters"],
//     },
//     license: {
//     type: String,
//     trim: true,
//     unique: true
//     },
//   },
//   {
//     timestamps: true,
//     collection: "Charity",
//   }
// );

// export const charityModel = mongoose.model("Charity", charitySchema);
import mongoose from "mongoose";

export const charityApprovalStatus = {
  pending:  "pending",
  approved: "approved",
  rejected: "rejected",
};

export const charitySchema = new mongoose.Schema(
  {
    // ربط الجمعية بالـ User اللي سجلها
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
      unique: true,
    },
    charityName: {
      type: String,
      required: [true, "Charity name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must not exceed 30 characters"],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [100, "Address must not exceed 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    // الأدمن يوافق أو يرفض
    approvalStatus: {
      type: String,
      enum: Object.values(charityApprovalStatus),
      default: charityApprovalStatus.pending,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "Charity",
  }
);

export const charityModel = mongoose.model("Charity", charitySchema);
