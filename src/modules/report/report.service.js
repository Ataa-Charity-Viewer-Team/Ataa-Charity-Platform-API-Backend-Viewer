import { reportModel } from "../../database/model/report.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";

// =================================== 1) Get All Reports ================================
export const getAllReports = async (req, res, next) => {
  const data = await advancedPagination(reportModel);
  return res.status(200).json({ success: true, data });
};
// =================================== 2) Create Report ================================
export const createReport = async (req, res, next) => {
  const { description, type } = req.body;
  const { user } = req;

  const report = await reportModel.create({
    userId: user._id,
    description,
    type,
  });
  return res.status(201).json({
    success: true,
    message: "Report created successfully",
    report,
  });
};






