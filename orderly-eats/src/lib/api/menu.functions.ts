import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getMenu, getMenuItem } from "./menu.server";

export const getMenuItems = createServerFn({ method: "POST" }).handler(async () => {
  return getMenu();
});

export const getMenuItemById = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const item = getMenuItem(data.id);
    if (!item) throw new Error("Menu item not found");
    return item;
  });
