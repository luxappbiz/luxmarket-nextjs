'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, X, Send } from 'lucide-react';
import Image from 'next/image';
import LoadingSpinner from '../ui/loading-spinner';
import { UserProps } from '@/types/user';

interface MemberProps {
  id: number;
  name: string;
  image: {
    url: string;
  };
  occupation: string;
}

interface ComponentProps {
  authToken: string | null;
  user: UserProps;
  onConversationCreated: (conversationId: number) => void;
}

export default function NewConversationDialog({ authToken, user, onConversationCreated }: ComponentProps) {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<MemberProps[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getMembers();
      setSelectedMembers([]);
      setSearch('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => {
      getMembers();
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const getMembers = () => {
    const time = Date.now();
    let orderby = 'featured';
    let order = 'DESC';
    if (search) {
      orderby = 'name';
      order = 'ASC';
    }
    let api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/wp-json/lux/v3/members/?orderby=${orderby}&order=${order}&timestamp=${time}&per_page=50`;
    if (search) {
      api_url += `&search=${encodeURIComponent(search)}`;
    }
    axios
      .get(api_url, {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      })
      .then((res) => {
        setMembers(Array.isArray(res.data) ? res.data : res.data.members || []);
      })
      .catch((err) => console.error('Failed to fetch members', err))
      .finally(() => setLoading(false));    
  }

  const toggleMemberSelection = (member: MemberProps) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const removeMember = (memberId: number) => {
    setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const createConversation = async () => {
    if (selectedMembers.length === 0) return;
    setCreating(true);
    try {
      const userIds = [user.ID, ...selectedMembers.map(m => m.id)].join(',');
      const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/wp-json/lux/v1/conversations`;
      const response = await axios.post(
        api_url,
        {
          owner_user_id: user.ID,
          conversation_users: userIds,
        },
        {
          headers: {
            Authorization: `Basic ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const conversationId = response.data.conversation_id;
      setOpen(false);
      onConversationCreated(conversationId);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreating(false);
    }
  };
  const availableMembers = members.filter(m => !selectedMembers.some(sm => sm.id === m.id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            New Conversation
            {selectedMembers.length > 1 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (Group Chat)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        {selectedMembers.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Selected ({selectedMembers.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <Badge
                  key={member.id}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-2"
                >
                  <Image
                    src={member.image?.url}
                    alt={member.name}
                    className="w-5 h-5 rounded-full object-cover"
                    width={20}
                    height={20}
                  />
                  <span>{member.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeMember(member.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner/>
          </div>
        )}
        {!loading && (
          <>
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {availableMembers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {search ? 'No members found' : 'All members selected'}
                  </div>
                )}
                {availableMembers.map((member) => (
                  <div
                    key={member.id}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded cursor-pointer transition-colors"
                    onClick={() => toggleMemberSelection(member)}
                  >
                    <Image
                      src={member.image?.url}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.occupation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={createConversation}
            disabled={selectedMembers.length === 0 || creating}
          >
            {creating ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              <>
                {selectedMembers.length > 1 ? 'Create Group Chat' : 'Start Conversation'} <Send className="w-4 h-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
