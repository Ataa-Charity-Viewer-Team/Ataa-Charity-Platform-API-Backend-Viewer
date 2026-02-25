import { roles } from "../../dataBase/model/user.model.js";
export const charityEndpoint = {
  getStats: [roles.charity],
  getCharityDonations: [roles.charity],
  getCharityRequests: [roles.charity],
  updateRequestStatus: [roles.charity]
}