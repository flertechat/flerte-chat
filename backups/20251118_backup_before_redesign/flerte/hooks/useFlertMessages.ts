import { useState, useCallback } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
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

  const addAssistantMessage = useCallback((options: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        options,
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
