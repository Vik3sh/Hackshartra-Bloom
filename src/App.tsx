import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import MyActivitiesPage from "./pages/MyActivitiesPage";
import GitHubCallback from "./pages/GitHubCallback";
import CertificateManagement from "./pages/CertificateManagement";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/projects" element={<MyProjectsPage />} />
            <Route path="/activities" element={<MyActivitiesPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/certificates" element={<CertificateManagement />} />
            <Route path="/certificate-management" element={<CertificateManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
