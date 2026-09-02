import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message, ChatSessionMeta } from './types';
import { fetchConversationHistory, sendMessageStream, stopAgent } from './api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { SourceLibraryModal } from './components/SourceLibraryModal';
import { ParentingToolkitModal } from './components/ParentingToolkitModal';

const SESSIONS_STORAGE_KEY = 'smart_parents_sessions_v1';
const CURRENT_CID_KEY = 'smart_parents_current_cid_v1';

function generateConversationId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const App: React.FC = () => {
  const [conversationId, setConversationId] = useState<string>(() => {
    return localStorage.getItem(CURRENT_CID_KEY) || generateConversationId();
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  
  const [sessions, setSessions] = useState<ChatSessionMeta[]>(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Save current conversation ID
  useEffect(() => {
    localStorage.setItem(CURRENT_CID_KEY, conversationId);
  }, [conversationId]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Load history on initial mount or when conversationId switches
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!conversationId) return;
      const history = await fetchConversationHistory(conversationId);
      if (isMounted && history.length > 0) {
        setMessages(history);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  const updateSessionMeta = useCallback((cid: string, firstMsg: string) => {
    setSessions(prev => {
      const existing = prev.find(s => s.id === cid);
      const title = firstMsg.length > 35 ? `${firstMsg.slice(0, 35)}...` : firstMsg;
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
    setMessages([]);
  }, [conversationId, isStreaming, handleStopStream]);

  const handleDeleteSession = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (id === conversationId) {
      handleNewChat();
    }
  }, [conversationId, handleNewChat]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectTopic={handleSendMessage}
        sessions={sessions}
        currentSessionId={conversationId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenToolkit={() => setIsToolkitOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          onNewChat={handleNewChat}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenToolkit={() => setIsToolkitOpen(true)}
          onToggleMobileSidebar={() => setIsSidebarOpen(prev => !prev)}
          isStreaming={isStreaming}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <ChatContainer
            messages={messages}
            isStreaming={isStreaming}
            onSelectTopic={handleSendMessage}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />

          <ChatInput
            onSendMessage={handleSendMessage}
            onStop={handleStopStream}
            isStreaming={isStreaming}
          />
        </main>
      </div>

      {/* Modals */}
      <SourceLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onAskTopic={handleSendMessage}
      />

      <ParentingToolkitModal
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
        onStartRoleplayChat={handleSendMessage}
      />
    </div>
  );
};

export default App;
