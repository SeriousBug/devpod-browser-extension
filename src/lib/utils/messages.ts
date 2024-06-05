import { z } from "zod";

export const UpdateMessage = z.object({
  type: z.literal("devpod-update"),
});
export type UpdateMessage = z.infer<typeof UpdateMessage>;
