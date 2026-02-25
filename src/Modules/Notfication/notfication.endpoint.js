import { roles } from "../../dataBase/model/user.model.js";
export const notificationEndpoint = {
  getAllnotifications: roles.user,
  updatenotification: roles.user,
  deletenotification: roles.user,
  markAllAsRead: roles.user,
};

