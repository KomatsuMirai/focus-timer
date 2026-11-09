import type { WorkingStatus } from "../types";

import { useState, useEffect } from "react";

export function useTimer() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [passedTime, setPassedTime] = useState<number>(0);

  useEffect(() => {
    if (startTime === null) return;
    const upTimer = setInterval(() => {
      setPassedTime((new Date().getTime() - startTime.getTime()) / 1000);
    }, 1000);
    return () => clearInterval(upTimer);
  }, [startTime]);

  const isAchieved = passedTime >= 60;
  const status: WorkingStatus = startTime === null ? "休憩中" : "作業中";

  return {
    startTime,
    passedTime,
    isAchieved,
    status,
    setStartTime,
    setPassedTime,
  };
}
