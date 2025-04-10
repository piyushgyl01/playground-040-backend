function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
    maxAge: 15 * 60 * 1000,
  });
}

module.exports = { setAuthCookies };
