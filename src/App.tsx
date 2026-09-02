import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message, ChatSessionMeta } from './types';
import { fetchConversationHistory, sendMessageStream, stopAgent } from './api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';

const SESSIONS_STORAGE_KEY = 'smart_parents_sessions_v1';
const CURRENT_CID_KEY = 'smart_parents_current_cid_v1';
const THEME_STORAGE_KEY = 'smart_parents_theme_v1';
const getMessagesStorageKey = (cid: string) => `smart_parents_messages_${cid}`;

function generateConversationId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [conversationId, setConversationId] = useState<string>(() => {
    return localStorage.getItem(CURRENT_CID_KEY) || generateConversationId();
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const initialCid = localStorage.getItem(CURRENT_CID_KEY);
    if (initialCid) {
      try {
        const cached = localStorage.getItem(getMessagesStorageKey(initialCid));
        if (cached) return JSON.parse(cached);
      } catch {
        // ignore parse error
      }
    }
    return [];
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  
  const [sessions, setSessions] = useState<ChatSessionMeta[]>(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Save current conversation ID
  useEffect(() => {
    localStorage.setItem(CURRENT_CID_KEY, conversationId);
  }, [conversationId]);

  // Save sessions list to localStorage
  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Save active messages of current session to localStorage whenever they change
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      localStorage.setItem(getMessagesStorageKey(conversationId), JSON.stringify(messages));
    }
  }, [conversationId, messages]);

  // Load history when conversationId switches
  useEffect(() => {
    let isMounted = true;

    // 1. Try local cache first for instant load
    try {
      const cached = localStorage.getItem(getMessagesStorageKey(conversationId));
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }

    // 2. Fetch server history sync as fallback
    (async () => {
      if (!conversationId) return;
      const history = await fetchConversationHistory(conversationId);
      if (isMounted && history.length > 0) {
        setMessages(history);
        localStorage.setItem(getMessagesStorageKey(conversationId), JSON.stringify(history));
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  const updateSessionMeta = useCallback((cid: string, firstMsg: string) => {
    setSessions(prev => {
      const existing = prev.find(s => s.id === cid);
      const title = firstMsg.length > 32 ? `${firstMsg.slice(0, 32)}...` : firstMsg;
      if (existing) {
        return prev.map(s => s.id === cid ? { ...s, lastMessage: title, timestamp: Date.now() } : s);
      }
      return [{ id: cid, title, lastMessage: title, timestamp: Date.now() }, ...prev];
    });
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const assistantPlaceholderId = `assistant_${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages(prev => {
      const next = [...prev, userMessage, assistantPlaceholder];
      if (prev.length === 0) {
        updateSessionMeta(conversationId, text);
      }
      return next;
    });

    setIsStreaming(true);

    let accumulatedContent = '';

    const ctrl = sendMessageStream(
      text,
      {
        onTextDelta: (delta: string) => {
          accumulatedContent += delta;
          setMessages(prev => {
            return prev.map(m => {
              if (m.id === assistantPlaceholderId) {
                return { ...m, content: accumulatedContent };
              }
              return m;
            });
          });
        },
        onToolCalled: () => {},
        onImage: () => {},
        onDone: () => {
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
        onError: () => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessages(prev => {
            return prev.map(m => {
              if (m.id === assistantPlaceholderId) {
                return {
                  ...m,
                  content: m.content ? `${m.content}\n\n*[Catatan: Terjadi kendala koneksi AI Gateway]*` : 'Mohon maaf, terjadi kendala saat menghubungi AI Gateway EdgeOne. Silakan coba sesaat lagi.',
                };
              }
              return m;
            });
          });
        },
      },
      conversationId,
    );

    abortControllerRef.current = ctrl;
  }, [conversationId, isStreaming, updateSessionMeta]);

  const handleStopStream = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    await stopAgent(conversationId);
    setIsStreaming(false);
  }, [conversationId]);

  const handleNewChat = useCallback(() => {
    if (isStreaming) {
      handleStopStream();
    }
    const newCid = generateConversationId();
    setConversationId(newCid);
    setMessages([]);
  }, [isStreaming, handleStopStream]);

  const handleSelectSession = useCallback((id: string) => {
    if (id === conversationId) return;
    if (isStreaming) {
      handleStopStream();
    }
    setConversationId(id);
    try {
      const cached = localStorage.getItem(getMessagesStorageKey(id));
      if (cached) {
        setMessages(JSON.parse(cached));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
  }, [conversationId, isStreaming, handleStopStream]);

  const handleDeleteSession = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    localStorage.removeItem(getMessagesStorageKey(id));
    if (id === conversationId) {
      handleNewChat();
    }
  }, [conversationId, handleNewChat]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        sessions={sessions}
        currentSessionId={conversationId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        <Header
          onNewChat={handleNewChat}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          theme={theme}
          onToggleTheme={toggleTheme}
          isStreaming={isStreaming}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <ChatContainer
            messages={messages}
            isStreaming={isStreaming}
            onSelectTopic={handleSendMessage}
          />

          <ChatInput
            onSendMessage={handleSendMessage}
            onStop={handleStopStream}
            isStreaming={isStreaming}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
