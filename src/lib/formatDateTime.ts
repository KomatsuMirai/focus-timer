const timeToString = (totalSeconds: number) => {
  const minutes = String(Math.trunc(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(Math.trunc(totalSeconds % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
};
const secondsToString = (seconds: number) => {
  return `${Math.trunc(seconds / 60)}分${Math.trunc(seconds % 60)}秒`;
};

const dateToLocaleString = (date: Date) => {
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export { timeToString, secondsToString, dateToLocaleString };
