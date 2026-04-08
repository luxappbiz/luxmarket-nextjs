import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import axios from 'axios';

interface RawMessage {
  id: string;
  conversation_id?: string;
  user_id: string;
  message: string;
  attachment_id?: string;
  image_url?: string;
  reactions?: null | string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

interface MessageProps {
  message: RawMessage;
  currentUserID: string;
  recipientImage?: string;
  currentUserImage?: string;
  authToken: string | null; // ✅ Add this line
  onDelete?: (id: string) => void; // 👈 add this
}

const emojiOptions = ['❤️', '😂', '😮', '😢', '👍', '👎', '🔥', '🎉'];

export default function MessageBubble({ authToken, message, currentUserID, recipientImage, currentUserImage, onDelete }: MessageProps) {
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [reactions, setReactions] = useState<{ user_id: string; emoji: string }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMe = message.user_id === currentUserID;

  useEffect(() => {
    if (!message.reactions) return;
    try {
      let reactionsData: string | { user_id: string; emoji: string }[] = message.reactions;
      if (typeof reactionsData === 'string') {
        reactionsData = reactionsData.trim().replace(/\\"/g, '"');
      }
      while (typeof reactionsData === 'string') {
        reactionsData = JSON.parse(reactionsData);
      }
      if (Array.isArray(reactionsData)) {
        setReactions(reactionsData);
        const temp_my_reaction = reactionsData.find(
          (reaction) => reaction.user_id === currentUserID
        );
        setMyReaction(temp_my_reaction ? temp_my_reaction.emoji : null);
      } else {
        console.warn('Parsed reactions are not an array:', reactionsData);
      }
    } catch (e) {
      console.error('Failed to parse reactions JSON:', e, message.reactions);
    }
  }, [message.reactions, currentUserID]);


  const handleReaction = async (emoji: string) => {
    setMyReaction(emoji);
    setShowEmojiPicker(false);

    const updatedReactions = [
      ...reactions.filter((r) => r.user_id !== currentUserID),
      { user_id: currentUserID, emoji }
    ];
    setReactions(updatedReactions);

    // ✅ Send to backend
    try {
      const api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/conversations/${message.conversation_id}/messages/${message.id}`;
      await axios.put(api_url, {
        message: message.message,
        reactions: JSON.stringify(updatedReactions),
      }, {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });
    } catch (err) {
      console.error('Failed to update reaction:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://api.luxclub.com/wp-json/lux/v1/conversations/${message.conversation_id}/messages/${message.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${authToken}`,
          },
        }
      );

      if (response.ok) {
        if (onDelete) onDelete(message.id); // ✅ notify parent to update state
      } else {
        console.error("Delete failed", response.status);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div
      className={`flex items-center ${isMe ? 'justify-end' : 'justify-start'} relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(recipientImage && !isMe) && (
        <img
          src={recipientImage}
          alt="Recipient Avatar"
          className="w-8 h-8 rounded-full mr-2 object-cover"
        />
      )}
      {isHovered && isMe && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 text-gray-400 h-auto w-auto p-1">
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1 flex flex-col space-y-1">
            <button onClick={() => setShowEmojiPicker(true)} className="text-left px-2 py-1 hover:bg-muted rounded">☺ React</button>
            <button className="text-left px-2 py-1 hover:bg-muted rounded" onClick={() => alert('do something')}>Edit</button>
            <button
              className="text-left px-2 py-1 hover:bg-muted text-red-500 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </PopoverContent>
        </Popover>
      )}
      <div
        onDoubleClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className={`relative max-w-sm md:max-w-md px-4 py-2 rounded-lg text-sm ${
          isMe
            ? 'bg-[#3797f0] text-white rounded-br-none'
            : 'bg-muted rounded-bl-none'
        }`}
      >
        <span>{message.message}</span>
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Message Attachment"
            className="mt-2 rounded max-w-full h-auto"
          />
        )}
        {reactions.length > 0 && (
          <div className={`absolute -bottom-2 text-xs flex gap-1 ${isMe ? '-left-1' : '-right-1'} z-12`}>
            {reactions.map((reaction) => (
              <span className="flex items-center justify-center bg-gray-100 rounded-full w-5 h-5" key={reaction.user_id + reaction.emoji}>{reaction.emoji}</span>
            ))}
          </div>
        )}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 flex gap-1 bg-white p-1 rounded shadow z-10">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-lg hover:scale-110 transition-transform disabled:opacity-50"
                disabled={emoji === myReaction}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      {(currentUserImage && isMe) && (
        <img
          src={currentUserImage}
          alt="Sender Avatar"
          className="w-6 h-6 rounded-full ml-2 object-cover"
        />
      )}
      {!isMe && isHovered && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2 text-gray-400 h-auto w-auto p-1">
              <EllipsisVertical className="h-5 w-5"/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1 flex flex-col space-y-1">
            <button onClick={() => setShowEmojiPicker(true)} className="text-left px-2 py-1 hover:bg-muted rounded">Add Emoji Reaction</button>
            <button className="text-left px-2 py-1 hover:bg-muted rounded">Edit</button>
            <button className="text-left px-2 py-1 hover:bg-muted text-red-500 rounded">Delete</button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
