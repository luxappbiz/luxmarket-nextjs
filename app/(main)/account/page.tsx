'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  Edit3,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import CreateProductTab from '@/components/account/CreateProductTab';
import Memberships from '@/components/account/Memberships';
import { ExploreItems } from '@/components/home/explore-items';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout, updateUser } = useUser();
  const router = useRouter();

  // Handle case where user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Format user data with fallbacks
  const userData = {
    name: user.display_name || user.user_login || 'User',
    email: user.user_email || '',
    phone: user.phone || '',
    memberSince: user.user_registered || 'Recently',
    membershipType: user.is_event_host ? 'Premium' : 'Free',
    avatar: user.image || '/images/user-avatar.jpg'
  };

  const recentOrders = [

  ];

  const navigationItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'create-product', label: 'Create Product', icon: Package },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'subscriptions', label: 'Subscriptions & Memberships', icon: CreditCard },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Account Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => {
                        if (isEditing) {
                          // Update local state - you might want to create local state for form data
                        }
                      }}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={userData.email}
                      onChange={(e) => {
                        if (isEditing) {
                          // Update local state
                        }
                      }}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => {
                        if (isEditing) {
                          // Update local state
                        }
                      }}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                      placeholder="Add phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-since">Member Since</Label>
                    <Input
                      id="member-since"
                      value={userData.memberSince}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Here you would call your API to update user data
                      // updateUser({ display_name: newName, phone: newPhone });
                      setIsEditing(false);
                    }}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-black text-white rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{userData.membershipType} Member</h3>
                    <p className="text-gray-300">Access to exclusive luxury items</p>
                  </div>
                  <Shield className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'create-product':
        return <CreateProductTab />;  
        
      case 'orders':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">

                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'addresses':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Shipping Addresses</CardTitle>
              <Button size="sm">
                Add New Address
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Primary Shipping Address</h3>
                    <p className="text-gray-600 mt-2">
                      {userData.name}<br />
                      123 Luxury Street<br />
                      Karachi, Sindh 75500<br />
                      Pakistan
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'payment':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Payment Methods</CardTitle>
              <Button size="sm">
                Add Payment Method
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payment methods added yet.</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-gray-600 text-sm">Receive updates about your orders and account</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-gray-600 text-sm">Get notified about new luxury items and exclusive offers</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'subscriptions':
        return <Memberships />  
      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/cars/bugatti-chiron.jpg')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Account</h1>
            <p className="text-lg text-gray-300">
              Manage your luxury marketplace experience
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
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
                          onClick={() => setActiveTab(item.id)}
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

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </section>
      {/* Bottom CTA Section */}
      {/* <section className="relative py-16 bg-gray-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/cars/koenigsegg-ccgt.jpg')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Luxury Items
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Curated by Members Like You
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                Browse Collection
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Upgrade Membership
              </Button>
            </div>
          </div>
        </div>
      </section> */}
      <ExploreItems />
    </div>
  );
}