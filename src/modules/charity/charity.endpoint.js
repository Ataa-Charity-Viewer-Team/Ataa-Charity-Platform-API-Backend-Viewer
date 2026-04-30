// import { roles } from "../../database/model/user.model.js";

// export const charityEndpoint = {
//   createCharity: [roles.admin],
//   getAllCharities: [roles.admin,roles.user],
//   getCharity: [roles.admin,roles.user],
//   updateCharity: [roles.admin],
//   deleteCharity: [roles.admin]
// }
import { roles } from "../../database/model/user.model.js";

export const charityEndpoint = {
  createCharity: [roles.admin],
  getAllCharities: [roles.admin,roles.user],
  getCharity: [roles.admin,roles.user],
  updateCharity: [roles.admin],
  deleteCharity: [roles.admin]
}