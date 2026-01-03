import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Property {
  id: string;
  name: string;
  location: string;
  images: string[];
  property_purpose: string;
  price: string;
  description: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://via.placeholder.com/400x300";

  const formatPrice = (price: string) => {
    return `₹${Number(price).toLocaleString()}`;
  };

  const getTypeColor = (purpose: string) => {
    switch (purpose.toLowerCase()) {
      case "sale":
        return "bg-blue-100 text-blue-800";
      case "rent":
        return "bg-green-100 text-green-800";
      case "plot":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link to={`/property/${property.id}`}>
      <Card
        className="property-card overflow-hidden h-full transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg"
      >

        <div className="relative">
          <img
            src={imageUrl}
            alt={property.name}
            className="w-full h-48 object-cover"
          />
          <Badge
            className={`absolute top-3 left-3 capitalize ${getTypeColor(
              property.property_purpose
            )}`}
          >
            {property.property_purpose}
          </Badge>
        </div>
        <CardContent className="p-4">
          {property.name &&
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {property.name}
            </h3>
          }
          <p className="text-2xl font-bold text-primary mb-2">
            {formatPrice(property.price)}
          </p>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {property.description || "No description available"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
