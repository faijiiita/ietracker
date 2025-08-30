import prisma from "@/lib/prisma";
import { currencies } from "@/lib/constants";

export const getBalanceStats = async (userId: string, from: Date, to: Date) => {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
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
