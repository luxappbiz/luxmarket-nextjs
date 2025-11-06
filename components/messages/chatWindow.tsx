"use client";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MessageBubble from '@/components/messages/messageBubble';
import MessageInput from '@/components/messages/messageInput';
import { ConversationItem } from "@/types/messages";
import LoadingSpinner from '@/components/ui/loading-spinner';
import { UserProps } from "@/types/user";
import { Button } from '@/components/ui/button';
import { Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface RawMessage {
  id: string;
  conversation_id?: string;
  user_id: string;
  message: string;
  attachment_id?: string;
  reactions?: null | string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

interface ChatWindowProps {
  currentUser: UserProps;
  authToken: string | null;
  selectedConversation?: ConversationItem | null;
  setSelectedConversation?: (conv: ConversationItem | null) => void;
  showChatDetails: boolean;
  setShowChatDetails: (show: boolean) => void;
}

export default function ChatWindow({
  currentUser,
  authToken,
  selectedConversation,
  showChatDetails,
  setShowChatDetails,
  setSelectedConversation
}: ChatWindowProps) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<RawMessage[]>([]);
  const [paged, setPaged] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fetchingPage, setFetchingPage] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!selectedConversation) return;
    setMessages([]); // Reset messages
    setPaged(0); // Reset pagination
    setHasMoreMessages(true); // Reset pagination end
    setLoading(true);
    getMessages();
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation && paged > 0) {
      getMessages();
    }
  }, [paged]);

  const getMessages = async () => {
    if (!selectedConversation) return;
    setLoading(true);
    const time = Date.now();
    try {
      let api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/wp-json/lux/v1/conversations/${selectedConversation.id}/messages?timestamp=${time}`;
      if (paged) api_url += `&page=${paged}`;
      const res = await axios.get(api_url, {
        headers: { Authorization: `Basic ${authToken}` },
      });
      if (Array.isArray(res.data.messages)) {
        if (res.data.messages.length === 0) {
          setHasMoreMessages(false);
          return;
        }
        const temp_messages = res.data.messages
          .filter((m: RawMessage) => !m.deleted_at) 
          .reverse();
        if (paged) {
          const _prevItems = [...temp_messages, ...messages];
          setMessages(_prevItems);
        } else {
          setMessages(temp_messages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
      setFetchingPage(false);
    }
  };

  const sendMessage = async (newMessage: string) => {
    if (newMessage.trim() === '') return;
    const tempId = `temp-${Date.now()}`;
    const userMessage: RawMessage = {
      id: tempId,
      conversation_id: selectedConversation?.id?.toString(),
      user_id: currentUser.ID,
      message: newMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (!selectedConversation) return;
    const payload = {
      conversation_id: selectedConversation.id,
      user_id: currentUser.ID,
      message: newMessage,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wp-json/lux/v1/conversations/${selectedConversation.id}/messages`,
        payload,
        {
          headers: {
            Authorization: `Basic ${authToken}`,
          },
        }
      );
      if (res.data.message_id) {
        const confirmedMessage: RawMessage = {
          id: res.data.message_id,
          conversation_id: String(selectedConversation.id),
          user_id: currentUser.ID,
          message: newMessage,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? confirmedMessage : msg))
        );
      } else {
        console.error("Message not sent", res.data.error);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    let lastScrollTop = div.scrollTop;
    const handleScroll = () => {
      const currentScrollTop = div.scrollTop;
      const scrollingUp = currentScrollTop < lastScrollTop;
      lastScrollTop = currentScrollTop;
      if (scrollingUp && currentScrollTop < 10 && !fetchingPage && hasMoreMessages) {
        setFetchingPage(true);
        setPaged(prev => prev + 1);
      }
    };
    div.addEventListener('scroll', handleScroll);
    return () => div.removeEventListener('scroll', handleScroll);
  }, [fetchingPage, hasMoreMessages]);

  useEffect(() => {
    if (loading || paged !== 0 || hasScrolledRef.current) return;
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      hasScrolledRef.current = true;
    }
  }, [messages, loading, paged]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto h-[calc(100vh-120px)]">
      <>
        <div className="flex items-center justify-between border-b mb-4">
          <div className='flex gap-2 items-center'>
            <Button
              className="lg:hidden"
              onClick={() => setSelectedConversation?.(null)}
              variant="ghost"
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            {(selectedConversation) && (
              <Link href={`/members/${selectedConversation.other_conversation_user_id}`} className="text-lg font-semibold">
                {selectedConversation.name}
              </Link>
            )}
          </div>
          <Button variant="ghost" onClick={() => setShowChatDetails(!showChatDetails)}>
            <Info className="h-5 w-5" />
          </Button>
        </div>
        {/* {hasMoreMessages && paged > 0 && (
          <div className="text-center">
            <Button onClick={() => {
              setFetchingPage(true);
              setPaged(prev => prev + 1);
            }}>
              Load Earlier Messages
            </Button>
          </div>
        )} */}
        {loading && <LoadingSpinner />}
        {messages.length == 0 && !loading && (
          <div className="text-center text-gray-300 mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4">
          {messages.length > 0 && !loading && (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  currentUserID={currentUser.ID}
                  recipientImage={selectedConversation?.image_url}
                  currentUserImage={currentUser.image}
                  authToken={authToken}
                  onDelete={(id) => setMessages((prev) => prev.filter((m) => m.id !== id))}
                />
              ))}
            </>
          )}
        </div>
        <MessageInput onSend={handleSend} />
      </>
    </div>
  );
}
