// utils/chessUtils.ts
export const mapEvaluationToPercentage = (evalScore: number): number => {
    // При evalScore = 0 – равенство; +200 соответствует 100%, -200 – 0%
    let percentage = ((evalScore + 200) / 400) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    return percentage;
  };
  