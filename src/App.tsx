import type { WorkingStatus, WorkingRecord } from "./types";
import { useEffect, useState } from "react";

import { History } from "lucide-react";
import { CircularProgressCombined } from "@/components/ui/circular-progress";
import {
  timeToString,
  secondsToString,
  dateToLocaleString,
} from "./lib/formatDateTime";
import { getStatusStyle } from "./lib/statusStyle";
import { TodayRecordFrame } from "./components/TodayRecordFrame";

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

  const statusStyle = getStatusStyle(status, isAchieved);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-mist-200 text-mist-800">
      <h1 className="text-4xl font-semibold">まずは1分タイマー</h1>
      <div className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl bg-mist-100 py-5 font-semibold shadow-2xl">
        <p
          className={`flex w-1/3 justify-center rounded-full py-1 transition-colors duration-500 ${statusStyle.color}`}
        >
          {statusStyle.text}
        </p>
        <CircularProgressCombined
          value={isAchieved ? 100 : ((60 - passedTime) / 60) * 100}
          size={220}
          thickness={18}
          textClass={`font-bold ${passedTime >= 6000 ? "text-[50px]" : "text-6xl"}`}
          rangeClass={isAchieved ? "text-amber-500/80" : "text-blue-300"}
        >
          {timeToString(passedTime)}
        </CircularProgressCombined>
        <p className={`${isAchieved ? "" : "invisible"} text-sm`}>
          お疲れ様でした。疲れたら休憩しましょう☕
        </p>
        {status === "休憩中" && (
          <button
            className="rounded-lg border-3 border-transparent bg-blue-500 px-4 py-2 text-white active:scale-95"
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
            key={String(isAchieved)}
            className={`animate-in fade-in rounded-lg border-3 px-4 py-2 transition-none duration-400 active:scale-95 ${isAchieved ? "border-amber-600 bg-amber-50 text-amber-600" : "border-blue-400 bg-white text-blue-500"}`}
            onClick={() => stopTimer()}
          >
            {isAchieved ? "終了する" : "中断する"}
          </button>
        )}
      </div>

      {/* 記録部分 */}
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-mist-100 px-4 py-1.5 shadow-2xl">
        <p className="text-xl font-semibold">今日の達成記録</p>
        <div className="flex gap-3 font-bold">
          <TodayRecordFrame value={todayAchievedCount} unit="回" />
          <TodayRecordFrame value={todayMinutes} unit="分" />
        </div>
        <button
          className="flex min-h-11 items-center gap-0.5 self-end text-sm"
          onClick={() => setIsHistoryOpen(true)}
        >
          <History className="size-4" />
          履歴を表示
        </button>
      </div>
      {isHistoryOpen && (
        <div
          onClick={() => setIsHistoryOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-4/5 w-1/2 flex-col rounded-xl bg-white p-2"
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
            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
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
