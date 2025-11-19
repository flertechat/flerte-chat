import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import NotFound from "@/features/marketing/pages/not-found";
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/shared/components/error-boundary";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import Home from "@/features/marketing/pages/home";
import Dashboard from "@/features/flerte/pages/dashboard";
import RoleplayPage from "@/features/flerte/pages/roleplay";
import Login from "@/features/auth/pages/login";
import Plans from "@/features/subscription/pages/plans";
import Success from "@/features/subscription/pages/success";
import Subscription from "@/features/subscription/pages/subscription";
import Privacy from "@/features/marketing/pages/privacy";
import Terms from "@/features/marketing/pages/terms";
import FAQ from "@/features/marketing/pages/faq";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/app"} component={Dashboard} />
      <Route path={"/roleplay"} component={RoleplayPage} />
      <Route path={"/plans"} component={Plans} />
      <Route path={"/subscription"} component={Subscription} />
      <Route path={"/success"} component={Success} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
