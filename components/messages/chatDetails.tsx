import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserProps } from "@/types/user";
import { ConversationItem } from "@/types/messages";
import axios, { AxiosError } from 'axios';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatDetailsProps {
  currentUser: UserProps;
  authToken: string | null;
  selectedConversation?: ConversationItem | null;
}

function ChatDetails({
  currentUser,
  authToken,
  selectedConversation,
}: ChatDetailsProps) {
  const [blockOpen, setBlockOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter()

  // Open the confirm dialog (keeps your button onClick the same name)
  const handleBlock = () => {
    if (!selectedConversation) return;
    setBlockOpen(true);
  };

  // Local error response type for block API
  type ErrorResponse = { message?: string };

  // Confirm + call API
  const handleConfirmBlock = async () => {
    const targetUserId = Number(selectedConversation?.other_conversation_user_id);
    if (!targetUserId) {
      toast.error('Could not determine which user to block.');
      return;
    }
    if (targetUserId === Number(currentUser.ID)) {
      toast.error("You can't block yourself.");
      return;
    }
    setIsBlocking(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/members/${currentUser.ID}/blocked`;
      await axios.put(
        url,
        { user_id_to_block: targetUserId },
        {
          headers: {
            Authorization: `Basic ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Blocked user.');
      setBlockOpen(false);
      router.push('/messages')
    } catch (error: unknown) {
      if (error && typeof error === "object" && (error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;
        console.error('Block error:', axiosError);
        const errData = axiosError.response?.data as ErrorResponse | undefined;
        toast.error('Failed to block user', {
          description:
            errData?.message ||
            axiosError.message,
        });
      } else {
        console.error('Block error:', error);
        toast.error('Failed to block user', {
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setIsBlocking(false);
    }
  };

  const handleSoftDelete = async (conversationId: string | undefined) => {
    const confirmed = window.confirm("Delete conversation?\nAre you sure you want to delete this conversation?");
    if (!confirmed) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/conversations/${conversationId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Basic ${authToken}`
        },
      });
      window.location.reload();
    } catch (e) {
      console.error('Delete error:', e);
      alert('Error ⚠️\nCould not delete the conversation. Please try again.');
    }
  };

  return (
    <div className="border-l-1 border-color-[#888] ml-3 w-32">
      <div className="h-100 flex flex-col justify-between">
        <div className="p-3 border-b mb-4">
          <h3 className="text-sm">Details</h3>
        </div>
        <div className="p-2">
          {/* To do: Add Mute messages toggle switch */}
          {/* To do: Show Conversation Users */}
          <div className="flex flex-col space-y-2 mt-4">
            {/* Notifications Enable Switch */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="notifications" className="text-sm font-medium cursor-pointer">
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-100" onClick={() => alert('To Do: Report')}>Report</Button>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-100"
              onClick={handleBlock}
              disabled={!selectedConversation}
            >
              Block
            </Button>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-100" onClick={() => handleSoftDelete(selectedConversation?.id?.toString())}>Delete Chat</Button>
          </div>
        </div>
      </div>
      {/* Block User Dialog */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block user</DialogTitle>
            <DialogDescription>
              Blocking prevents both of you from messaging and viewing each other’s profiles. You can unblock later from Settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBlock}
              disabled={isBlocking}
            >
              {isBlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatDetails;
