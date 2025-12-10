'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, LucideIcon } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  memberSince: string;
  membershipType: string;
  avatar?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AccountSidebarProps {
  userData: UserData;
  navigationItems: NavigationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function AccountSidebar({
  userData,
  navigationItems,
  activeTab,
  setActiveTab,
  onLogout,
}: AccountSidebarProps) {
  const handleTabClick = (tabId: string) => {
    if (tabId === 'logout') {
      onLogout();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader className="pb-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-semibold text-lg">Welcome, {userData.name}</h2>
            <p className="text-gray-600 text-sm">{userData.membershipType} Member</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLogout = item.id === 'logout';

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                    ? 'bg-black text-white'
                    : isLogout
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </CardContent>
      </Card>
      {/* Account Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">My Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1">Account Info</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{userData.name}</p>
              <p>{userData.email}</p>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-blue-600">
              Edit
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1">Primary Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p>123 Luxury Street</p>
              <p>Karachi, Sindh</p>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-blue-600">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
