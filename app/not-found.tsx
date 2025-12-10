'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function NotFoundPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2340&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* 404 Display */}
                        <div className="mb-8">
                            <h1 className="text-8xl md:text-9xl font-bold text-zinc-500 leading-none mb-4">
                                404
                            </h1>
                            <div className="relative">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                                    Page Not Found
                                </h2>
                                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 drop-shadow-md">
                                    The luxury item you're looking for has moved to a more exclusive location.
                                    Let's get you back to exploring our premium marketplace.
                                </p>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link href="/">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
                                    <Home className="w-5 h-5 mr-2" />
                                    Return Home
                                </Button>
                            </Link>

                            <Link href="/explore">
                                <Button size="lg" variant="outline" className="bg-black/50 border-gray-400 text-white hover:bg-black/70 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105">
                                    <Search className="w-5 h-5 mr-2" />
                                    Explore Marketplace
                                </Button>
                            </Link>
                        </div>
                        {/* Quick Links */}
                        <Card className="bg-white/10 border-white/20 backdrop-blur-sm max-w-2xl mx-auto">
                            <CardContent>
                                <h3 className="text-xl font-semibold text-white mb-6">
                                    Popular Destinations
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link href="/vehicles" className="group">
                                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200">
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">🚗</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white font-medium">Luxury Vehicles</p>
                                                <p className="text-gray-400 text-sm">Premium cars & supercars</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/real-estate" className="group">
                                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200">
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">🏠</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white font-medium">Real Estate</p>
                                                <p className="text-gray-400 text-sm">Premium properties</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/watches" className="group">
                                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200">
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">⌚</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white font-medium">Timepieces</p>
                                                <p className="text-gray-400 text-sm">Luxury watches</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/support" className="group">
                                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200">
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">💬</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white font-medium">Support</p>
                                                <p className="text-gray-400 text-sm">Get help & assistance</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        {/* App Download */}
                        {/* <div className="mt-12 pt-8 border-t border-white/20">
                            <p className="text-sm text-gray-400 mb-4">
                                Experience LUX on your mobile device
                            </p>
                            <Link
                                href="https://apps.apple.com/us/app/my-lux-market/id6738446545"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" className="bg-black/50 border-gray-400 text-white hover:bg-black/70 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105">
                                    <Smartphone className="w-4 h-4 mr-2" />
                                    Download on the App Store
                                </Button>
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}