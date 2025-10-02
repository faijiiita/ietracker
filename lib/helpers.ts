import prisma from "@/lib/prisma";
import { currencies } from "@/lib/constants";
import { HistoryData, Period, Timeframe } from "@/lib/types";
import { getDaysInMonth } from "date-fns";

export const getBalanceStats = async (userId: string, from: Date, to: Date) => {
  console.log(from);
  console.log(to);

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        // new Date(
        //   from.getUTCFullYear(),
        //   from.getUTCMonth(),
        //   from.getUTCDate(),
        //   from.getUTCHours(),
        //   from.getUTCMinutes(),
        //   from.getUTCSeconds(),
        //   from.getUTCMilliseconds()
        // ),
        lte: to,
        // new Date(
        //   to.getUTCFullYear(),
        //   to.getUTCMonth(),
        //   to.getUTCDate(),
        //   to.getUTCHours(),
        //   to.getUTCMinutes(),
        //   to.getUTCSeconds(),
        //   to.getUTCMilliseconds()
        // ),
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
};

export const GetFormatterForCurrency = (currency: string) => {
  const locale = currencies.find((c) => c.value === currency)?.locale;

  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
};

export const getCategoriesStats = async (
  userId: string,
  from: Date,
  to: Date
) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: new Date(
          from.getUTCFullYear(),
          from.getUTCMonth(),
          from.getUTCDate(),
          from.getUTCHours(),
          from.getUTCMinutes(),
          from.getUTCSeconds(),
          from.getUTCMilliseconds()
        ),
        lte: new Date(
          to.getUTCFullYear(),
          to.getUTCMonth(),
          to.getUTCDate(),
          to.getUTCHours(),
          to.getUTCMinutes(),
          to.getUTCSeconds(),
          to.getUTCMilliseconds()
        ),
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
};

export const getHistoryPeriods = async (userId: string) => {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
};

const getYearHistoryData = async (userId: string, year: number) => {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const historyData: HistoryData[] = [];

  for (let i = 1; i <= 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    historyData.push({ year, month: i - 1, income, expense });
  }

  return historyData;
};

const getMonthHistoryData = async (
  userId: string,
  year: number,
  month: number
) => {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const historyData: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));

  for (let i = 1; i <= daysInMonth; i++) {
    let income = 0;
    let expense = 0;

    const day = result.find((row) => row.day === i);
    if (day) {
      income = day._sum.income || 0;
      expense = day._sum.expense || 0;
    }

    historyData.push({ income, expense, year, month: month - 1, day: i });
  }

  return historyData;
};

export const getHisoryData = async (
  userId: string,
  timeframe: Timeframe,
  period: Period
) => {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
};

export const getTransactionsHistory = async (
  userId: string,
  from: Date,
  to: Date
) => {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error("User Settings not found");
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formatter.format(transaction.amount),
  }));
};
