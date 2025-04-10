function clearAuthCookies(res) {
  res.cookie("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  res.cookie("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
    maxAge: 0,
  });
}

module.exports = { clearAuthCookies };
