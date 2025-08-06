import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedProducts />
      <About />
      <Footer />
    </div>
  )
}

export default App