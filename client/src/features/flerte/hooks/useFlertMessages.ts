import { useState, useCallback } from "react";
import type { MessageAnalysis } from "@shared/types";

export interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
  analysis?: MessageAnalysis;
}

export const useFlertMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: content.trim(),
      },
    ]);
  }, []);

  const addAssistantMessage = useCallback((options: string[], analysis?: MessageAnalysis) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        options,
        analysis,
      },
    ]);
  }, []);

  const setMessagesFromConversation = useCallback(
    (context: string, generatedOptions: string[]) => {
      const userMessage: Message = {
        role: "user",
        content: context,
      };

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        options: generatedOptions,
      };

      setMessages([userMessage, assistantMessage]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    setMessagesFromConversation,
    clearMessages,
  };
};
