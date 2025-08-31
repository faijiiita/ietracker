import { getHisoryData } from "@/lib/helpers";
import { Period, Timeframe } from "@/lib/types";
import { HistoryDataSchema } from "@/schema/history";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = HistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHisoryData(
    user.id,
    queryParams.data.timeframe as Timeframe,
    {
      month: queryParams.data.month,
      year: queryParams.data.year,
    } as Period
  );

  return Response.json(data);
};
