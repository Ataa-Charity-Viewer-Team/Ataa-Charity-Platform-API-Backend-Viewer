import { roles } from "../../dataBase/Model/User.model.js";

export const reportEndpoint={
  createReport:[roles.admin],
  getAllReports:[roles.admin]
}