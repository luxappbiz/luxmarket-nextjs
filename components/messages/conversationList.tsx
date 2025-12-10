"use client";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils";
import NewConversationDialog from "@/components/messages/NewConversationDialog";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProps } from "@/types/user";
import LoadingSpinner from "../ui/loading-spinner";
import { ConversationItem } from "@/types/messages";

interface ConversationListProps {
  authToken: string | null;
  user: UserProps;
  selectedConversation: ConversationItem | null;
  onSelect: (conversation: ConversationItem) => void;
}

export default function ConversationList({
  authToken,
  user,
  selectedConversation,
  onSelect,
}: ConversationListProps) {
  console.log('ConversationList user', user);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authToken) {
      console.log('ConversationList authToken is null, waiting...');
      return;
    }
    console.log('ConversationList authToken', authToken);
    setLoading(true);
    getConversations(1)
      .then((data) => {
        setConversations(data.conversations);
        setHasMore(data.hasMore);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authToken]);

  useEffect(() => {
    const chatWith = searchParams.get("chatWith");
    if (chatWith) {
      handleConversationCreated(Number(chatWith));
    }
  }, [searchParams]);

  async function getConversations(page: number = 1, perPage: number = 20): Promise<{ conversations: ConversationItem[], hasMore: boolean }> {
    if (!authToken) {
      throw new Error('Auth token is required to fetch conversations');
    }
    const time = Date.now();
    const api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/conversations?timestamp=${time}&paged=${page}&per_page=${perPage}`;
    console.log('getConversations', api_url);
    console.log('authToken', authToken);
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Basic ${btoa(`${user.user_login}:${authToken}`)}`,
      },
    });
    const allConversations: ConversationItem[] = response.data.conversations;
    const filteredConversations = allConversations.filter(convo => convo.id !== 123); // filter unwanted convo
    const pagination = response.data.pagination;
    console.log('pagination', pagination);
    const hasMore = pagination ? pagination.current_page < pagination.total_pages : false;
    return { conversations: filteredConversations, hasMore };
  }

  async function handleConversationCreated(conversationId: number) {
    try {
      // Refresh conversations and auto-select the new one
      const data = await getConversations(1);
      setConversations(data.conversations);
      setHasMore(data.hasMore);
      setCurrentPage(1);
      const matchingConversation = data.conversations.find(
        (c) => c.id.toString() === conversationId.toString()
      );
      if (matchingConversation) {
        onSelect(matchingConversation);
      }
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  }

  async function loadMoreConversations() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await getConversations(nextPage);
      if (data.conversations.length === 0) {
        setHasMore(false);
      } else {
        setConversations(prev => [...prev, ...data.conversations]);
        setHasMore(data.hasMore);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more conversations:', error);
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full lg:w-[352px] border-r p-4 bg-muted/10">
      {loading &&(
         <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
            <LoadingSpinner />
         </div>
      )}
      {!loading && conversations.length > 0 && (
        <>
          <div className="flex flex-row items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <NewConversationDialog 
              authToken={authToken} 
              user={user} 
              onConversationCreated={handleConversationCreated} 
            />
          </div>
          <ScrollArea className="h-[calc(100vh-160px)] pr-2">
            {filteredConversations.map((conversation) => {
              const isGroupChat = conversation.participant_images && conversation.participant_images.length > 1;
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelect(conversation)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition mb-2 ${
                    selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
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
                    <Avatar>
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
                    <div className="font-medium truncate">
                      {conversation.name}
                      {isGroupChat && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({conversation.participant_count || conversation.participant_images?.length || 0})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-end">
                      <small className="block truncate">
                        {conversation.last_message_preview
                          ? conversation.last_message_preview.length > 15
                            ? conversation.last_message_preview.slice(0, 10) + "…"
                            : conversation.last_message_preview
                          : 'No messages yet'}
                      </small>
                      <div className="text-xs text-muted-foreground truncate">
                        {timeAgo(conversation.updated_at)}
                      </div>
                    </div>
                  </div>
                  {conversation.messages_unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {conversation.messages_unread_count}
                    </span>
                  )}
                </div>
              );
            })}
            {hasMore && (
              <div className="flex justify-center py-4">
                <Button
                  onClick={loadMoreConversations}
                  disabled={loadingMore}
                  variant="outline"
                  size="sm"
                >
                  {loadingMore ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Loading...</span>
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
}
