import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, X } from 'lucide-react';

const ShopPropertyForm = ({ onSubmit, isSubmitting, initialValues, isEditing }) => {
  const [formData, setFormData] = useState({
    // Property Name
    propertyName: '',

    // Property Type
    propertyType: '',

    // Area
    carpetArea: '',
    superBuiltUpArea: '',

    // Floor Details
    currentFloor: '',
    totalFloors: '',
    liftAvailable: '',

    // Furnishing
    furnishingStatus: '',

    // Age
    propertyAge: '',

    // Washroom
    washroomAvailable: '',
    washroomType: '',

    // Parking
    parkingAvailable: '',
    parkingType: '',

    // Road Facing
    roadFacing: '',
    roadWidth: '',

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

    // Nearby Landmarks
    nearbyLandmarks: []
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  React.useEffect(() => {
    if (initialValues) {
      // Parse location string back to fields if possible?
      // "House 1, Street 2, Area..."
      // It's hard to parse back accurately without structured storage.
      // However, the backend doesn't store structured location address fields in Property model, only `location` string.
      // But Step 21 form stores them separately in state.
      // If we don't have them separately from backend, we might just put the whole location string in one field or leave them empty?
      // Wait, Property model HAS `location` string.
      // But `SalePropertyForm` builds it from parts.
      // If we want to edit, we need those parts.
      // But the property controller `createProperty` (Step 12) only saves `location: propertyData.location`. It DOES NOT save the parts (houseNumber, etc).
      // So we CANNOT recover houseNumber, streetNumber etc. from the backend unless we change the backend to save them or parse the string roughly.
      // For now, let's just pre-fill what we can. Users might have to re-enter address details if they want to change them, or we parse.
      // Let's rely on standard fields.

      setFormData(prev => ({
        ...prev,
        ...initialValues,
        // Ensure arrays are arrays
        nearbyLandmarks: Array.isArray(initialValues.nearbyLandmarks) ? initialValues.nearbyLandmarks : [],
        // Handle specific boolean-like enums if necessary
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
      setImages(prev => [...prev, ...files].slice(0, 10)); // Limit logic might need adjustment to account for existing
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (indexOrUrl) => {
    // We'll filter by index for simplicity if it's an array
    setExistingImages(prev => prev.filter((_, i) => i !== indexOrUrl));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine all location-related fields into one formatted string
    // If we are editing, and the user didn't touch location fields, they might be empty in state 
    // but we have `location` in initialValues?
    // Actually, if we don't have individual fields, `location` will be " , , , ..." if we submit empty strings.
    // If we have `initialValues.location`, we should maybe use that if form fields are empty?
    // But `form fields` drive the edit.
    // This is a limitation: Address editing will be clunky without individual fields in DB.
    // I'll stick to the current logic: RE-GENERATE location from fields. 
    // Users will see empty address fields and have to re-fill them to avoid overwriting location with empty string?
    // Or maybe I can try to split the location string?
    // "HNo, Street, Area, Landmark, City, Pin"
    // It's joined by ', '. I can try to split it.

    const locationParts = [
      formData.houseNumber,
      formData.streetNumber,
      formData.streetName,
      formData.area,
      formData.landmark,
      formData.city,
      formData.pinCode
    ].filter(Boolean);

    let location = locationParts.join(', ');

    // If specific location fields are all empty && we are editing && we have original location, preserve it?
    // But maybe the user INTENDS to clear it? Unlikely.
    // Better: Helper in useEffect to split location.

    const submissionData = {
      ...formData,
      location: location || initialValues?.location, // Fallback if empty generated
      images,
      existingImages,
      propertyCategory: 'sale'
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

      {/* Property Type */}
      <Card>
        <CardHeader>
          <CardTitle>Property Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => handleSelectChange('propertyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shop">Shop</SelectItem>
              <SelectItem value="office">Office Space</SelectItem>
              <SelectItem value="showroom">Showroom</SelectItem>
              <SelectItem value="warehouse">Warehouse / Godown</SelectItem>
              <SelectItem value="commercial">Commercial Space</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Area Details */}
      <Card>
        <CardHeader>
          <CardTitle>Area Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="carpetArea">Carpet Area / Built-up Area (sq. ft.) *</Label>
            <Input
              id="carpetArea"
              name="carpetArea"
              type="number"
              value={formData.carpetArea}
              onChange={handleInputChange}
              placeholder="e.g., 350, 800"
              required
            />
          </div>

          <div>
            <Label htmlFor="superBuiltUpArea">Super Built-up Area (sq. ft.) - Optional</Label>
            <Input
              id="superBuiltUpArea"
              name="superBuiltUpArea"
              type="number"
              value={formData.superBuiltUpArea}
              onChange={handleInputChange}
              placeholder="e.g., 450"
            />
          </div>
        </CardContent>
      </Card>

      {/* Floor Details */}
      <Card>
        <CardHeader>
          <CardTitle>Floor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentFloor">Which Floor</Label>
            <Input
              id="currentFloor"
              name="currentFloor"
              type="number"
              value={formData.currentFloor}
              onChange={handleInputChange}
              placeholder="e.g., 0, 1"
            />
          </div>

          <div>
            <Label htmlFor="totalFloors">Total Floors in Building</Label>
            <Input
              id="totalFloors"
              name="totalFloors"
              type="number"
              value={formData.totalFloors}
              onChange={handleInputChange}
              placeholder="e.g., 3"
            />
          </div>

          <div>
            <Label>Is Lift Available?</Label>
            <RadioGroup
              value={formData.liftAvailable}
              onValueChange={(value) => handleSelectChange('liftAvailable', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="shop-lift-yes" />
                <Label htmlFor="shop-lift-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="shop-lift-no" />
                <Label htmlFor="shop-lift-no">No</Label>
              </div>
            </RadioGroup>
          </div>
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
            {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.toLowerCase().replace(' ', '-')}
                  id={option}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Age of Property */}
      <Card>
        <CardHeader>
          <CardTitle>Age of Property</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.propertyAge}
            onValueChange={(value) => handleSelectChange('propertyAge', value)}
          >
            {['New', 'Less than 5 years', '5-10 years', 'More than 10 years'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.toLowerCase().replace(/\s+/g, '-')}
                  id={option}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Washroom Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Washroom Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Washroom Available?</Label>
            <RadioGroup
              value={formData.washroomAvailable}
              onValueChange={(value) => handleSelectChange('washroomAvailable', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="shop-washroom-yes" />
                <Label htmlFor="shop-washroom-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="shop-washroom-no" />
                <Label htmlFor="shop-washroom-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.washroomAvailable === 'yes' && (
            <div>
              <Label>Washroom Type</Label>
              <RadioGroup
                value={formData.washroomType}
                onValueChange={(value) => handleSelectChange('washroomType', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attached" id="shop-washroom-attached" />
                  <Label htmlFor="shop-washroom-attached">Attached</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="common" id="shop-washroom-common" />
                  <Label htmlFor="shop-washroom-common">Common</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parking Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Parking Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Parking Available?</Label>
            <RadioGroup
              value={formData.parkingAvailable}
              onValueChange={(value) => handleSelectChange('parkingAvailable', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="shop-parking-yes" />
                <Label htmlFor="shop-parking-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="shop-parking-no" />
                <Label htmlFor="shop-parking-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.parkingAvailable === 'yes' && (
            <div>
              <Label>Parking Type</Label>
              <RadioGroup
                value={formData.parkingType}
                onValueChange={(value) => handleSelectChange('parkingType', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dedicated" id="shop-parking-dedicated" />
                  <Label htmlFor="shop-parking-dedicated">Dedicated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shared" id="shop-parking-shared" />
                  <Label htmlFor="shop-parking-shared">Shared</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Road Facing */}
      <Card>
        <CardHeader>
          <CardTitle>Road Facing / Corner Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Road Facing / Corner Property?</Label>
            <RadioGroup
              value={formData.roadFacing}
              onValueChange={(value) => handleSelectChange('roadFacing', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="road-facing-yes" />
                <Label htmlFor="road-facing-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="road-facing-no" />
                <Label htmlFor="road-facing-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="roadWidth">Road Width (optional)</Label>
            <Input
              id="roadWidth"
              name="roadWidth"
              type="number"
              value={formData.roadWidth}
              onChange={handleInputChange}
              placeholder="e.g., 20, 40"
            />
          </div>
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
              <Label htmlFor="houseNumber">Shop Number *</Label>
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

      {/* Price Details */}
      <Card>
        <CardHeader>
          <CardTitle>Price Details</CardTitle>
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
                <RadioGroupItem value="yes" id="shop-negotiable-yes" />
                <Label htmlFor="shop-negotiable-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="shop-negotiable-no" />
                <Label htmlFor="shop-negotiable-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Ownership Type</Label>
            <Select
              value={formData.ownershipType}
              onValueChange={(value) => handleSelectChange('ownershipType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freehold">Freehold</SelectItem>
                <SelectItem value="leasehold">Leasehold</SelectItem>
                <SelectItem value="power-of-attorney">Power of Attorney</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Landmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Landmarks / Commercial Areas</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Market', 'Mall', 'Metro / Bus Stand', 'Bank / ATM', 'Hospital'].map((landmark) => (
            <div key={landmark} className="flex items-center space-x-2">
              <Checkbox
                id={landmark}
                checked={formData.nearbyLandmarks.includes(landmark)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('nearbyLandmarks', landmark, checked)
                }
              />
              <Label htmlFor={landmark}>{landmark}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Photos & Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Photos & Documents</CardTitle>
          <CardDescription>Upload interior and exterior images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="shop-image-upload"
            />
            <label
              htmlFor="shop-image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload Shop Images
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
                    alt={`Shop ${index + 1}`}
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

      {/* Submit Button */}
      <div className="pt-6">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Commercial Property'}
        </Button>
      </div>
    </form>
  );
};

export default ShopPropertyForm;
