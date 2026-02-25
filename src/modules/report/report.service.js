import { reportModel } from "../../database/model/report.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";

// =================================== 1) Get All Reports ================================
export const getAllReports = async (req, res, next) => {
  res.json(await advancedPagination(reportModel))
};
// =================================== 2) Create Report ================================
export const createReport = async (req, res, next) => {
  const { description, type } = req.body;
  const { user } = req;
  const existing = await reportModel.findOne({ adminId: req.user._id });
  if (existing) {
    return next(new Error("Already reported", { cause: 400 }));
  }
  const report = await reportModel.create({ adminId: user._id, description, type });
  return res.status(201).json({ success: true, message: "Report created successfully", report });
};

