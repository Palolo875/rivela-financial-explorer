import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdvancedDashboard from "./components/advanced/AdvancedDashboard";
import AdvancedSimulator from "./components/advanced/AdvancedSimulator";
import HiddenFeesDetector from "./components/advanced/HiddenFeesDetector";
import ExportCenter from "./components/advanced/ExportCenter";
import PredictiveAnalytics from "./components/advanced/PredictiveAnalytics";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          <Route path="/">
            <Index />
          </Route>
          <Route path="/dashboard">
            <AdvancedDashboard userId="demo-user" />
          </Route>
          <Route path="/simulator">
            <AdvancedSimulator userId="demo-user" />
          </Route>
          <Route path="/fees-detector">
            <HiddenFeesDetector userId="demo-user" />
          </Route>
          <Route path="/export">
            <ExportCenter userId="demo-user" />
          </Route>
          <Route path="/predictions">
            <PredictiveAnalytics userId="demo-user" />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
