import { Button } from '@/components/ui/button'

export function ExploreItems() {
    return (
        <section className="relative py-20 bg-gray-800 text-white overflow-hidden border-b border-gray-700">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('/luxury-car-bg.jpg')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/90 to-gray-800/70"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                            Browse Collection
                        </Button>
                        <Button size="lg" variant="outline" className="border-white bg-ray-800 text-white hover:bg-white hover:text-black">
                            Become a Member
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}