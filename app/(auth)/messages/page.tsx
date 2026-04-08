
import { getCurrentUser, getCurrentUserAuthToken } from "@/app/actions/auth";
import MessagesContainer from "@/components/messages/container";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  const authToken = await getCurrentUserAuthToken();

  if (!user || !authToken) {
    redirect("/login");
  }

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
