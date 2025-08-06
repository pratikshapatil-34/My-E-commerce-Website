import React from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <FeaturedProducts />
        <About />
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App