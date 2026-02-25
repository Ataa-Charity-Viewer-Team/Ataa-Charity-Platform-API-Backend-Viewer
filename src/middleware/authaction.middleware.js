import jwt from "jsonwebtoken";
import { userModel } from "../../../database/model/user.model.js"; // ← صحح المسار

const authAction = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Error("unauthorized token not found", { cause: 401 }));
  }

  let decoded;

  // ✓ decode الأول عشان نجيب الـ id
  decoded = jwt.decode(authorization);

  if (!decoded?.id) {
    return next(new Error("invalid token", { cause: 401 }));
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return next(new Error("unauthorized user not found", { cause: 401 }));
  }

  // ✓ verify مع try/catch
    jwt.verify(
      authorization,
      process.env.ACCESS_SECRET + user.updatedAt.getTime()
    );
  } 
  if (user.verify === false) {
    return next(new Error("verify your account", { cause: 401 }));
    
    req.user = user;
    return next();
  }

export default authAction;