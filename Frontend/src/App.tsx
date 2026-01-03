import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/contexts/protectedRoute";
import React from "react";

import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
const ListProperty = React.lazy(() => import("./pages/ListProperty"));

const PropertyDetail = React.lazy(() => import("./pages/PropertyDetail"));
const AdminApplications = React.lazy(() => import("./pages/AdminApplications"));
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { GuestRoute } from "./contexts/GuestRoute";

const queryClient = new QueryClient();

import GlobalLoader from "./components/GlobalLoader";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <React.Suspense fallback={<GlobalLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route
                  path="/auth"
                  element={
                    <GuestRoute>
                      <Auth />
                    </GuestRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/list-property"
                  element={
                    <ProtectedRoute>
                      <ListProperty />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-property/:id"
                  element={
                    <ProtectedRoute>
                      <ListProperty />
                    </ProtectedRoute>
                  }
                />


                {/* Admin-only route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
