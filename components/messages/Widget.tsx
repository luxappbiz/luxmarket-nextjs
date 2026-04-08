"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeAgo } from "@/lib/utils";
import { ConversationItem } from "@/types/messages";
import { UserProps } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MessagesWidgetProps {
  user: UserProps;
  authToken: string | null;
}

const CACHE_KEY = "lux_messages_widget_cache";
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  conversations: ConversationItem[];
  timestamp: number;
}

export default function MessagesWidget({ user, authToken }: MessagesWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load from cache immediately on mount
    loadFromCache();
    // Load fresh data
    loadUnreadCount();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CacheData = JSON.parse(cached);
        setConversations(data.conversations);
        const unreadCount = data.conversations.reduce((acc, convo) => acc + convo.messages_unread_count, 0);
        setTotalUnread(unreadCount);
      }
    } catch (error) {
      console.error("Error loading from cache:", error);
    }
  };
  const saveToCache = (convos: ConversationItem[]) => {
    try {
      const cacheData: CacheData = {
        conversations: convos,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const time = Date.now();
      const api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v2/conversations?timestamp=${time}&per_page=10`;
      const response = await axios.get(api_url, {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });
      const convos: ConversationItem[] = response.data.conversations || [];
      const filteredConvos = convos.filter(c => c.id !== 123);
      const unreadCount = filteredConvos.reduce((acc, convo) => acc + convo.messages_unread_count, 0);
      setTotalUnread(unreadCount);
      setConversations(filteredConvos);
      // Save to cache for next time
      saveToCache(filteredConvos);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const loadConversations = async () => {
    // Step 1: Load from cache first (stale)
    loadFromCache();
    // Step 2: Fetch fresh data in background (revalidate)
    setLoading(true);
    try {
      const time = Date.now();
      const api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v2/conversations?timestamp=${time}&per_page=10`;
      const response = await axios.get(api_url, {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });
      const convos: ConversationItem[] = response.data.conversations || [];
      const filteredConvos = convos.filter(c => c.id !== 123);
      setConversations(filteredConvos);
      const unreadCount = filteredConvos.reduce((acc, convo) => acc + convo.messages_unread_count, 0);
      setTotalUnread(unreadCount);
      // Save fresh data to cache
      saveToCache(filteredConvos);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversationId: number) => {
    router.push(`/messages?conversation=${conversationId}`);
    setIsOpen(false);
  };

  // const latestConversation = conversations[0];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          size="lg"
          // h-14 w-14
          // size="icon"
          variant="outline"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 bg-red-500 text-white">
              {totalUnread > 9 ? "9+" : totalUnread}
            </Badge>
          )}
          Messages
        </Button>
      )}
      {/* Expanded Widget */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300 space-y-0 p-0" style={{ rowGap: 0 }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 pb-3 border-b">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {totalUnread}
                </Badge>
              )}
            </CardTitle>
            <div>
              <Button asChild
                variant="ghost"
                size="icon"
              >
                <Link href="/messages">
                  <Maximize className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {conversations.map((conversation) => {
                    const isGroupChat = conversation.participant_images && conversation.participant_images.length > 1;
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => handleConversationClick(conversation.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        {isGroupChat && conversation.participant_images ? (
                          <div className="relative w-10 h-10 flex-shrink-0">
                            {conversation.participant_images.slice(0, 3).map((imgUrl, idx) => (
                              <Avatar
                                key={idx}
                                className={`absolute border-2 border-background w-7 h-7 ${
                                  idx === 0 ? 'top-0 left-0 z-20' : 
                                  idx === 1 ? 'bottom-0 right-0 z-10' : 
                                  'top-0 right-0 z-0'
                                }`}
                              >
                                <AvatarImage src={imgUrl} alt="" className="object-cover"/>
                                <AvatarFallback className="text-[10px]">
                                  {conversation.name.split(" ")[idx]?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        ) : (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.image_url} alt={conversation.name} className="object-cover"/>
                            <AvatarFallback>
                              {conversation.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate">
                              {conversation.name}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {timeAgo(conversation.updated_at)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.last_message_preview || "No messages yet"}
                          </p>
                        </div>
                        {conversation.messages_unread_count > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {conversation.messages_unread_count}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          {/* <div className="border-t p-3">
            <Button
              className="w-full"
              onClick={() => {
                router.push("/messages");
                setIsOpen(false);
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              View All Messages
            </Button>
          </div> */}
        </Card>
      )}
    </>
  );
}
