import { roles } from "../../database/model/user.model.js";
export const charityEndpoint = {
  getStats: [roles.charity],
  getCharityDonations: [roles.charity],
  getCharityRequests: [roles.charity],
  getAcceptedDonations: [roles.charity],
}