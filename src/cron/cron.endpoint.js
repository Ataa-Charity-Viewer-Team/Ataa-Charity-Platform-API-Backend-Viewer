import { roles } from "../database/model/user.model.js";

export const cronEndpoint = {
  adminReport: roles.admin,
  donationReminder: roles.charity,
};