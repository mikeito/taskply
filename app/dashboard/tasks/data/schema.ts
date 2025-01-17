import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  createdAt: z.string(),
  deadline: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export const inserttaskSchema = taskSchema.pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  deadline: true,
}).extend({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
  status: z.enum(["TODO", "PENDING", "INREVIEW", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  deadline: z.date({required_error: "A deadline is required.", invalid_type_error: "Invalid date format"}),
});

export type TaskInsert = z.infer<typeof inserttaskSchema>;