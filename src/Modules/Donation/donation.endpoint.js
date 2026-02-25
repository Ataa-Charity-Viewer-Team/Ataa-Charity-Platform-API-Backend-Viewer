import { roles } from "../../dataBase/model/user.model.js";

export const donationEndpoint = {
  createDonation: [roles.user],
  getMyDonations: [roles.user],
};