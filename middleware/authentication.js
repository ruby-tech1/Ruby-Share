import CustomError from "../errors/index.js";
import { isTokenValid, attachCookieToResponse } from "../utils/index.js";
import Token from "../db/models/token.js";
// import { attachCookieToResponse } from "../utils";

const AutheticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      where: {
        userId: payload.user.userId,
        refreshToken: payload.refreshToken,
      },
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    attachCookieToResponse({
      res,
      tokenUser: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

export { AutheticateUser, authorizePermissions };
