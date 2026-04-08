'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, User, LogOut, MessageCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useUser();
    const router = useRouter();

    const navigation = [
        { name: "Explore All", href: "/explore" },
        { name: "Vehicles", href: "/vehicles" },
        { name: "Real Estate", href: "/real-estate" },
        { name: "Watches", href: "/watches" },
        { name: "Plans", href: "/membership" },
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/images/LUX-Logo.png"
                                    alt="LUX Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight font-serif">LUX</span>
                        </Link>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-semibold text-gray-700 hover:text-black transition-all duration-200 hover:scale-105 relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>
                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isAuthenticated ? (
                                // Logged in state
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="font-semibold text-gray-700 hover:text-black"
                                    >
                                      <User className="w-4 h-4 mr-2" />
                                      {user?.display_name || user?.user_login || 'User'}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push('/account')}>
                                      <User className="w-4 h-4 mr-2" />
                                      Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/create')}>
                                      <Package className="w-4 h-4 mr-2" />
                                      Create Product
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/messages')}>
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      Messages
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={handleLogout}
                                      className="text-red-600 focus:text-red-700"
                                    >
                                      <LogOut className="w-4 h-4 mr-2" />
                                      Logout
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                // Not logged in state
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="font-semibold text-gray-700 hover:text-black"
                                        onClick={() => window.dispatchEvent(new Event('openLoginDialog'))}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-black text-white hover:bg-gray-800 font-semibold px-6 shadow-md hover:shadow-lg transition-all duration-200"
                                        onClick={() => router.push('/join')}
                                    >
                                        Start
                                    </Button>
                                </>
                            )}
                        </div>
                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-white border-l border-gray-200">
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                        <div className="flex items-center space-x-3 px-4">
                                            <div className="relative w-8 h-8">
                                                <Image
                                                    src="/images/LUX-Logo.png"
                                                    alt="LUX Logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="text-xl font-bold text-gray-900">LUX</span>
                                        </div>
                                    </div>
                                    {/* User Info (Mobile) */}
                            {isAuthenticated && (
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.display_name || user?.user_login || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-600">{user?.user_email}</p>
                                        </div>
                                    )}
                                    {/* Navigation */}
                                    <nav className="flex-1 py-6">
                                        <div className="space-y-2">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center px-4 py-3 text-base font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-black"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                            {/* Account link for mobile when logged in */}
                                            {isAuthenticated && (
                                                <Link
                                                    href="/account"
                                                    className="flex items-center px-4 py-3 text-base font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-black"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <User className="w-4 h-4 mr-2" />
                                                    Account
                                                </Link>
                                            )}
                                        </div>
                                    </nav>
                                    {/* Mobile CTA */}
                                    <div className="border-t border-gray-100 pt-6 pb-4 space-y-3 px-4">
                                        {isAuthenticated ? (
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 font-semibold text-red-600 border-red-300 hover:bg-red-50"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleLogout();
                                                }}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-12 font-semibold text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        window.dispatchEvent(new Event('openLoginDialog'));
                                                    }}
                                                >
                                                    Login
                                                </Button>
                                                <Button
                                                    className="w-full h-12 bg-black text-white hover:bg-gray-800 font-semibold shadow-md"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        router.push('/join');
                                                    }}
                                                >
                                                    Start
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    {/* Mobile Footer */}
                                    <div className="text-center py-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                            &copy; {new Date().getFullYear()} LUX. All rights reserved.
                                        </p>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
};
