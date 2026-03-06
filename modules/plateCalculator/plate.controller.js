const { calculatePlates } = require("../../utils/plateCalculator");

exports.getPlateCalculation = (req, res) => {
  const targetWeight = Number(req.params.targetWeight);
  const barWeight = Number(req.params.barWeight) || 20;

  if (!targetWeight || targetWeight <= barWeight) {
    return res.status(400).json({
      error: "Invalid weight",
    });
  }

  const plates = calculatePlates(targetWeight, barWeight);

  res.json({
    targetWeight,
    barWeight,
    platesPerSide: plates,
  });
};
