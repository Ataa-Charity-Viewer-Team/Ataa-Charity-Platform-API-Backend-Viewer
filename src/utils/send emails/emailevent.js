import { EventEmitter } from "events";
import {sendEmails } from "./sendemail.nodemailer.js";

export const emailEmmiter = new EventEmitter();
emailEmmiter.on("sendEmail", async (data) => {
    await sendEmails({
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

});