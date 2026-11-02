import type { WorkingStatus, WorkingRecord } from "./types";
import { useEffect, useState } from "react";

import { CircularProgressCombined } from "@/components/ui/circular-progress";

function App() {
  const [status, setStatus] = useState<WorkingStatus>("休憩中");
  const [records, setRecords] = useState<WorkingRecord[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [passedTime, setPassedTime] = useState<number>(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    if (startTime === null) return;
    const upTimer = setInterval(() => {
      setPassedTime((new Date().getTime() - startTime.getTime()) / 1000);
    }, 1000);
    return () => clearInterval(upTimer);
  }, [startTime]);

  const isAchieved = passedTime >= 60;
  const stopTimer = () => {
    if (startTime !== null) {
      if (isAchieved) {
        const duration = (new Date().getTime() - startTime.getTime()) / 1000;
        setRecords([...records, { date: startTime, duration: duration }]);
      }
      setPassedTime(0);
      setStartTime(null);
      setStatus("休憩中");
    }
  };

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
  const today = dateToLocaleString(new Date());
  const todayRecords = records.filter(
    (record) => dateToLocaleString(record.date) === today,
  );
  const todayAchievedCount = todayRecords.length;
  const todaySeconds = todayRecords.reduce(
    (total, record) => total + record.duration,
    0,
  );
  const todayMinutes = Math.trunc(todaySeconds / 60);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-3  bg-mist-200  text-mist-800">
      <h1 className="font-semibold text-4xl">まずは1分タイマー</h1>
      <div className="flex flex-col items-center bg-mist-100 rounded-2xl w-full max-w-sm py-5 gap-2 shadow-2xl font-semibold">
        <p>状態:{status}</p>
        <CircularProgressCombined
          value={isAchieved ? 100 : ((60 - passedTime) / 60) * 100}
          size={190}
          thickness={15}
          textClass={`font-bold ${passedTime >= 6000 ? "text-[42px]" : "text-5xl"}`}
          rangeClass={isAchieved ? "text-amber-500/80" : "text-blue-300"}
        >
          {timeToString(passedTime)}
        </CircularProgressCombined>
        <p className={isAchieved ? "" : "invisible"}>
          1分達成✨いつやめてもOKです
        </p>
        {status === "休憩中" && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg border-3 border-transparent"
            onClick={() => {
              setStatus("作業中");
              setStartTime(new Date());
            }}
          >
            1分だけ始める
          </button>
        )}
        {status === "作業中" && (
          <button
            className={`px-4 py-2 rounded-lg border-3 ${isAchieved ? "bg-amber-50 text-amber-600 border-amber-600" : " bg-white text-blue-500  border-blue-400"}`}
            onClick={() => stopTimer()}
          >
            {isAchieved ? "終了する" : "中断する"}
          </button>
        )}
      </div>
      <div
        className="flex flex-col items-center bg-mist-100 rounded-2xl w-full max-w-sm 
       py-5 shadow-2xl"
      >
        <p className="font-semibold">今日の記録</p>
        <p>
          {todayAchievedCount}回{todayMinutes}分
        </p>
        <button onClick={() => setIsHistoryOpen(true)}>履歴を表示</button>
      </div>
      {isHistoryOpen && (
        <div
          onClick={() => setIsHistoryOpen(false)}
          className="flex fixed inset-0 items-center justify-center bg-black/50 "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-1/2 h-4/5 bg-white rounded-xl p-2 "
          >
            <div className="flex justify-between">
              <h2 className="text-2xl">履歴</h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-3xl"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <ul className="flex flex-col flex-1 gap-2 overflow-y-auto">
              {records.map((record) => (
                <li key={record.date.getTime()} className="flex gap-2">
                  <span>{dateToLocaleString(record.date)}</span>
                  <span>{secondsToString(record.duration)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
