import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(4, "password should be greater than 4 chars"),
})

export type LoginType = z.infer<typeof loginSchema>