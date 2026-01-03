import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/property/${id}`);
        const propertyData = response.data.data;

        setProperty(propertyData);
        if (propertyData.images?.length > 0) {
          setSelectedImage(propertyData.images[0]);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch property details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatPrice = (price, type) => {
    if (!price) return 'N/A';
    const formatted = `₹${Number(price).toLocaleString()}`;
    return type === 'rental' ? `${formatted}/month` : formatted;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'rental':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-blue-100 text-blue-800';
      case 'plot':
        return 'bg-orange-100 text-orange-800';
      case 'shop':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return null;

  if (!property)
    return <div className="text-center py-20 text-gray-500">Property not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2">
            {/* ===== IMAGE GALLERY ===== */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected Property"
                    className="w-full h-96 object-cover rounded-t-lg transition-all duration-300"
                  />
                  <Badge
                    className={`absolute top-4 left-4 ${getTypeColor(
                      property.property_purpose
                    )}`}
                  >
                    {property.property_purpose
                      ? property.property_purpose.charAt(0).toUpperCase() +
                      property.property_purpose.slice(1)
                      : 'Property'}
                  </Badge>
                </div>

                {property.images && property.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === image ? 'border-primary' : 'border-gray-200'
                            }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ===== PROPERTY DETAILS ===== */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(property.price, property.property_purpose)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description || 'No description provided.'}
                  </p>
                </div>

                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ===== RIGHT COLUMN (Contact Form) ===== */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Interested in this property?</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/property/interest`, {
                        ...formData,
                        propertyId: id,
                      });
                      toast({
                        title: 'Submitted',
                        description: 'Your inquiry has been sent successfully!',
                      });
                      setFormData({ name: '', phone: '', message: '' });
                    } catch (error) {
                      console.error('Error submitting interest:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to submit inquiry. Please try again.',
                        variant: 'destructive',
                      });
                    }
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <Textarea
                    placeholder="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Send Inquiry
                  </Button>
                </form>

                <div className="mt-6 text-sm text-gray-600">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2" /> +91 98765 43210
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> info@homodeal.com
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
