const userSerializer = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    totalXP: user.totalXP,
    createdAt: user.createdAt,
  };
};

module.exports = userSerializer;
