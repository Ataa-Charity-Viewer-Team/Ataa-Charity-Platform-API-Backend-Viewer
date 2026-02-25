import { roles } from "../../dataBase/Model/User.model.js";

export const donationEndpoint = {
  createDonation: [roles.user],
  getMyDonations: [roles.user],
};