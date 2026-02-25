import { roles } from "../../dataBase/model/user.model.js";

export const evalutionEndpoint = {
  createEvaluation: [roles.user],
  getEvaluation: [roles.user]
}