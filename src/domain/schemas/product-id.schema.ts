import z from "zod";

export const productIdSchema = z.object({
  id: z.string().uuid()
});

export type ProductIdSchemaType = z.infer<typeof productIdSchema>;