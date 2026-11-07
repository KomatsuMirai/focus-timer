import type { WorkingStatus } from "../types";

const getStatusStyle = (status: WorkingStatus, isAchieved: boolean) => {
  if (status === "休憩中") {
    return {
      color: "bg-gray-300/50 text-gray-500",
      text: "休憩中💤",
    };
  }
  if (isAchieved) {
    return {
      color: "bg-amber-100 text-amber-600",
      text: "1分達成✨",
    };
  }
  return {
    color: "bg-blue-100 text-blue-600",
    text: "作業中📝",
  };
};

export { getStatusStyle };
