import { roles } from "../../dataBase/Model/User.model.js";

export const evalutionEndpoint={
  createEvaluation:[roles.user],
  getEvaluation:[roles.user]
}