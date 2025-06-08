import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Lesson from "@/pages/lesson";
import Archive from "@/pages/archive";
import EmailAdmin from "@/pages/email-admin";
import Traditions from "@/pages/traditions";
import TraditionDetail from "@/pages/tradition-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lesson/:id" component={Lesson} />
      <Route path="/archive" component={Archive} />
      <Route path="/archive/:tradition" component={Archive} />
      <Route path="/traditions" component={Traditions} />
      <Route path="/tradition/:slug" component={TraditionDetail} />
      <Route path="/email-admin" component={EmailAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
