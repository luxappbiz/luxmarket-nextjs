import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ExploreItems() {
    return (
        <section className="relative py-20 bg-gray-800 text-white overflow-hidden border-b border-gray-700">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/bugatti-smoke.jpg"
                >
                    <source src="/videos/bugatti-smoke.mp4" type="video/mp4" />
                </video>
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/70"
                ></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
                        Explore Luxury Items
                    </h2>
                    <p className="text-lg text-gray-200 mb-8">
                        Curated by Members Like You
                    </p>
                    <p className="text-gray-300 mb-8 max-w-2xl">
                        Join our exclusive community of luxury enthusiasts. Every item in our marketplace
                        is hand-selected and verified by members who share your passion for exceptional quality and craftsmanship.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
                            <Link href="/explore">Browse Collection</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white bg-ray-800 text-white hover:bg-white hover:text-black" asChild>
                            <Link href="/join">Become a Member</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}