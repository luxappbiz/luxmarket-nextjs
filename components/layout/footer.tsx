import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-zinc-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="relative w-32 h-23">
                                <Image
                                    src="/images/LUX-Logo.png"
                                    alt="LUX Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold font-serif">LUX</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            A membership marketplace that connects buyers and sellers.
                        </p>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="https://apps.apple.com/us/app/my-lux-market/id6738446545"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/app-store.svg"
                                    alt="Download on the App Store"
                                    width={140}
                                    height={48}
                                    className="h-12 w-auto"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Explore</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/all" className="hover:text-white transition-colors">All</Link></li>
                            <li><Link href="/real-estate" className="hover:text-white transition-colors">Real Estate</Link></li>
                            <li><Link href="/vehicles" className="hover:text-white transition-colors">Vehicles</Link></li>
                            <li><Link href="/watches" className="hover:text-white transition-colors">Watches</Link></li>
                        </ul>
                    </div>

                    {/* Membership */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Membership</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/buy-membership" className="hover:text-white transition-colors">Buy Membership</Link></li>
                            <li><Link href="/account" className="hover:text-white transition-colors">Account</Link></li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Info</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 LUX. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}