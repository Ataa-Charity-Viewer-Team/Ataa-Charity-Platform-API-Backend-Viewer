import { roles } from "../../dataBase/model/user.model.js";

export const reportEndpoint = {
  createReport: [roles.admin],
  getAllReports: [roles.admin]
}