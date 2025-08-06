import React from 'react'
import { Shield, Truck, Award, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Your data is protected with industry-leading security measures and encrypted transactions."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping on orders over $100 with express delivery options available worldwide."
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Every product is carefully curated and tested to meet our high standards of excellence."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated customer service team is always ready to help you with any questions."
  }
]

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Why Choose ModernShop?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're more than just an online store. We're your trusted partner in 
                discovering products that enhance your lifestyle and reflect your unique style.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="btn-primary">
                Learn More About Us
              </button>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team working together"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              
              {/* Stats Overlay */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 z-20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">5+</div>
                    <div className="text-sm text-gray-600">Years</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">50K+</div>
                    <div className="text-sm text-gray-600">Customers</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-2xl transform -rotate-3 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About