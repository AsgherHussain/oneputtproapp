export const formatDate = dateString => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} | ${hours}:${minutes}`;
};

export const dataMapperPutValues = values => {
  // Given API data
  const progressPut = (1 - (values.score_putt - 1) / 9) * 100;
  const backStrokeData = JSON.parse(values.back_stroke);
  const frontStrokeData = JSON.parse(values.front_stroke);

  const bbstrokeRatio = values.bbstroke_ratio;
  const loftAngle = values.loft_angle;

  const averageBackRotation =
    backStrokeData.reduce((sum, data) => sum + data[3], 0) /
    backStrokeData.length;
  const averageFrontRotation =
    frontStrokeData.reduce((sum, data) => sum + data[3], 0) /
    frontStrokeData.length;

  const backStrokeLength = Math.sqrt(
    (backStrokeData[backStrokeData.length - 1][1] - backStrokeData[0][1]) ** 2 +
      (backStrokeData[backStrokeData.length - 1][2] - backStrokeData[0][2]) **
        2,
  );

  const frontStrokeLength = Math.sqrt(
    (frontStrokeData[frontStrokeData.length - 1][1] - frontStrokeData[0][1]) **
      2 +
      (frontStrokeData[frontStrokeData.length - 1][2] -
        frontStrokeData[0][2]) **
        2,
  );

  const backStrokeTime =
    backStrokeData[backStrokeData.length - 1][0] - backStrokeData[0][0];
  const frontStrokeTime =
    frontStrokeData[frontStrokeData.length - 1][0] - frontStrokeData[0][0];

  const totalStrokeTime = backStrokeTime + frontStrokeTime;

  const impactStrokeSpeedPlaceholder = 12; // Placeholder for the sake of completing this task

  const loft = loftAngle;

  const lie = values.ang_lie_imp;

  const rotationChangePlaceholder = 12; // Placeholder for the sake of completing this task

  return {
    averageBackRotation,
    backStrokeLength,
    backStrokeTime,
    averageFrontRotation,
    frontStrokeLength,
    frontStrokeTime,
    totalStrokeTime,
    bbstrokeRatio,
    impactStrokeSpeedPlaceholder,
    loft,
    lie,
    rotationChangePlaceholder,
    progressPut,
  };
};
