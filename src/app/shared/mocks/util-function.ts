/**
 * 產生特定日期的時間 ISO 字串
 * @param hours 小時
 * @param minutes 分鐘
 * @param daysOffset 相對今天的日期偏移（0: 今天, 1: 明天, -1: 昨天）
 */
export const setTime = (hours: number, minutes: number = 0, daysOffset: number = 0): string => {
  const date: Date = new Date();

  // 1. 先處理日期加減
  if (daysOffset !== 0) {
    date.setDate(date.getDate() + daysOffset);
  }
  
  // 2. 再設定精確時間
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};