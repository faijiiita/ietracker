import {
  getBalanceStats,
  getCategoriesStats,
  getHisoryData,
  getHistoryPeriods,
} from "@/lib/helpers";

export type Timezone = {
  label: string;
  name: string;
  tzCode: string;
  utc: string;
};

export type TransactionType = "income" | "expense";

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHisoryData>
>;

export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };

export type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};
