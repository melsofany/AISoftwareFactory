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
    try {
      if (!ctx.user) {
        console.warn("[Conversations] Unauthorized access attempt to list conversations");
        throw new Error("Unauthorized");
      }
      const conversations = await getConversations(ctx.user.id);
      console.log(`[Conversations] Retrieved ${conversations.length} conversations for user ${ctx.user.id}`);
      return conversations;
    } catch (error) {
      console.error("[Conversations] Error listing conversations:", error);
      throw error;
    }
  }),

  // Create a new conversation
  create: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      try {
        if (!ctx.user) {
          console.warn("[Conversations] Unauthorized access attempt to create conversation");
          throw new Error("Unauthorized");
        }
        const result = await createConversation(ctx.user.id, input.title);
        console.log(`[Conversations] Created new conversation for user ${ctx.user.id}`);
        return result;
      } catch (error) {
        console.error("[Conversations] Error creating conversation:", error);
        throw error;
      }
    }),

  // Get messages for a conversation
  getMessages: publicProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }: any) => {
      try {
        const messages = await getMessages(input.conversationId);
        console.log(`[Conversations] Retrieved ${messages.length} messages for conversation ${input.conversationId}`);
        return messages;
      } catch (error) {
        console.error("[Conversations] Error getting messages:", error);
        throw error;
      }
    }),

  // Add a message and process with DeepSeek
  addMessage: publicProcedure
    .input(z.object({ conversationId: z.number(), content: z.string() }))
    .mutation(async ({ input }: any) => {
      try {
        // Add user message
        await addMessage(input.conversationId, "user", input.content);
        console.log(`[Conversations] Added user message to conversation ${input.conversationId}`);

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
          console.log(`[Conversations] Added assistant response to conversation ${input.conversationId}`);

          return { success: true, response: assistantResponse };
        } catch (error) {
          console.error("[Conversations] Error processing with DeepSeek:", error);
          const errorMessage =
            "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.";
          await addMessage(input.conversationId, "assistant", errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error("[Conversations] Error adding message:", error);
        throw error;
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
      try {
        const result = await createTask(input.conversationId, input.title, input.description);
        console.log(`[Conversations] Created task for conversation ${input.conversationId}`);
        return result;
      } catch (error) {
        console.error("[Conversations] Error creating task:", error);
        throw error;
      }
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
      try {
        const result = await updateTaskStatus(input.taskId, input.status, input.result);
        console.log(`[Conversations] Updated task ${input.taskId} status to ${input.status}`);
        return result;
      } catch (error) {
        console.error("[Conversations] Error updating task status:", error);
        throw error;
      }
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
      try {
        const result = await addLog(input.taskId, input.level, input.message);
        console.log(`[Conversations] Added ${input.level} log for task ${input.taskId}`);
        return result;
      } catch (error) {
        console.error("[Conversations] Error adding log:", error);
        throw error;
      }
    }),

  // Get logs for a task
  getLogs: publicProcedure
    .input(z.object({ taskId: z.number() }))
    .query(async ({ input }) => {
      try {
        const logs = await getLogs(input.taskId);
        console.log(`[Conversations] Retrieved ${logs.length} logs for task ${input.taskId}`);
        return logs;
      } catch (error) {
        console.error("[Conversations] Error getting logs:", error);
        throw error;
      }
    }),
});
