import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MoreHorizontal,
  MapPin,
  Building,
  User,
  Mail,
  Search,
  Filter,
  Ruler,
  Home,
  Briefcase,
  ArrowUpDown,
  Calendar,
  X,
  Check
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GlobalLoader from "@/components/GlobalLoader";

interface Property {
  id: number;
  name: string;
  location: string;
  price: string;
  property_purpose: string;
  status: string;
  images: string[];
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
  SaleProperty?: any;
  RentalProperty?: any;
  PlotProperty?: any;
  CommercialProperty?: any;
  description?: string;
  amenities?: string;
}

const AdminApplications = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      const response = await api.get("/api/property/admin/properties?status=pending");
      const data = response.data.data;
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...properties];

    // 1. Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(lowerTerm) ||
          p.location?.toLowerCase().includes(lowerTerm) ||
          (p.owner?.name?.toLowerCase() || "").includes(lowerTerm) ||
          p.id.toString().includes(lowerTerm)
      );
    }

    // 2. Type Filter
    if (propertyTypeFilter && propertyTypeFilter !== "all") {
      result = result.filter((p) => p.property_purpose === propertyTypeFilter);
    }

    // 3. Price Filter
    if (minPrice) {
      result = result.filter((p) => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => parseFloat(p.price) <= parseFloat(maxPrice));
    }

    // 4. Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredProperties(result);
  }, [searchTerm, propertyTypeFilter, minPrice, maxPrice, sortOrder, properties]);

  const handleStatusUpdate = async (id: number, status: "approved" | "cancelled") => {
    setProcessingId(id);
    try {
      await api.put(`/api/property/admin/status/${id}`, { status });
      toast({
        title: "Success",
        description: `Property ${status} successfully`,
      });
      // Remove from list
      const updatedList = properties.filter((p) => p.id !== id);
      setProperties(updatedList);
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Dynamic Details Component
  const renderSpecificDetails = (property: Property) => {
    if (property.SaleProperty) {
      const {
        propertyType, carpetArea, superBuiltUpArea, currentFloor, totalFloors,
        liftAvailable, furnishingStatus, propertyAge, washroomAvailable, washroomType, parkingAvailable, parkingType,
        roadFacing, roadWidth, ownershipType, nearbyLandmarks, negotiable
      } = property.SaleProperty;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <SectionHeader label="Property Specs" />
          <DetailRow label="Type" value={propertyType?.replace(/-/g, ' ')} />
          <DetailRow label="Carpet Area" value={`${carpetArea} sqft`} />
          <DetailRow label="Super Built-up" value={superBuiltUpArea ? `${superBuiltUpArea} sqft` : undefined} />
          <DetailRow label="Floor" value={currentFloor && totalFloors ? `${currentFloor} of ${totalFloors}` : undefined} />
          <DetailRow label="Age" value={propertyAge?.replace(/-/g, ' ')} />
          <DetailRow label="Ownership" value={ownershipType?.replace(/-/g, ' ')} />
          <DetailRow label="Negotiable" value={negotiable} />

          <SectionHeader label="Amenities & Features" />
          <DetailRow label="Furnishing" value={furnishingStatus} />
          <DetailRow label="Parking" value={parkingAvailable === 'yes' && parkingType ? `${parkingType} parking` : parkingAvailable} />
          <DetailRow label="Lift" value={liftAvailable} />
          <DetailRow label="Washroom" value={washroomAvailable === 'yes' && washroomType ? `${washroomType} washroom` : washroomAvailable} />
          <DetailRow label="Road Facing" value={roadFacing} />
          <DetailRow label="Road Width" value={roadWidth} />
          <DetailRow label="Near" value={nearbyLandmarks} />
        </div>
      );
    }
    if (property.RentalProperty) {
      const {
        propertyType, customType, suitableFor, furnishingStatus,
        kitchenAvailable, kitchenType, washroomType, capacity, facilities
      } = property.RentalProperty;

      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <SectionHeader label="Rental Specs" />
          <DetailRow label="Type" value={propertyType === 'other' ? customType : propertyType?.replace(/-/g, ' ')} />
          <DetailRow label="Capacity" value={capacity ? `${capacity} Persons` : undefined} />
          <DetailRow label="Suitable For" value={suitableFor?.join(', ')} />

          <SectionHeader label="Features" />
          <DetailRow label="Furnishing" value={furnishingStatus} />
          <DetailRow label="Kitchen" value={kitchenAvailable === 'yes' ? `${kitchenType}` : 'No'} />
          <DetailRow label="Washroom" value={washroomType} />

          {facilities && facilities.length > 0 && (
            <div className="col-span-2">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Facilities</div>
              <div className="flex flex-wrap gap-1">
                {facilities.map((f: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs font-normal">{f}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    if (property.PlotProperty) {
      const {
        plotCategory, plotArea, frontage, length, breadth,
        facingDirection, price_negotiable, ownershipType, roadWidth, nearbyAmenities
      } = property.PlotProperty;

      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <SectionHeader label="Plot Specs" />
          <DetailRow label="Category" value={plotCategory} />
          <DetailRow label="Area" value={plotArea} />
          <DetailRow label="Dimensions" value={length && breadth ? `${length} x ${breadth}` : undefined} />
          <DetailRow label="Frontage" value={frontage} />
          <DetailRow label="Facing" value={facingDirection} />
          <DetailRow label="Road Width" value={roadWidth} />
          <DetailRow label="Ownership" value={ownershipType} />
          <DetailRow label="Negotiable" value={price_negotiable} />
          <DetailRow label="Nearby" value={nearbyAmenities} />
        </div>
      );
    }
    if (property.CommercialProperty) {
      const {
        propertyType, carpetArea, superBuiltUpArea, currentFloor, totalFloors,
        liftAvailable, furnishingStatus, propertyAge, washroomAvailable, washroomType, parkingAvailable, parkingType,
        roadFacing, roadWidth, nearbyLandmarks
      } = property.CommercialProperty;

      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <SectionHeader label="Commercial Specs" />
          <DetailRow label="Type" value={propertyType?.replace(/-/g, ' ')} />
          <DetailRow label="Area" value={`${carpetArea} sqft`} />
          <DetailRow label="Super Built-up" value={superBuiltUpArea ? `${superBuiltUpArea} sqft` : undefined} />
          <DetailRow label="Floor" value={currentFloor && totalFloors ? `${currentFloor} of ${totalFloors}` : undefined} />
          <DetailRow label="Age" value={propertyAge?.replace(/-/g, ' ')} />
          <DetailRow label="Ownership" value={property.CommercialProperty.ownershipType?.replace(/-/g, ' ')} />
          <DetailRow label="Negotiable" value={property.CommercialProperty.negotiable} />

          <SectionHeader label="Features" />
          <DetailRow label="Furnishing" value={furnishingStatus} />
          <DetailRow label="Parking" value={parkingAvailable === 'yes' && parkingType ? `${parkingType} parking` : parkingAvailable} />
          <DetailRow label="Lift" value={liftAvailable} />
          <DetailRow label="Washroom" value={washroomAvailable === 'yes' && washroomType ? `${washroomType} washroom` : washroomAvailable} />
          <DetailRow label="Road Facing" value={roadFacing} />
          <DetailRow label="Road Width" value={roadWidth} />
          <DetailRow label="Nearby" value={nearbyLandmarks} />
        </div>
      );
    }
    return <p className="text-gray-500 text-sm">No specific details available.</p>;
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="col-span-2 mt-2 mb-1 border-b pb-1">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
    </div>
  );

  const DetailRow = ({ label, value }: { label: string, value: string | number | undefined | null }) => {
    if (!value) return null;
    return (
      <>
        <div className="text-gray-600">{label}:</div>
        <div className="font-medium capitalize text-gray-900">{value}</div>
      </>
    );
  };



  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Application Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage pending property listings effectively.</p>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, Name, Loc..."
                className="pl-9 w-full bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-gray-50">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rental">For Rent</SelectItem>
                <SelectItem value="plot">Plots</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-3 w-full md:w-auto">
            {/* Advanced Popover: Price & Sort */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort & Price
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Sort Order</h4>
                    <Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Price Range</h4>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              title="Clear Filters"
              onClick={() => {
                setSearchTerm("");
                setPropertyTypeFilter("all");
                setMinPrice("");
                setMaxPrice("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[300px]">Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Search className="h-8 w-8 mb-2 opacity-20" />
                    <p>No properties match your filters.</p>
                    <Button variant="link" onClick={() => { setSearchTerm(""); setPropertyTypeFilter("all"); }}>
                      Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow
                  key={property.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                        {property.images && property.images.length > 0 ? (
                          <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Building className="h-5 w-5 m-auto text-gray-400 mt-2.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">{property.name || "Unnamed Property"}</div>
                        <div className="text-xs text-gray-500 font-mono">ID: #{property.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={property.location}>{property.location}</TableCell>
                  <TableCell>{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize font-normal text-xs">
                      {property.property_purpose}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{property.owner?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[120px]" title={property.owner?.email}>{property.owner?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:inline-flex"
                        onClick={() => setSelectedProperty(property)}
                      >
                        Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(property.id, "approved")}
                            className="text-green-600 focus:text-green-700 focus:bg-green-50"
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(property.id, "cancelled")}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Sheet */}
      <Sheet open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-2xl p-0">
          {selectedProperty && (
            <div className="h-full flex flex-col">
              <SheetHeader className="p-4 sm:p-6 border-b bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl font-bold text-gray-900">{selectedProperty.name || "Property Details"}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-white">ID: #{selectedProperty.id}</Badge>
                      <span className="text-gray-500">•</span>
                      <span>Posted {new Date(selectedProperty.createdAt).toLocaleDateString()}</span>
                    </SheetDescription>
                  </div>
                  <Badge className={selectedProperty.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
                    {selectedProperty.status}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 bg-white">
                {/* Images */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden h-64 border bg-gray-100">
                    <img src={selectedProperty.images[0]} className="w-full h-full object-cover col-span-2" alt="Main" />
                  </div>
                )}

                {/* Primary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <div className="text-xs text-indigo-600 uppercase tracking-wider mb-1 font-semibold">Listing Price</div>
                    <div className="text-2xl font-bold text-gray-900">{formatPrice(selectedProperty.price)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </div>
                    <div className="text-sm font-medium text-gray-900 leading-snug">{selectedProperty.location}</div>
                  </div>
                </div>

                {/* Property Specifics */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <Building className="h-4 w-4 text-gray-500" /> Property Details
                  </h3>
                  <div className="bg-gray-50/50 border rounded-xl p-5">
                    {renderSpecificDetails(selectedProperty)}

                    {selectedProperty.description && (
                      <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</div>
                        <p className="text-sm text-gray-700 leading-relaxed max-w-none">{selectedProperty.description}</p>
                      </div>
                    )}

                    {selectedProperty.amenities && (
                      <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">General Amenities</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.amenities.split(',').map((amenity: string, i: number) => (
                            <Badge key={i} variant="secondary" className="font-normal text-xs px-2 py-1">{amenity.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Owner Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <User className="h-4 w-4 text-gray-500" /> Owner Contact
                  </h3>
                  <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {selectedProperty.owner?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{selectedProperty.owner?.name}</div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5 break-all">
                          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                          {selectedProperty.owner?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <SheetFooter className="p-4 sm:p-6 border-t bg-gray-50 mt-auto shadow-inner">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 h-10 shadow-sm"
                    onClick={() => handleStatusUpdate(selectedProperty.id, "approved")}
                    disabled={processingId === selectedProperty.id}
                  >
                    {processingId === selectedProperty.id ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Check className="h-5 w-5 mr-2" />}
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 h-10 shadow-sm"
                    onClick={() => handleStatusUpdate(selectedProperty.id, "cancelled")}
                    disabled={processingId === selectedProperty.id}
                  >
                    {processingId === selectedProperty.id ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <X className="h-5 w-5 mr-2" />}
                    Reject
                  </Button>
                </div>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminApplications;
