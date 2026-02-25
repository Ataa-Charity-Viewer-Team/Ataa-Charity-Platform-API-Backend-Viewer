import { roles } from "../../database/model/user.model.js";

export const charityEndpoint = {
  createCharity: [roles.admin],
  getAllCharities: [roles.admin],
  getCharity: [roles.admin],
  updateCharity: [roles.admin],
  deleteCharity: [roles.admin]
}