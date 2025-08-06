import React from 'react'
import { ArrowRight, Star } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">Trusted by 10,000+ customers</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover Your
                <span className="text-indigo-600 block">Perfect Style</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Explore our curated collection of premium products designed to elevate your lifestyle. 
                Quality craftsmanship meets modern design.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary group">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary">
                View Collection
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">1000+</div>
                <div className="text-gray-600">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fashion model showcasing modern style"
                className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Free Shipping</div>
                    <div className="text-sm text-gray-600">On orders over $100</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">24/7</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Support</div>
                    <div className="text-sm text-gray-600">Always here to help</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero