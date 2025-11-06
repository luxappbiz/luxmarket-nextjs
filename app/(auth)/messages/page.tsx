
import { getCurrentUser } from "@/app/actions/auth";
import MessagesContainer from "@/components/messages/container";
import { getCurrentUserAuthToken } from "@/lib/auth";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  const authToken = await getCurrentUserAuthToken();
  return (
    <>
      <div className="flex"> 
          <main className="flex-1 overflow-hidden">
            <MessagesContainer user={user} authToken={authToken}/>
          </main>
      </div>
    </>
  );
}
