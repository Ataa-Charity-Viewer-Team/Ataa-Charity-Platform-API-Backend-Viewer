import mongoose from "mongoose";

export const donationSize      = ["XS","S","M","L","XL","XXL","3XL","4XL","5XL"];
export const donationCondition = ["جديدة", "مقبولة", "جيدة", "ممتازة"];
export const reminderStatus    = ["none", "reminder_sent", "final_sent"];

export const donationStatus = {
  pending:  "pending",
  accepted: "accepted",
  rejected: "rejected",
  partial:  "partial",
};

// ==================== Item SubSchema ====================
const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    size: {
      type: String,
      enum: donationSize,
      required: [true, "Size is required"],
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"],
      required: [true, "Quantity is required"],
    },
    condition: {
      type: String,
      enum: donationCondition,
      required: [true, "Condition is required"],
    },
    status: {
      type: String,
      enum: Object.values(donationStatus),
      default: donationStatus.pending,
    },
  },
  { _id: false }
);

// ==================== Donation Schema ====================
const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: true,
    },
    items: {
      type: [itemSchema],
      validate: [(val) => val.length > 0, "At least one item is required"],
      required: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    imageUrl: [
      {
        public_id:  { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: Object.values(donationStatus),
      default: donationStatus.pending,
      required: true,
    },
    dateDonation: {
      type: Date,
      default: Date.now,
    },
    reminderStatus: {
      type: String,
      enum: reminderStatus,
      default: "none",
    },
  },
  { timestamps: true, collection: "Donation" }
);

// ==================== Auto Calculate Status ====================
donationSchema.pre("save", function (next) {
  const statuses = this.items.map(i => i.status);

  if (statuses.every(s => s === "accepted"))       this.status = "accepted";
  else if (statuses.every(s => s === "rejected"))  this.status = "rejected";
  else if (statuses.some(s => s === "accepted"))   this.status = "partial";
  else                                              this.status = "pending";

  next();
});

export const donationModel = mongoose.model("Donation", donationSchema);