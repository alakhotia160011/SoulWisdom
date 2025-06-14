import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingHomeButton from "@/components/floating-home-button";
import Home from "@/pages/home";
import Lesson from "@/pages/lesson";
import Archive from "@/pages/archive";
import EmailAdmin from "@/pages/email-admin";
import Traditions from "@/pages/traditions";
import TraditionDetail from "@/pages/tradition-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";
import WhatsAppTest from "@/pages/WhatsAppTest";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lesson/:id" component={Lesson} />
      <Route path="/archive" component={Archive} />
      <Route path="/archive/:tradition" component={Archive} />
      <Route path="/traditions" component={Traditions} />
      <Route path="/tradition/:slug" component={TraditionDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/email-admin" component={EmailAdmin} />
      <Route path="/whatsapp-test" component={WhatsAppTest} />
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
        <FloatingHomeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
