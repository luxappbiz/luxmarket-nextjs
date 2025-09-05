'use client'

import { Button } from '@/components/ui/button'

import Link from 'next/link'
import MobileScreensImgCarousel from '@/components/MobileScreensCarousel'
import Image from 'next/image';

const iosScreens = [
    '/images/mobile-screens/login-screen.png',
    '/images/mobile-screens/listing-screen.png',
    '/images/mobile-screens/product-details.png',
    '/images/mobile-screens/favorites-screen.png',
    '/images/mobile-screens/easy-navigation.png',
    '/images/mobile-screens/membership.png',
];

export function HeroSection() {
    return (
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
            {/* background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/images/car-garage-white-cars.avif')] bg-cover bg-center bg-no-repeat"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="flex justify-center lg:justify-start">
                        <div className="w-56 md:w-64 h-[450px] md:h-[500px] overflow-hidden">
                            <MobileScreensImgCarousel
                                images={iosScreens}
                                autoPlay
                                intervalMs={3000}
                                alt="LUX iOS app screen"
                                className="h-full w-full "
                            />
                        </div>
                    </div>
                    {/* Right: content (unchanged except using <img> for SVG) */}
                    <div className="text-center lg:text-left">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg font-serif">LUX</h1>
                            <p className="text-lg md:text-xl text-gray-200 max-w-md mx-auto lg:mx-0 drop-shadow-md">
                                A membership marketplace that connects luxury buyers and sellers.
                            </p>
                            <div className="space-y-4">
                                <Button
                                  size="lg"
                                  className="bg-white text-black hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all"
                                  onClick={() => window.dispatchEvent(new Event('openLoginDialog'))}
                                >
                                  Login
                                </Button>
                                <p className="text-sm text-gray-300">
                                    <span className="underline cursor-pointer hover:text-white transition-colors">
                                        Forgot password?
                                    </span>
                                </p>
                                <p className="text-sm text-gray-300">
                                    Don&apos;t have an account?{' '}
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
                                    className="inline-block transition-transform duration-200 hover:scale-105"
                                >
                                   <Image
                                        src="/images/app-store.svg"
                                        alt="Download on the App Store"
                                        width={120}
                                        height={48}
                                        className="h-12 w-auto"
                                        draggable={false}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
