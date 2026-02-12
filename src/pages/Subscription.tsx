import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, X, Crown, Zap, Building2, Users, Package, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ElementType;
  features: { name: string; included: boolean }[];
  popular?: boolean;
  current?: boolean;
  moduleAccess: string[];
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹4,999',
    period: '/month',
    description: 'Perfect for small vendors getting started',
    icon: Zap,
    moduleAccess: ['Dashboard', 'Products', 'Orders', 'Inventory'],
    features: [
      { name: 'Up to 3 marketplaces', included: true },
      { name: '500 orders/month', included: true },
      { name: 'Basic inventory tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'SKU mapping', included: false },
      { name: 'Order reconciliation', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'API access', included: false },
      { name: 'Dedicated account manager', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹14,999',
    period: '/month',
    description: 'For growing businesses scaling operations',
    icon: Crown,
    popular: true,
    current: true,
    moduleAccess: ['Dashboard', 'Products', 'Orders', 'Inventory', 'Returns', 'Settlements', 'SKU Mapping', 'Analytics'],
    features: [
      { name: 'All 6 marketplaces', included: true },
      { name: '5,000 orders/month', included: true },
      { name: 'Full inventory management', included: true },
      { name: 'Priority support', included: true },
      { name: 'SKU mapping', included: true },
      { name: 'Order reconciliation', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: false },
      { name: 'Dedicated account manager', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₹39,999',
    period: '/month',
    description: 'Full-scale enterprise vendor management',
    icon: Building2,
    moduleAccess: ['All Modules', 'AI Hub', 'System Settings', 'Custom Integrations'],
    features: [
      { name: 'Unlimited marketplaces', included: true },
      { name: 'Unlimited orders', included: true },
      { name: 'Full inventory management', included: true },
      { name: '24/7 dedicated support', included: true },
      { name: 'SKU mapping', included: true },
      { name: 'Order reconciliation', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Full API access', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom integrations', included: true },
    ],
  },
];

interface VendorSub {
  vendorId: string;
  name: string;
  plan: string;
  status: 'active' | 'expired' | 'trial';
  enabled: boolean;
  lastPayment: string;
}

const initialVendorSubs: VendorSub[] = [
  { vendorId: 'VEN-001', name: 'TechGadgets India Pvt Ltd', plan: 'Pro', status: 'active', enabled: true, lastPayment: '2026-02-01' },
  { vendorId: 'VEN-002', name: 'FashionHub Exports', plan: 'Enterprise', status: 'active', enabled: true, lastPayment: '2026-02-05' },
  { vendorId: 'VEN-003', name: 'BabyCare Essentials', plan: 'Basic', status: 'expired', enabled: false, lastPayment: '2026-01-15' },
];

export default function Subscription() {
  const { toast } = useToast();
  const [vendorSubs, setVendorSubs] = useState(initialVendorSubs);

  const handleUpgrade = (planName: string) => {
    toast({ title: 'Upgrade Requested', description: `Your request to upgrade to ${planName} has been submitted.` });
  };

  const toggleVendor = (vendorId: string) => {
    setVendorSubs(prev => prev.map(v => v.vendorId === vendorId ? { ...v, enabled: !v.enabled } : v));
    const vendor = vendorSubs.find(v => v.vendorId === vendorId);
    toast({
      title: vendor?.enabled ? 'Vendor Disabled' : 'Vendor Enabled',
      description: `${vendor?.name} has been ${vendor?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that fits your business. Each plan controls module access and feature availability.</p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map(plan => {
          const Icon = plan.icon;
          return (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-[1.02]' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Current Plan</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-3 rounded-xl bg-primary/10 w-fit mb-2">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Module Access:</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.moduleAccess.map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {f.included ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={`text-sm ${f.included ? '' : 'text-muted-foreground'}`}>{f.name}</span>
                    </div>
                  ))}
                </div>
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : (
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} onClick={() => handleUpgrade(plan.name)}>
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vendor Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Vendor Subscription Status</CardTitle>
          <CardDescription>Enable or disable vendor access based on subscription payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Vendor ID</TableHead>
                <TableHead className="font-semibold">Vendor Name</TableHead>
                <TableHead className="font-semibold">Plan</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Last Payment</TableHead>
                <TableHead className="font-semibold text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorSubs.map(v => (
                <TableRow key={v.vendorId} className={!v.enabled ? 'opacity-60' : ''}>
                  <TableCell className="font-mono text-sm">{v.vendorId}</TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{v.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      v.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' :
                      v.status === 'trial' ? 'bg-blue-500/15 text-blue-600 border-blue-500/30' :
                      'bg-rose-500/15 text-rose-600 border-rose-500/30'
                    }>
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(v.lastPayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={v.enabled} onCheckedChange={() => toggleVendor(v.vendorId)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
