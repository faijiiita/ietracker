"use server";

import prisma from "@/lib/prisma";
import {
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const DeleteCategory = async (form: DeleteCategorySchemaType) => {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Bad Request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.delete({
    where: {
      userId_name_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
};
