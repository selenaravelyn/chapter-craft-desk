import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StoryForm from "./pages/StoryForm";
import StoryView from "./pages/StoryView";
import ChapterEditor from "./components/chapter/ChapterEditor";
import Characters from "./pages/Characters";
import Notes from "./pages/Notes";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/story/:id" element={<ProtectedRoute><StoryForm /></ProtectedRoute>} />
                <Route path="/story/:id/view" element={<ProtectedRoute><StoryView /></ProtectedRoute>} />
                <Route path="/chapter/:storyId/:chapterId" element={<ProtectedRoute><ChapterEditor /></ProtectedRoute>} />
                <Route path="/characters" element={<ProtectedRoute><Characters /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
