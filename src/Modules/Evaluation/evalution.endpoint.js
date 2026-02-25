import { roles } from "../../database/model/user.model.js";

export const evalutionEndpoint = {
  createEvaluation: [roles.user],
  getEvaluation: [roles.user]
}