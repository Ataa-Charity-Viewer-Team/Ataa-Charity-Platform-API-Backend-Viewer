import { roles } from "../../database/model/user.model.js";
export const notificationEndpoint = {
  getAllnotifications: [roles.user,roles.charity],
  updatenotification: [roles.user,roles.charity],
  deletenotification: [roles.user,roles.charity],
  markAllAsRead: [roles.user,roles.charity]
};

