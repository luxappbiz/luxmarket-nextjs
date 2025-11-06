'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Pencil, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import LoadingSpinner from '../ui/loading-spinner';

interface MemberProps {
  id: number;
  name: string;
  image: {
    url: string;
  };
  occupation: string;
}

interface SelectMemberDialogProps {
  authToken: string | null;
  setSelectedUserIDToChat: (userID: number) => void;
}

export default function SelectMemberDialog({ authToken, setSelectedUserIDToChat }: SelectMemberDialogProps) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getMembers();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => {
      getMembers();
    }, 500); // wait 500ms after user stops typing
    return () => {
      clearTimeout(handler); // clear previous timeout if search changes
    };
  }, [search]);

  const getMembers = () => {
    const time = Date.now();
    let api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v3/members/?orderby=featured&timestamp=${time}`
    if (search) {
      api_url += `&search=${search}` 
    }
    axios
      .get(api_url, {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      })
      .then((res) => {
        console.log('Fetched members response', res.data);
        setMembers(Array.isArray(res.data) ? res.data : res.data.members || []);
      })
      .catch((err) => console.error('Failed to fetch members', err))
      .finally(() => setLoading(false));    
  }

  // const filteredMembers = members.filter((member) =>
  //   member.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Member to Chat</DialogTitle>
        </DialogHeader>
        {loading && (
          <LoadingSpinner/>
        )}
        {!loading && members.length > 0 && (
          <>
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ScrollArea className="mt-4 h-80">
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="w-full flex items-center justify-between px-2 py-2 hover:bg-accent rounded"
                  >
                    <Image
                      src={member.image?.url}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.occupation}</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedUserIDToChat(member.id);
                        setOpen(false);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
