// ============= jwt token =============
import jwt from "jsonwebtoken";
// ============= user model =============
import { userModel } from "../dataBase/model/user.model.js";
// ============ authaction middleware =============
const authAction = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("unauthorized token not found", { cause: 401 }));
  }
  // ============ verify token and get user id ============
  const decoded = jwt.decode(authorization);
  if (!decoded?.id) {
    return next(new Error("unauthorized not found", { cause: 401 }));
  }

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("unauthorized user not found", { cause: 401 }));
  }
  // =========== verify token and verify user data ============
  jwt.verify(authorization, process.env.ACCESS_SECRET + user.updatedAt.getTime());

  if (user.verify === false) {
    return next(new Error("verify your account", { cause: 401 }));
  }
  // =========== save user data in req.user ============
  req.user = user;
  // ========== next middleware ============
  return next();
};

export default authAction;