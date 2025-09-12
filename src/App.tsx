import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { LessonProgressionProvider } from "./contexts/LessonProgressionContext";
import { ToastProvider } from "./contexts/ToastContext";
import { CommunityProvider } from "./contexts/CommunityContext";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProgressProvider>
          <LessonProgressionProvider>
            <ToastProvider>
              <CommunityProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/community" element={<Community />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
              </BrowserRouter>
                </TooltipProvider>
              </CommunityProvider>
            </ToastProvider>
          </LessonProgressionProvider>
        </ProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
