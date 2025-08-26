"use client";

import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Memberships() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [membership, setMembership] = useState(null);
  const [membershipMessage, setMembershipMessage] = useState("");

  const userApplicationPassword = localStorage.getItem("lux_app_password");

  useEffect(() => {
    const fetchMembership = async () => {
      if (!user) {
        return;
      }
      console.log("Fetching membership data...");
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/wp-json/lux/v1/users/${user.ID}/membership`,
          {
            headers: {
              Authorization:
                "Basic " + btoa(user.user_login + ":" + userApplicationPassword),
            },
          }
        );
        console.log("User", user.ID);
        console.log("Membership response:", response.data);
        setMembership(response.data.membership);
        setMembershipMessage(response.data.message || "");
        
        if (response.data.membership) {
          setError("");
        } else {
          setError("No active membership");
        }
      } catch (err) {
        console.error("Membership fetch error:", err);
        setError("Failed to load membership.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [user, userApplicationPassword]);

  const handleUpgrade = () => {
    router.push("/membership");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to view your membership status.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading membership status...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Membership</h1>

        {membership ? (
          // User has active membership
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Active Membership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
                {/* Add more membership details here when available */}
              </div>
            </CardContent>
          </Card>
        ) : (
          // No membership found
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                No Active Membership
              </CardTitle>
              <CardDescription>
                {membershipMessage || "You don't have an active membership subscription."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Unlock premium features and get access to exclusive content with our membership plans.
                </p>
                
                <div className="flex gap-3">
                  <Button onClick={handleUpgrade} className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    View Membership Plans
                  </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Membership Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Full access to all premium features</li>
                    <li>• 24/7 priority customer support</li>
                    <li>• Exclusive content and resources</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && error !== "No active membership" && (
          <Card className="mt-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}