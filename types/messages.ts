export interface ConversationItem {
  id: number;
  name: string;
  image_url: string;
  participant_images?: string[];
  participant_count?: number;
  messages_unread_count: number;
  updated_at: string;
  created_at: string;
  last_message_preview: string;
  other_conversation_user_id?: number;
  other_conversation_user_ids?: number[];
}
