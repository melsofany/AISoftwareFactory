import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  createConversation,
  getConversations,
  addMessage,
  getMessages,
  createTask,
  updateTaskStatus,
  addLog,
  getLogs,
} from "../db";
import { processAgentTask } from "../services/deepseek";

export const conversationsRouter = router({
  // Get all conversations for current user
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error("Unauthorized");
    }
    return getConversations(ctx.user.id);
  }),

  // Create a new conversation
  create: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      if (!ctx.user) {
        throw new Error("Unauthorized");
      }
      return createConversation(ctx.user.id, input.title);
    }),

  // Get messages for a conversation
  getMessages: publicProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }: any) => {
      return getMessages(input.conversationId);
    }),

  // Add a message and process with DeepSeek
  addMessage: publicProcedure
    .input(z.object({ conversationId: z.number(), content: z.string() }))
    .mutation(async ({ input }: any) => {
      // Add user message
      await addMessage(input.conversationId, "user", input.content);

      // Get conversation history
      const history = await getMessages(input.conversationId);

      try {
        // Process with DeepSeek
        const assistantResponse = await processAgentTask(
          input.content,
          history.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }))
        );

        // Add assistant response
        await addMessage(input.conversationId, "assistant", assistantResponse);

        return { success: true, response: assistantResponse };
      } catch (error) {
        console.error("Error processing with DeepSeek:", error);
        const errorMessage =
          "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.";
        await addMessage(input.conversationId, "assistant", errorMessage);
        return { success: false, error: errorMessage };
      }
    }),

  // Create a task
  createTask: publicProcedure
    .input(
      z.object({
        conversationId: z.number(),
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      return createTask(input.conversationId, input.title, input.description);
    }),

  // Update task status
  updateTaskStatus: publicProcedure
    .input(
      z.object({
        taskId: z.number(),
        status: z.enum(["pending", "running", "completed", "failed"]),
        result: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateTaskStatus(input.taskId, input.status, input.result);
    }),

  // Add a log entry
  addLog: publicProcedure
    .input(
      z.object({
        taskId: z.number(),
        level: z.enum(["info", "warning", "error", "debug"]),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return addLog(input.taskId, input.level, input.message);
    }),

  // Get logs for a task
  getLogs: publicProcedure
    .input(z.object({ taskId: z.number() }))
    .query(async ({ input }) => {
      return getLogs(input.taskId);
    }),
});
