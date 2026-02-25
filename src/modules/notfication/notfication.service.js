import { notificationStatus, notificationModel } from "../../database/model/notification.model.js";
import { advancedPagination } from "../../middleware/pagination.middleware.js";
// ===================1) GET ALL notificationS ===================
export const getAllnotifications = async (req, res, next) => {
  const { user } = req;
  const data = await advancedPagination(notificationModel, { userId: user._id });
  res.status(200).json({ success: true, data });
};
// ===================2) UPDATE notification ===================
export const updatenotification = async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const notification = await notificationModel.findOneAndUpdate(
    { _id: id, userId: user._id },
    { status: notificationStatus.read },
    { new: true }
  );
  if (!notification) {
    return next(new Error("notification not found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, notification });
};
// ===================3) MARK ALL AS READ ===================
export const markAllAsRead = async (req, res, next) => {
  const { user } = req;
  const result = await notificationModel.updateMany({ userId: user._id, status: notificationStatus.unread }, { status: notificationStatus.read });
  if (!result.matchedCount) {
    return next(new Error("No unread notifications found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, message: "All notifications marked as read" });
};
// ===================4) DELETE notification ===================
export const deletenotification = async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const notification = await notificationModel.findOneAndDelete({ _id: id, userId: user._id });
  if (!notification) {
    return next(new Error("notification not found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, message: "notification deleted successfully" });
};
