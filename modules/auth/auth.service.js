const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateTokens");
const hashToken = require("../../utils/hashToken");
const userSerializer = require("../../utils/serializers/user.serializer");

exports.registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHashes.push(hashToken(refreshToken));
  await user.save();

  return {
    user: userSerializer(user),
    accessToken,
    refreshToken,
  };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHashes.push(hashToken(refreshToken));
  await user.save();

  return {
    user: userSerializer(user),
    accessToken,
    refreshToken,
  };
};

exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token required");

  const jwt = require("jsonwebtoken");

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  const hashed = hashToken(refreshToken);

  if (!user || !user.refreshTokenHashes.includes(hashed)) {
    throw new Error("Refresh token mismatch");
  }

  // ROTATION STARTS HERE

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // remove old token
  user.refreshTokenHashes = user.refreshTokenHashes.filter(
    (token) => token !== hashed,
  );

  // add new token
  user.refreshTokenHashes.push(hashToken(newRefreshToken));

  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

exports.logoutUser = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token required");

  const hashed = hashToken(refreshToken);

  const user = await User.findOne({
    refreshTokenHashes: hashed,
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  user.refreshTokenHashes = user.refreshTokenHashes.filter(
    (token) => token !== hashed,
  );

  await user.save();

  return { message: "Logged out successfully" };
};
