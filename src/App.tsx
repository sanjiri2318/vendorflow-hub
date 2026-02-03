import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";
import Settlements from "./pages/Settlements";
import Alerts from "./pages/Alerts";
import ProductHealth from "./pages/ProductHealth";
import ConsolidatedOrders from "./pages/ConsolidatedOrders";
import SKUMapping from "./pages/SKUMapping";
import Reconciliation from "./pages/Reconciliation";
import DataImport from "./pages/DataImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
            <Route path="/product-health" element={<AppLayout><ProductHealth /></AppLayout>} />
            <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
            <Route path="/orders" element={<AppLayout><Orders /></AppLayout>} />
            <Route path="/consolidated-orders" element={<AppLayout><ConsolidatedOrders /></AppLayout>} />
            <Route path="/returns" element={<AppLayout><Returns /></AppLayout>} />
            <Route path="/settlements" element={<AppLayout><Settlements /></AppLayout>} />
            <Route path="/sku-mapping" element={<AppLayout><SKUMapping /></AppLayout>} />
            <Route path="/reconciliation" element={<AppLayout><Reconciliation /></AppLayout>} />
            <Route path="/data-import" element={<AppLayout><DataImport /></AppLayout>} />
            <Route path="/alerts" element={<AppLayout><Alerts /></AppLayout>} />
            <Route path="/vendors" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/warehouses" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/tasks" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/analytics" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/ecommerce" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/chatbot" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
