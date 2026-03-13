// // middleware/checkBlocked.js
import BlockedUser from "../database/model/blockuser.model.js";
export async function checkBlocked(req, res, next) {
  try {

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim()
      || req.socket.remoteAddress;

    // الحل هنا
    const email = req.body?.email;
    const username = req.body?.username;

    const orConditions = [{ ipAddress: ip }];

    if (email) orConditions.push({ email });
    if (username) orConditions.push({ username });

    const blocked = await BlockedUser.findOne({ $or: orConditions });

    if (blocked) {
      return res.status(403).json({
        message:
          "You are blocked by the Salek team for security reasons and to protect your privacy and security. please contact us for more information"
      });
    }

    req.clientIp = ip;
    next();

  } catch (err) {
    next(err);
  }
}

// export async function checkBlocked(req, res, next) {
//   try {
//     // ── جيب الـ IP من الـ Request مش من الـ Body ──
//     const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() 
//              || req.socket.remoteAddress;

//     const { email, username } = req.body;

//     // ── بني الـ Query بس على الـ Fields الموجودة ──
//     const orConditions = [{ ipAddress: ip }];
//     if (email)    orConditions.push({ email });
//     if (username) orConditions.push({ username });

//     const blocked = await BlockedUser.findOne({ $or: orConditions });

//     if (blocked) {
//       return res.status(403).json({ message: "You are blocked by the Salek team for security reasons and to protect your privacy and security. please contact us for more information" });
//     }

//     req.clientIp = ip;
//     next();

//   } catch (err) {
//     next(err);
//   }
// }