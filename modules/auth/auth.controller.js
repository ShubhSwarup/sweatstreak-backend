const authService = require("./auth.service");

exports.register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.status(200).json(tokens);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.logoutUser(refreshToken);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
