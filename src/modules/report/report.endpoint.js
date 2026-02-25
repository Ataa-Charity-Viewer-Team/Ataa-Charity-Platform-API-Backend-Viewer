import { roles } from "../../database/model/user.model.js";

export const reportEndpoint = {
  createReport: [roles.admin],
  getAllReports: [roles.admin]
}