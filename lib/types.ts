import { getBalanceStats } from "@/lib/helpers";

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
