import { reportModel } from "../../database/model/report.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";

// =================================== 1) Get All Reports ================================
// export const getAllReports = async (req, res, next) => {
//     const page = Math.max(1, parseInt(req.query.page) || 1);
//   const limit = Math.max(1, parseInt(req.query.limit) || 10);

//   const data = await advancedPagination(reportModel,{},page,limit,
//    "userId userName charityName description senderType createdAt" );
//   return res.status(200).json({ success: true, data });
// };
export const getAllReports = async (req, res, next) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);

  const data = await advancedPagination(
    reportModel, {}, page, limit,
    "userId description senderType createdAt"
  );

  // Populate sender name based on senderType
  const enriched = await Promise.all(
    data.Data.map(async (report) => {
      let senderName = "—";
        if (report.senderType === "user") {
          const u = await userModel.findById(report.userId).select("userName email").lean();
          senderName = u?.userName || u?.email || "—";
        } else if (report.senderType === "charity") {
          const c = await charityModel.findById(report.userId).select("charityName email").lean();
          senderName = c?.charityName || c?.email || "—";
        }

      return {
        ...report,
        userName:    report.senderType === "user"    ? senderName : undefined,
        charityName: report.senderType === "charity" ? senderName : undefined,
      };
    })
  );

  return res.status(200).json({ success: true, data: { ...data, Data: enriched } });
};
// =================================== 2) Create Report ================================
export const createReport = async (req, res, next) => {
  const { description } = req.body;
  const { user } = req;

const report = await reportModel.create({
  userId: req.user._id,
  description,
  senderType: req.user.roleType,
});  return res.status(201).json({
    success: true,
    message: "Report created successfully",
    report,
  });
};






