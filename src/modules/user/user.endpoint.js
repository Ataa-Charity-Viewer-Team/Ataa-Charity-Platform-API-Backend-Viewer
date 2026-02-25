import { roles } from "../../database/model/user.model.js";

export const userEndpoint = {
  getProfile: [roles.user],
  updateProfile: [roles.user],
  changePassword: [roles.user],
  deleteAccount: [roles.user],
  getAllUsers: [roles.admin],
  updateUserRole: [roles.admin],
  deleteUser: [roles.admin]
}