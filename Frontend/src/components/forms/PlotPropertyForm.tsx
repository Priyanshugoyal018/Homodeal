import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, X } from 'lucide-react';

const PlotPropertyForm = ({ onSubmit, isSubmitting, initialValues }) => {
  const [formData, setFormData] = useState({
    // Plot Name
    propertyName: '',

    // Plot Category
    plotCategory: '',

    // Plot Size
    plotArea: '',
    frontage: '',
    length: '',
    breadth: '',

    // Facing Direction
    facingDirection: '',

    // Location
    houseNumber: '',
    streetNumber: '',
    streetName: '',
    area: '',
    landmark: '',
    city: '',
    pinCode: '',

    // Pricing
    price: '',
    negotiable: '',
    ownershipType: '',

    // Road Width
    roadWidth: '',

    // Nearby Amenities
    nearbyAmenities: [],

    // Additional Info
    additionalInfo: '',
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  React.useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
        nearbyAmenities: Array.isArray(initialValues.nearbyAmenities) ? initialValues.nearbyAmenities : [],
      }));

      if (initialValues.existingImages) {
        setExistingImages(initialValues.existingImages);
      }
    }
  }, [initialValues]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      setImages((prev) => [...prev, ...files].slice(0, 10));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine all location fields into a single formatted string
    const locationParts = [
      formData.houseNumber,
      formData.streetNumber,
      formData.streetName,
      formData.area,
      formData.landmark,
      formData.city,
      formData.pinCode,
    ].filter(Boolean);

    const location = locationParts.join(', ');

    // Construct final data object
    const submissionData = {
      ...formData,
      location: location || initialValues?.location,
      images,
      existingImages,
      propertyCategory: 'plot',
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Name */}
      <Card>
        <CardHeader>
          <CardTitle>Property Name (Optional)</CardTitle>
          <CardDescription>Give your property a name or title</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="propertyName"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleInputChange}
            placeholder="e.g., Sunshine Residency, Greenview Apartment"
          />
        </CardContent>
      </Card>

      {/* Plot Category */}
      <Card>
        <CardHeader>
          <CardTitle>Plot Category / Use Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.plotCategory}
            onValueChange={(value) => handleSelectChange('plotCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select plot category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential Plot</SelectItem>
              <SelectItem value="commercial">Commercial Plot</SelectItem>
              <SelectItem value="agricultural">Agricultural Land</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Plot Size */}
      <Card>
        <CardHeader>
          <CardTitle>Plot Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="plotArea">Plot Area (sq. yards or sq. ft.) *</Label>
            <Input
              id="plotArea"
              name="plotArea"
              type="number"
              value={formData.plotArea}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              required
            />
          </div>

          <div>
            <Label htmlFor="frontage">Frontage (optional)</Label>
            <Input
              id="frontage"
              name="frontage"
              type="number"
              value={formData.frontage}
              onChange={handleInputChange}
              placeholder="Road side frontage in feet"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Length (optional)</Label>
              <Input
                id="length"
                name="length"
                type="number"
                value={formData.length}
                onChange={handleInputChange}
                placeholder="Length in feet"
              />
            </div>
            <div>
              <Label htmlFor="breadth">Breadth (optional)</Label>
              <Input
                id="breadth"
                name="breadth"
                type="number"
                value={formData.breadth}
                onChange={handleInputChange}
                placeholder="Breadth in feet"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facing Direction */}
      <Card>
        <CardHeader>
          <CardTitle>Facing Direction</CardTitle>
          <CardDescription>Important for buyers</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.facingDirection}
            onValueChange={(value) =>
              handleSelectChange('facingDirection', value)
            }
          >
            {['North', 'East', 'West', 'South'].map((direction) => (
              <div key={direction} className="flex items-center space-x-2">
                <RadioGroupItem value={direction.toLowerCase()} id={direction} />
                <Label htmlFor={direction}>{direction}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="houseNumber">Plot Number *</Label>
              <Input
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="streetNumber">Street Number</Label>
              <Input
                id="streetNumber"
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="streetName">Street Name *</Label>
              <Input
                id="streetName"
                name="streetName"
                value={formData.streetName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pinCode">Pin Code *</Label>
              <Input
                id="pinCode"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sellingPrice">Expected Selling Price (₹) *</Label>
            <Input
              id="sellingPrice"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter expected price"
              required
            />
          </div>

          <div>
            <Label>Price Negotiable?</Label>
            <RadioGroup
              value={formData.negotiable}
              onValueChange={(value) => handleSelectChange('negotiable', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="plot-negotiable-yes" />
                <Label htmlFor="plot-negotiable-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="plot-negotiable-no" />
                <Label htmlFor="plot-negotiable-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Ownership Type</Label>
            <Select
              value={formData.ownershipType}
              onValueChange={(value) =>
                handleSelectChange('ownershipType', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freehold">Freehold</SelectItem>
                <SelectItem value="leasehold">Leasehold</SelectItem>
                <SelectItem value="power-of-attorney">
                  Power of Attorney
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Road Width */}
      <Card>
        <CardHeader>
          <CardTitle>Road Width</CardTitle>
          <CardDescription>Optional but useful information</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="roadWidth">Road Width in front of plot</Label>
            <Input
              id="roadWidth"
              name="roadWidth"
              type="number"
              value={formData.roadWidth}
              onChange={handleInputChange}
              placeholder="e.g., 20, 30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Nearby Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Amenities</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {['School', 'Hospital', 'Park', 'Market', 'Railway Station / Bus Stand'].map(
            (amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.nearbyAmenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('nearbyAmenities', amenity, checked)
                  }
                />
                <Label htmlFor={amenity}>{amenity}</Label>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Photos Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
          <CardDescription>Plot images (4-6 images recommended)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="plot-image-upload"
            />
            <label
              htmlFor="plot-image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload Plot Images
              </p>
              <p className="text-sm text-gray-600">
                Choose multiple images (JPG, PNG, WebP)
              </p>
            </label>
          </div>

          {existingImages.length > 0 && (
            <div className="mb-4 mt-4">
              <p className="text-sm font-medium mb-2">Existing Images</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingImages.map((imgUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imgUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Plot ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={4}
            placeholder="e.g., Corner plot, east-facing, near main road, etc."
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-6">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Plot for Sale'}
        </Button>
      </div>
    </form>
  );
};

export default PlotPropertyForm;
