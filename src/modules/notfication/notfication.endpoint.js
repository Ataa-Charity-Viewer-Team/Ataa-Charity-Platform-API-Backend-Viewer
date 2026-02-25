import { roles } from "../../database/model/user.model.js";
export const notificationEndpoint = {
  getAllnotifications: roles.user,
  updatenotification: roles.user,
  deletenotification: roles.user,
  markAllAsRead: roles.user,
};

