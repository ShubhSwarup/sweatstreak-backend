exports.calculatePlates = (targetWeight, barWeight = 20) => {
  const plates = [25, 20, 15, 10, 5, 2.5, 1.25];

  let remaining = (targetWeight - barWeight) / 2;

  const result = [];

  for (const plate of plates) {
    while (remaining >= plate) {
      result.push(plate);
      remaining -= plate;
    }
  }

  return result;
};
