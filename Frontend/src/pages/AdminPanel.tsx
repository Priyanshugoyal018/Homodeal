
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Check, X, Eye, Users, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const AdminPanel = () => {
  const { isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/properties/admin/properties');
      setProperties(res.data.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to fetch properties.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    fetchProperties();
    // Fetch leads logic would go here
  }, [currentUser, navigate]);

  const handleStatusUpdate = async (propertyId: string, newStatus: string) => {
    try {
      await api.put(`/api/properties/admin/status/${propertyId}`, {
        status: newStatus
      });

      setProperties(prev =>
        prev.map(prop =>
          prop.id === propertyId
            ? { ...prop, status: newStatus }
            : prop
        )
      );

      toast({
        title: `Property ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        description: `The property has been marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update property status.",
        variant: "destructive"
      });
    }
  };

  const handleApproveProperty = (propertyId: string) => handleStatusUpdate(propertyId, 'approved');
  const handleRejectProperty = (propertyId: string) => handleStatusUpdate(propertyId, 'cancelled');

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

  const formatPrice = (price: number, type: string) => {
    if (type === 'rental') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const pendingProperties = properties.filter(p => p.status === 'pending');
  const approvedProperties = properties.filter(p => p.status === 'approved');
  const rejectedProperties = properties.filter(p => p.status === 'cancelled');

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage properties and user inquiries</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {properties.length}
                  </div>
                  <p className="text-gray-600">Total Properties</p>
                </div>
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {pendingProperties.length}
                  </div>
                  <p className="text-gray-600">Pending Approval</p>
                </div>
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {approvedProperties.length}
                  </div>
                  <p className="text-gray-600">Approved</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {leads.length}
                  </div>
                  <p className="text-gray-600">Total Leads</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Properties</TabsTrigger>
            <TabsTrigger value="approved">Approved Properties</TabsTrigger>
            <TabsTrigger value="leads">User Leads</TabsTrigger>
          </TabsList>

          {/* Pending Properties Tab */}
          <TabsContent value="pending" className="mt-6">
            <div className="space-y-6">
              {pendingProperties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/4">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                            <Badge className={getStatusColor(property.status)}>
                              {property.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <span>Type: {property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                          <span>Price: {formatPrice(property.price, property.type)}</span>
                          <span>Location: {property.location}</span>
                          <span>Submitted: {new Date(property.submittedAt).toLocaleDateString()}</span>
                          <span>By: {property.submittedBy}</span>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            onClick={() => handleApproveProperty(property.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectProperty(property.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pendingProperties.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Check className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Pending Properties
                    </h3>
                    <p className="text-gray-600">
                      All properties have been reviewed.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Approved Properties Tab */}
          <TabsContent value="approved" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedProperties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <p className="font-bold text-blue-600">
                      {formatPrice(property.price, property.type)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="mt-6">
            <div className="space-y-6">
              {leads.map((lead) => (
                <Card key={lead.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{lead.userName}</CardTitle>
                        <CardDescription>{lead.propertyTitle}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <span><strong>Phone:</strong> {lead.phone}</span>
                        <span><strong>Email:</strong> {lead.email}</span>
                      </div>
                      {lead.message && (
                        <div>
                          <span className="font-medium text-sm">Message:</span>
                          <p className="text-sm text-gray-600 mt-1">{lead.message}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {leads.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Leads Yet
                    </h3>
                    <p className="text-gray-600">
                      User inquiries will appear here once they express interest in properties.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
