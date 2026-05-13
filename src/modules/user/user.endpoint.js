// import { roles } from "../../database/model/user.model.js";

// export const userEndpoint = {
//   getProfile: [roles.user],
//   updateProfile: [roles.user],
//   changePassword: [roles.user],
//   deleteAccount: [roles.user],
//   getAllUsers: [roles.admin],
//   getUser: [roles.admin],
//   deleteUser: [roles.admin]
// }
import { roles } from "../../database/model/user.model.js";

export const userEndpoint = {
  // إصلاح: charity محتاج يوصل لبروفايله زي الـ user
  getProfile:     [roles.user, roles.charity, roles.admin],
  updateProfile:  [roles.user, roles.charity,roles.admin],
  changePassword: [roles.user, roles.charity,roles.admin],
  deleteAccount:  [roles.user, roles.charity,roles.admin],
  // admin فقط
  getAllUsers: [roles.admin],
  getUser:    [roles.admin],
  deleteUser: [roles.admin],
};
