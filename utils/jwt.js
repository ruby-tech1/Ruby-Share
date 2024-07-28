import jwt from "jsonwebtoken";

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookieToResponse = ({ res, tokenUser, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user: tokenUser } });
  const refreshTokenJWT = createJWT({
    payload: { user: tokenUser, refreshToken },
  });

  const shortExpiration = 1000 * 60 * 60 * 24;
  const longExpiration = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + shortExpiration),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    // maxAge: 1000 * 60 * 15,
  }); // Format : name, value, {options}

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + longExpiration),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

// const attachSingleCookieToResponse = ({ res, tokenUser }) => {
//   const token = createJWT({ payload: tokenUser });

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === "production",
//     signed: true,
//   }); // Format : name, value, {options}
// };

export { createJWT, isTokenValid, attachCookieToResponse };
