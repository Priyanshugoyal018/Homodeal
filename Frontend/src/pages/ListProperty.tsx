import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import RentalPropertyForm from '@/components/forms/RentalPropertyForm';
import SalePropertyForm from '@/components/forms/SalePropertyForm';
import PlotPropertyForm from '@/components/forms/PlotPropertyForm';
import ShopPropertyForm from '@/components/forms/ShopPropertyForm';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ListProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [propertyPurpose, setPropertyPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const fetchProperty = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/property/${id}`);
          const data = response.data.data;

          // Map backend purpose to frontend select value
          let purpose = data.property_purpose;
          if (purpose === 'sale') purpose = 'buying';
          if (purpose === 'commercial') purpose = 'shop';

          setPropertyPurpose(purpose);

          // Flatten data for forms
          let flatData = {
            ...data,
            propertyName: data.name,
            specialNotes: data.description, // Mapping description back to specialNotes/additionalInfo
            existingImages: data.images, // Pass existing images
            ...data.SaleProperty,
            ...data.RentalProperty,
            ...data.CommercialProperty,
            ...data.PlotProperty
          };

          setInitialValues(flatData);
        } catch (error) {
          console.error("Error fetching property:", error);
          toast({
            title: "Error",
            description: "Failed to fetch property details for editing.",
            variant: "destructive"
          });
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id, navigate, toast]);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    // Validation
    if (!formData.city || !formData.area) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!id && (!formData.images || formData.images.length === 0)) {
      // Only enforce image requirement on create, not update (internal images might be kept)
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your property.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // API to the backend
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => dataToSend.append("images", file));
        } else if (key === "existingImages" && Array.isArray(value)) {
          // If we are sending back the list of images to keep
          value.forEach((img) => dataToSend.append("existingImages", img));
        } else if (Array.isArray(value)) {
          // Handle other arrays
          if (value.length > 0) {
            value.forEach(item => dataToSend.append(key, item));
          }
        } else {
          dataToSend.append(key, value instanceof Blob ? value : String(value));
        }
      });

      const url = id
        ? `${import.meta.env.VITE_SERVER_URL}/api/property/${id}`
        : `${import.meta.env.VITE_SERVER_URL}/api/property/create`;

      const method = id ? 'patch' : 'post';

      await axios({
        method,
        url,
        data: dataToSend,
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast({
        title: id ? "Property Updated Successfully!" : "Property Listed Successfully!",
        description: id ? "Your changes have been saved." : "Your property is now under review.",
      });

      // Redirect to dashboard on success
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPropertyForm = () => {
    // Pass initialValues only if we are in edit mode (id exists)
    const props = {
      onSubmit: handleFormSubmit,
      isSubmitting,
      initialValues: id ? initialValues : null,
      isEditing: !!id
    };

    switch (propertyPurpose) {
      case 'rental':
        return <RentalPropertyForm {...props} />;
      case 'buying':
        return <SalePropertyForm {...props} />;
      case 'plot':
        return <PlotPropertyForm {...props} />;
      case 'shop':
        return <ShopPropertyForm {...props} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {id ? 'Edit Property' : 'List Your Property'}
            </h1>
            <p className="text-xl text-gray-600">
              {id ? 'Update your property details' : 'Reach thousands of potential buyers and renters'}
            </p>
          </div>

          {/* Property Purpose Selection - Disable changing purpose when editing seems safer for now */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Property Purpose</CardTitle>
              <CardDescription>
                {id ? 'Property purpose cannot be changed while editing' : 'First, select what you want to do with your property'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="propertyPurpose">What is your property purpose? *</Label>
                <Select value={propertyPurpose} onValueChange={setPropertyPurpose} disabled={!!id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rental">For Rental Property</SelectItem>
                    <SelectItem value="buying">For Sale Property</SelectItem>
                    <SelectItem value="plot">For Plots</SelectItem>
                    <SelectItem value="shop">For Shop/Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Form Based on Selection */}
          {propertyPurpose && (
            <div className="space-y-6">
              {renderPropertyForm()}
            </div>
          )}

          {/* Info Card - Only show on create */}
          {!id && propertyPurpose && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Your property will be reviewed by our team within 24-48 hours
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Once approved, it will be visible to all users on the platform
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    You'll receive notifications when users express interest in your property
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Track views and manage leads from your dashboard
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ListProperty;