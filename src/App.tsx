import type { WorkingStatus, WorkingRecord } from "./types";
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<WorkingStatus>("中断");
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

  const stopTimer = () => {
    if (startTime !== null) {
      const duration = (new Date().getTime() - startTime.getTime()) / 1000;
      setRecords([...records, { date: startTime, duration: duration }]);
      setPassedTime(0);
      setStartTime(null);
      setStatus("中断");
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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="font-medium text-6xl">まずは1分タイマー</h1>
      <p>状態:{status}</p>
      {status === "中断" && (
        <button
          className="bg-green-700 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setStatus("作業中");
            setStartTime(new Date());
          }}
        >
          1分だけ始める
        </button>
      )}
      {status === "作業中" && (
        <>
          <p className="text-5xl font-semibold">{timeToString(passedTime)}</p>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-lg"
            onClick={() => stopTimer()}
          >
            作業を中断
          </button>
        </>
      )}

      <button onClick={() => setIsHistoryOpen(true)}>履歴を表示</button>
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
