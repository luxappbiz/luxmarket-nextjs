"use client";
import React, { useState, useEffect } from "react";
import ChatWindow from "./chatWindow";
import ConversationList from "./conversationList";
import { UserProps } from "@/types/user";
import { ConversationItem } from "@/types/messages";
import ChatDetails from "@/components/messages/chatDetails";

interface MessagesContainerProps {
  user: UserProps;
  authToken: string | null;
}

export default function MessagesContainer({ user, authToken }: MessagesContainerProps) {
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [showChatDetails, setShowChatDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex shadow-sm h-[calc(100vh-70px)]">
      {(!isMobile || (isMobile && !selectedConversation)) && (
        <div className={`w-full lg:w-[350px] border-r bg-muted/10`}>
          <ConversationList
            authToken={authToken}
            user={user}
            selectedConversation={selectedConversation}
            onSelect={setSelectedConversation}
          />
        </div>
      )}
      {(!isMobile || (isMobile && selectedConversation)) && (
        <div className="flex-1 p-4 bg-background flex flex-col h-full">
          {selectedConversation ? (
            <div className="flex flex-row h-full">
              <ChatWindow
                currentUser={user}
                authToken={authToken}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
                showChatDetails={showChatDetails}
                setShowChatDetails={setShowChatDetails}
              />
              {showChatDetails && (
                <ChatDetails
                  currentUser={user}
                  authToken={authToken}
                  selectedConversation={selectedConversation}
                />
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center text-muted-foreground h-full">
              Select a conversation to start a messages chat.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
