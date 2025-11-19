import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message } from "@/lib/aiChat";

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

const createStorageKey = (userId?: string | null) => (userId ? `huroof-ai-history-${userId}` : undefined);

export const useChatHistory = (userId?: string | null) => {
  const storageKey = useMemo(() => createStorageKey(userId), [userId]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!storageKey) {
      setConversations([]);
      return;
    }
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setConversations(JSON.parse(raw));
      } catch {
        setConversations([]);
      }
    } else {
      setConversations([]);
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: Conversation[]) => {
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
    },
    [storageKey],
  );

  const upsertConversation = useCallback(
    (conversationId: string, messages: Message[], title?: string) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === conversationId);
        const updated: Conversation = {
          id: conversationId,
          title: title ?? exists?.title ?? messages[0]?.content?.slice(0, 32) ?? "محادثة جديدة",
          messages,
          createdAt: exists?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const next = exists ? prev.map((c) => (c.id === conversationId ? updated : c)) : [...prev, updated];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const generateId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  };

  const createConversation = useCallback(
    (title?: string) => {
      const id = generateId();
      const now = new Date().toISOString();
      const newConversation: Conversation = {
        id,
        title: title ?? "محادثة جديدة",
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      setConversations((prev) => {
        const next = [newConversation, ...prev];
        persist(next);
        return next;
      });
      return newConversation;
    },
    [persist],
  );

  const removeConversation = useCallback(
    (conversationId: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== conversationId);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { conversations, createConversation, upsertConversation, removeConversation };
};
