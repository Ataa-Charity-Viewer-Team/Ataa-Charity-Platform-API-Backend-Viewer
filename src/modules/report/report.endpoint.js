import { roles } from "../../database/model/user.model.js";

export const reportEndpoint = {
  createReport:  [roles.user ],
  getAllReports: [roles.admin]
}