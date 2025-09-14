"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const DeleteTransaction = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/wizard");
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
  if (!transaction) {
    throw new Error("Bad Request");
  }

  const userTimezoneDate = new Date(
    transaction.date.toLocaleString("en-US", {
      timeZone: userSettings.timezone,
    })
  );

  await prisma.$transaction([
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    prisma.monthHistory.update({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: userTimezoneDate.getDate(),
          month: userTimezoneDate.getMonth() + 1,
          year: userTimezoneDate.getFullYear(),
        },
      },
      data: {
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    prisma.yearHistory.update({
      where: {
        userId_month_year: {
          userId: user.id,
          month: userTimezoneDate.getMonth() + 1,
          year: userTimezoneDate.getFullYear(),
        },
      },
      data: {
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
};
