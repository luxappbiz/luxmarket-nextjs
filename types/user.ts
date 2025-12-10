
export interface UserProps {
  ID: string;
  display_name: string;
  user_login: string;
  user_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  image: string;
  website: string;
  token: string;
  user_nicename: string;
  affiliate_id: number;
  user_registered: string;
  is_event_host?: boolean;
  balances: {
    incoming: number;
    available: number;
    total_earned: number;
    total_withdrawn: number;
  };
  capabilities: null | string[];
  total_unread_messages_count: number;
  gender: string;
  occupation: string;
  instagram: string;
}
