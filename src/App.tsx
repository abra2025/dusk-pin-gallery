
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginScreen } from "./components/Login";
import ImageDetail from "./pages/ImageDetail";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Separate component for routes to ensure useAuth is used within AuthProvider
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/" element={
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    } />
    <Route path="/image/:id" element={
      <ProtectedRoute>
        <ImageDetail />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Sonner theme="dark" position="top-center" />
          <Toaster />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
