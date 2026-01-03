import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Eye, ChevronDown, ChevronUp, Phone, MessageSquare, User, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [userProperties, setUserProperties] = useState<any[]>([]); // Added any[] to avoid type error on fast iterate
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/property/user/properties`, {
          withCredentials: true,
        });
        setUserProperties(response.data.data);
      } catch (error) {
        console.error('Error fetching user properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch your properties.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [toast]);

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/property/${id}`, {
        withCredentials: true
      });

      setUserProperties(prev => prev.filter(p => p.id !== id));

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type === 'rental' || type === 'shop') {
      return `₹${Number(price).toLocaleString('en-IN')}/month`;
    }
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const toggleInterests = (propertyId: string) => {
    if (expandedProperty === propertyId) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(propertyId);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage your properties
            </p>
          </div>
          <Link to="/list-property">
            <Button size="lg" className="mt-4 sm:mt-0">
              <Plus className="w-5 h-5 mr-2" />
              List New Property
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {userProperties.length}
              </div>
              <p className="text-gray-600">Total Properties</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {/* Assuming all properties are approved for now as status logic might differ */}
                {userProperties.filter(p => p.status !== 'cancelled').length}
              </div>
              <p className="text-gray-600">Active Properties</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {userProperties.reduce((acc, curr) => acc + (curr.interests?.length || 0), 0)}
              </div>
              <p className="text-gray-600">Total Interests</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Properties</h2>
          {userProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold">{property.name}</h3>
                      {/* Using a default status for now as backend might not send status yet */}
                      <Badge className={getStatusColor(property.status)}>
                        {getStatusText(property.status)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span>Type: {property.property_purpose.charAt(0).toUpperCase() + property.property_purpose.slice(1)}</span>
                      <span>Price: {formatPrice(property.price, property.property_purpose)}</span>
                      <span>Listed: {new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-4 text-sm mb-4">
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <User className="w-4 h-4" />
                        {property.interests?.length || 0} Interested
                      </span>
                    </div>

                    {/* Interests Section Toggle */}
                    {property.interests && property.interests.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleInterests(property.id)}
                        className="mt-2 p-0 h-auto hover:bg-transparent hover:text-blue-700 text-blue-600 flex items-center gap-1"
                      >
                        {expandedProperty === property.id ? (
                          <>Hide Interests <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>View Interests ({property.interests.length}) <ChevronDown className="w-4 h-4" /></>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link to={`/edit-property/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>

                    <Link to={`/property/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={deleteLoading === property.id}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteLoading === property.id ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the property
                            "{property.name}" and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(property.id)} className="bg-red-600 hover:bg-red-700">
                            Delete Property
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Expanded Interests List */}
                {expandedProperty === property.id && property.interests && property.interests.length > 0 && (
                  <div className="mt-6 border-t pt-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Interested Users</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {property.interests.map((interest: any) => (
                        <div key={interest.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{interest.name}</p>
                                <p className="text-xs text-gray-500">{new Date(interest.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mt-3 pl-10">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{interest.phone}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MessageSquare className="w-3 h-3 mt-1" />
                              <p>{interest.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {userProperties.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Properties Listed
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by listing your first property to reach potential buyers and renters.
                </p>
                <Link to="/list-property">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    List Your First Property
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
