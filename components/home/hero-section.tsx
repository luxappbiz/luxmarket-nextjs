'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Smartphone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/images/car-garage-white-cars.avif')] bg-cover bg-center bg-no-repeat"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Left Side - Mobile Preview */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative">
                            <div className="w-56 h-[450px] md:w-64 md:h-[500px] bg-white rounded-[2.5rem] p-4 shadow-2xl border-8 border-gray-800">
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-white rounded-[1.5rem] p-6 flex flex-col">
                                    <div className="text-center mb-6">
                                        <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center p-2">
                                            <Image
                                                src="/images/LUX-Logo.png"
                                                alt="LUX Logo"
                                                width={32}
                                                height={32}
                                                className="object-contain"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-gray-900  font-serif">LUX</h3>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <Label htmlFor="email" className="text-xs text-gray-600">Username or Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                className="mt-1 h-8 text-xs"
                                                placeholder="Enter email"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password" className="text-xs text-gray-600">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                className="mt-1 h-8 text-xs"
                                                placeholder="Enter password"
                                            />
                                        </div>

                                        <Button className="w-full h-8 text-xs bg-black hover:bg-gray-800">
                                            Login
                                        </Button>

                                        <p className="text-center text-xs text-gray-600">
                                            Don't have an account?{' '}
                                            <span className="text-black font-medium">Sign up</span>
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <p className="text-xs text-gray-600 text-center mb-2">
                                            2024 LUX APP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="text-center lg:text-left">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg font-serif ">
                                LUX
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 max-w-md mx-auto lg:mx-0 drop-shadow-md">
                                A membership marketplace that connects luxury buyers and sellers.
                            </p>

                            <div className="space-y-4">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all">
                                    Log In
                                </Button>

                                <p className="text-sm text-gray-300">
                                    <span className="underline cursor-pointer hover:text-white transition-colors">
                                        Forgot password?
                                    </span>
                                </p>

                                <p className="text-sm text-gray-300">
                                    Don't have an account?{' '}
                                    <span className="text-white font-medium underline cursor-pointer hover:text-gray-200 transition-colors">
                                        Sign up
                                    </span>
                                </p>
                            </div>

                            <div className="pt-6">
                                <p className="text-sm text-gray-300 mb-3">Available on App Store</p>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}