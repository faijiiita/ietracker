import { currencies } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import timezones from "timezones-list";

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  let userSettigns = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettigns) {
    userSettigns = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: currencies[0].value,
        timezone: timezones[0].tzCode,
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettigns);
};
