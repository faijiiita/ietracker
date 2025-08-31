import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateTransactionDialogBox from "./_components/create-transaction-dialogbox";
import { Button } from "@/components/ui/button";
import Overview from "./_components/overview";
import History from "./_components/history";

const DashboardPage = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 p-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialogBox
              trigger={
                <Button
                  variant={"outline"}
                  className="dark:border-emerald-500 dark:bg-emerald-950 hover:dark:bg-emerald-700 border-emerald-500 bg-emerald-700 hover:bg-emerald-500 text-white hover:text-white"
                >
                  New Income 🤑
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialogBox
              trigger={
                <Button
                  variant={"outline"}
                  className="dark:border-rose-500 dark:bg-rose-950 hover:dark:bg-rose-700 border-rose-500 bg-rose-700 hover:bg-rose-500 text-white hover:text-white"
                >
                  New Expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default DashboardPage;
