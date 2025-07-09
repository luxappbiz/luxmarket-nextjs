// components/home/explore-marketplace.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface Product {
    id: string
    title: string
    price: string
    originalPrice?: string
    image: string
    status?: 'sold' | 'available'
}

export function ExploreMarketplace() {
    const categories = [
        {
            title: 'Vehicles',
            image: '/icons/exotic-car.png',
            description: 'Luxury cars and supercars',
        },
        {
            title: 'Real Estate',
            image: '/icons/mansion-white.png',
            description: 'Premium properties worldwide'
        },
        {
            title: 'Timepieces',
            image: '/icons/timepiece.svg',
            description: 'Luxury watches and collectibles'
        },
        {
            title: '& More',
            image: '/icons/yacht.png',
            description: 'Discover more categories'
        }
    ]

    const featuredProducts: Product[] = [
        {
            id: '1',
            title: '2016 Lamborghini Aventador',
            price: '$475,996.00',
            image: '/images/cars/lamborghini-aventador-2016.jpeg',
            status: 'available'
        },
        {
            id: '2',
            title: '2022 Pagani Huayra',
            price: '$2,750,000.00',
            image: '/images/cars/pagani-huayra-2022.webp',
            status: 'available'
        },
        {
            id: '3',
            title: 'Lamborghini Aventador',
            price: '$150,000.00',
            image: '/images/cars/lamborghini-aventador-purple.jpg',
            status: 'available'
        },
        {
            id: '4',
            title: 'Bugatti Chiron Super 300 Plus',
            price: '$1,096,470.00',
            image: '/images/cars/bugatti-chiron.jpg',
            status: 'available'
        },
        {
            id: '5',
            title: '1969 Pontiac GTO Judge',
            price: '$69,000.00',
            originalPrice: '$77,000.00',
            image: '/images/cars/pontiac-gto-1969.jpg',
            status: 'sold'
        },
        {
            id: '6',
            title: 'Pontiac Judge 1969',
            price: '$50,000.00',
            image: '/images/cars/pontiac-judge-1969.jpg',
            status: 'available'
        },
        {
            id: '7',
            title: 'Koenigsegg CCGT 2008',
            price: '$3,600,000.00',
            image: '/images/cars/koenigsegg-ccgt.jpg',
            status: 'available'
        },
        {
            id: '8',
            title: '2012 Mercedes-Benz G 65 AMG',
            price: '$100,000.00',
            image: '/images/cars/mercedes-g65-amg.jpg',
            status: 'available'
        }
    ]

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explore Our Luxury Marketplace
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover curated luxury items across multiple categories, all verified by our exclusive membership community.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {categories.map((category, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-black">
                            <CardContent className="p-8 text-center">
                                <div className="aspect-[4/3] relative overflow-hidden mb-4">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {category.title}
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    {category.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Featured Products Grid */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Featured Luxury Vehicles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="relative">
                                    {product.status === 'sold' && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded z-10">
                                            SOLD
                                        </div>
                                    )}
                                    {/* <div className="absolute top-2 right-2 z-10">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/80 hover:bg-white">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </div> */}
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-gray-700 transition-colors">
                                        {product.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            {product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <Button size="lg" variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                        Explore Marketplace
                    </Button>
                </div>
            </div>
        </section>
    )
}