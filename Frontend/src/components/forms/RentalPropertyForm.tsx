import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, X } from 'lucide-react';

const RentalPropertyForm = ({ onSubmit, isSubmitting, initialValues }) => {
  const [formData, setFormData] = useState({
    // Property Name
    propertyName: '',
    // Location Details
    houseNumber: '',
    streetNumber: '',
    streetName: '',
    area: '',
    landmark: '',
    city: '',
    pinCode: '',

    // Property Type
    propertyType: '',
    customType: '',

    // Suitable For
    suitableFor: [],

    // Furnishing
    furnishingStatus: '',

    // Kitchen
    kitchenAvailable: '',
    kitchenType: '',

    // Washroom
    washroomType: '',

    // Capacity
    capacity: '',

    // Rent
    price: '',

    // Additional Facilities
    facilities: [],

    // Special Notes
    specialNotes: ''
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  React.useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
        suitableFor: Array.isArray(initialValues.suitableFor) ? initialValues.suitableFor : [],
        facilities: Array.isArray(initialValues.facilities) ? initialValues.facilities : [],
        // Ensure mapping matches
        price: initialValues.price || initialValues.rent || '', // sometimes called rent in rental
      }));

      if (initialValues.existingImages) {
        setExistingImages(initialValues.existingImages);
      }
    }
  }, [initialValues]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      setImages(prev => [...prev, ...files].slice(0, 10));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine all location-related fields into a single formatted string
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

    const submissionData = {
      ...formData,
      location: location || initialValues?.location,
      images,
      existingImages,
      propertyCategory: 'rental',
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

      {/* Property Location */}
      <Card>
        <CardHeader>
          <CardTitle>Property Location</CardTitle>
          <CardDescription>Enter the exact address details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="houseNumber">House Number *</Label>
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
                type="number"
                value={formData.pinCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Type */}
      <Card>
        <CardHeader>
          <CardTitle>Property Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="1bhk">1 BHK</SelectItem>
              <SelectItem value="2bhk">2 BHK</SelectItem>
              <SelectItem value="3bhk">3 BHK</SelectItem>
              <SelectItem value="independent">Independent Home</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {formData.propertyType === 'other' && (
            <div className="mt-4">
              <Label htmlFor="customType">Please specify</Label>
              <Input
                id="customType"
                name="customType"
                value={formData.customType}
                onChange={handleInputChange}
                placeholder="Enter property type"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suitable For */}
      <Card>
        <CardHeader>
          <CardTitle>Suitable For</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Students', 'Working Professionals', 'Families'].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={formData.suitableFor.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('suitableFor', option, checked)}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Furnishing Status */}
      <Card>
        <CardHeader>
          <CardTitle>Furnishing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.furnishingStatus}
            onValueChange={(value) => handleSelectChange('furnishingStatus', value)}
          >
            {['Furnished', 'Semi-Furnished', 'Unfurnished'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option.toLowerCase()} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Kitchen Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Kitchen Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.kitchenAvailable}
            onValueChange={(value) => handleSelectChange('kitchenAvailable', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="kitchen-yes" />
              <Label htmlFor="kitchen-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="kitchen-no" />
              <Label htmlFor="kitchen-no">No</Label>
            </div>
          </RadioGroup>

          {formData.kitchenAvailable === 'yes' && (
            <div>
              <Label>Kitchen Type</Label>
              <RadioGroup
                value={formData.kitchenType}
                onValueChange={(value) => handleSelectChange('kitchenType', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attached" id="kitchen-attached" />
                  <Label htmlFor="kitchen-attached">Attached Kitchen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shared" id="kitchen-shared" />
                  <Label htmlFor="kitchen-shared">Shared Kitchen</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Washroom Type */}
      <Card>
        <CardHeader>
          <CardTitle>Washroom Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.washroomType}
            onValueChange={(value) => handleSelectChange('washroomType', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="attached" id="washroom-attached" />
              <Label htmlFor="washroom-attached">Attached Washroom</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shared" id="washroom-shared" />
              <Label htmlFor="washroom-shared">Shared Washroom</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Capacity & Rent */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity & Rent Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="capacity">Property Capacity (Number of people) *</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="How many people can comfortably stay?"
              required
            />
          </div>

          <div>
            <Label htmlFor="rent">Monthly Rent (₹) *</Label>
            <Input
              id="rent"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter monthly rent amount"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Facilities</CardTitle>
          <CardDescription>Select all available facilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'Parking Space',
            'Balcony',
            'Water Supply 24x7',
            'Electricity Backup',
            'Security/Guard',
            'WiFi Available',
            'Separate Meter',
            'Lift Facility',
            'Garden/Park Nearby',
          ].map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={facility}
                checked={formData.facilities.includes(facility)}
                onCheckedChange={(checked) => handleCheckboxChange('facilities', facility, checked)}
              />
              <Label htmlFor={facility}>{facility}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Property Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Property Photos</CardTitle>
          <CardDescription>Upload 3–10 high-quality images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Upload Property Images</p>
              <p className="text-sm text-gray-600">Choose multiple images (JPG, PNG, WebP)</p>
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
                    alt={`Property ${index + 1}`}
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

      {/* Special Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Special Notes / Rules</CardTitle>
          <CardDescription>Optional - Any specific requirements or rules</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleInputChange}
            rows={4}
            placeholder="e.g., No Smoking, Only Vegetarian, Girls Only, Boys Only, Family Only, etc."
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
          {isSubmitting ? 'Submitting...' : 'Submit Rental Property'}
        </Button>
      </div>
    </form>
  );
};

export default RentalPropertyForm;
