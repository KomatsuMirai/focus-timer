// 状態を表す型
export type WorkingStatus = "作業中" | "中断";

// 履歴1件分を表す型
export interface WorkingRecord {
  date: Date; // 作業開始日時
  duration: number; // 作業時間(秒)
}
