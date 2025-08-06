import React from 'react'
import { Star, Heart, ShoppingCart } from 'lucide-react'

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 124,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199,
    originalPrice: 249,
    rating: 4.6,
    reviews: 89,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "New"
  },
  {
    id: 3,
    name: "Minimalist Backpack",
    price: 89,
    originalPrice: 120,
    rating: 4.9,
    reviews: 156,
    image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "Sale"
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 45,
    originalPrice: 60,
    rating: 4.7,
    reviews: 203,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "Eco-Friendly"
  }
]

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine quality, 
            style, and functionality.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="card group cursor-pointer overflow-hidden">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.badge === 'Best Seller' ? 'bg-yellow-100 text-yellow-800' :
                    product.badge === 'New' ? 'bg-green-100 text-green-800' :
                    product.badge === 'Sale' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {product.badge}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Quick Add Button */}
                <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">Quick Add</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save ${product.originalPrice - product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-primary">
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts