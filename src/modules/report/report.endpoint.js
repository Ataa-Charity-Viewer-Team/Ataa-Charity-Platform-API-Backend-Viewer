import { roles } from "../../database/model/user.model.js";

export const reportEndpoint = {
  createReport:  [roles.user, roles.charity],
  getAllReports: [roles.admin]
  
}