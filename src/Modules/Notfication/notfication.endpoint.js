import { roles } from "../../dataBase/Model/User.model.js";
export const notificationEndpoint = {
  getAllnotifications: roles.user,
  updatenotification: roles.user,
  deletenotification: roles.user,
  markAllAsRead: roles.user,
};

