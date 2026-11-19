import type { DailySummary, WorkingRecord } from "../types";
import { dateToLocaleString } from "./formatDateTime";

const collectDailySummaries = (records: WorkingRecord[]): DailySummary[] => {
  const dailySummaries: DailySummary[] = [];
  for (const record of records) {
    const date = dateToLocaleString(record.date);
    const found = dailySummaries.find((summary) => summary.date === date);
    if (found) {
      found.count += 1;
      found.duration += record.duration;
      continue;
    }
    dailySummaries.push({ date: date, count: 1, duration: record.duration });
  }
  return dailySummaries;
};

export { collectDailySummaries };
