
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, Plus, User, Shield, Award, CheckCircle, FileText, HelpCircle } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import axios from 'axios';

const Index = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/property/all`);
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All properties are verified to ensure authenticity and eliminate fake listings',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Search,
      title: 'AI-Powered Search',
      description: 'Intelligent matching system that finds properties based on your specific requirements',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: Award,
      title: 'Reward System',
      description: 'Get rewarded for timely rent payments and build your credit score',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: CheckCircle,
      title: 'Transparent Process',
      description: 'No hidden charges, refundable service fees, and complete transparency',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="block text-yellow-400">
                Perfect Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of real estate with AI-powered search, lightning-fast
              listings, and analytics that actually matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Properties
                </Button>
              </Link>
              <Link to="/list-property">
                <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  List Property
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Homodeal
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Homodeal is a next-generation real estate platform committed to simplifying property rentals and purchases across India.
              We bridge the gap between property seekers and verified property owners or dealers by offering requirement-based matching,
              ensuring trust, transparency, and efficiency in every deal.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We understand the struggle people face while searching for rental or purchase properties—fake listings, hidden charges,
              and unresponsive agents. Homodeal removes this pain by offering personalized assistance, verified listings,
              a refundable service fee, and a reward system for timely rent payments.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Whether you're a student looking for a PG, a working professional searching for a flat, or a family seeking to buy your dream home,
              Homodeal is your trusted companion.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Homodeal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to buy, sell, or rent properties with complete trust and transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="property-card text-center group border-0 shadow-lg">
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {properties.length >= 3 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Discover our handpicked selection of premium verified properties
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((property) => (
                <div key={property.id} className="animate-scale-in">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Help Center Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h2>
            <p className="text-xl text-gray-600">
              Need assistance? We're here to help
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Contact Support</CardTitle>
                <CardDescription className="text-base">
                  Get in touch with our support team for any questions or assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-lg">
                  <p className="font-semibold text-gray-900">Email:</p>
                  <p className="text-blue-600">Homodeal01@gmail.com</p>
                </div>
                <div className="text-lg">
                  <p className="font-semibold text-gray-900">Phone:</p>
                  <p className="text-blue-600">8923631839</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust Homodeal for their property needs
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>


    </div>
  );
};

export default Index;
