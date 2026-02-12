import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, X, Crown, Zap, Building2, Users, Lock, IndianRupee, AlertTriangle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
  aiAccess: boolean;
  analyticsAccess: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic', name: 'Basic', price: '₹4,999', period: '/month',
    description: 'Perfect for small vendors getting started', icon: Zap,
    moduleAccess: ['Dashboard', 'Products', 'Orders', 'Inventory'],
    aiAccess: false, analyticsAccess: false,
    features: [
      { name: 'Up to 3 marketplaces', included: true },
      { name: '500 orders/month', included: true },
      { name: 'Basic inventory tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'SKU mapping', included: false },
      { name: 'Order reconciliation', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'API access', included: false },
      { name: 'AI Automation', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'pro', name: 'Pro', price: '₹14,999', period: '/month',
    description: 'For growing businesses scaling operations', icon: Crown,
    popular: true, current: true,
    moduleAccess: ['Dashboard', 'Products', 'Orders', 'Inventory', 'Returns', 'Settlements', 'SKU Mapping', 'Analytics'],
    aiAccess: false, analyticsAccess: true,
    features: [
      { name: 'All 6 marketplaces', included: true },
      { name: '5,000 orders/month', included: true },
      { name: 'Full inventory management', included: true },
      { name: 'Priority support', included: true },
      { name: 'SKU mapping', included: true },
      { name: 'Order reconciliation', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: false },
      { name: 'AI Automation', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'enterprise', name: 'Enterprise', price: '₹39,999', period: '/month',
    description: 'Full-scale enterprise vendor management', icon: Building2,
    moduleAccess: ['All Modules', 'AI Hub', 'System Settings', 'Custom Integrations'],
    aiAccess: true, analyticsAccess: true,
    features: [
      { name: 'Unlimited marketplaces', included: true },
      { name: 'Unlimited orders', included: true },
      { name: 'Full inventory management', included: true },
      { name: '24/7 dedicated support', included: true },
      { name: 'SKU mapping', included: true },
      { name: 'Order reconciliation', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Full API access', included: true },
      { name: 'AI Automation', included: true },
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
  expiryDate: string;
  daysRemaining: number;
}

const initialVendorSubs: VendorSub[] = [
  { vendorId: 'VEN-001', name: 'TechGadgets India Pvt Ltd', plan: 'Pro', status: 'active', enabled: true, lastPayment: '2026-02-01', expiryDate: '2026-03-01', daysRemaining: 17 },
  { vendorId: 'VEN-002', name: 'FashionHub Exports', plan: 'Enterprise', status: 'active', enabled: true, lastPayment: '2026-02-05', expiryDate: '2026-03-05', daysRemaining: 21 },
  { vendorId: 'VEN-003', name: 'BabyCare Essentials', plan: 'Basic', status: 'expired', enabled: false, lastPayment: '2026-01-15', expiryDate: '2026-02-15', daysRemaining: -3 },
  { vendorId: 'VEN-004', name: 'HomeLiving Store', plan: 'Pro', status: 'trial', enabled: true, lastPayment: '—', expiryDate: '2026-02-28', daysRemaining: 16 },
  { vendorId: 'VEN-005', name: 'SportsFit Global', plan: 'Basic', status: 'active', enabled: true, lastPayment: '2026-02-08', expiryDate: '2026-03-08', daysRemaining: 24 },
];

export default function Subscription() {
  const { toast } = useToast();
  const [vendorSubs, setVendorSubs] = useState(initialVendorSubs);

  const adminDashboard = useMemo(() => ({
    active: vendorSubs.filter(v => v.status === 'active').length,
    expired: vendorSubs.filter(v => v.status === 'expired').length,
    trial: vendorSubs.filter(v => v.status === 'trial').length,
    monthlyRevenue: vendorSubs.filter(v => v.status === 'active').reduce((s, v) => {
      const plan = plans.find(p => p.name === v.plan);
      return s + (plan ? parseInt(plan.price.replace(/[₹,]/g, '')) : 0);
    }, 0),
  }), [vendorSubs]);

  const toggleVendor = (vendorId: string) => {
    setVendorSubs(prev => prev.map(v => {
      if (v.vendorId !== vendorId) return v;
      const newEnabled = !v.enabled;
      // Auto-disable if expired
      if (v.status === 'expired' && newEnabled) {
        toast({ title: 'Cannot Enable', description: `${v.name} subscription has expired. Renewal required.`, variant: 'destructive' });
        return v;
      }
      toast({
        title: newEnabled ? 'Vendor Enabled' : 'Vendor Disabled',
        description: `${v.name} has been ${newEnabled ? 'enabled' : 'disabled'}.`,
      });
      return { ...v, enabled: newEnabled };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Subscription Plans & Access Control</h1>
        <p className="text-muted-foreground mt-2">Plans control module access, AI availability, and vendor activation status</p>
      </div>

      <Tabs defaultValue="plans">
        <TabsList className="mx-auto w-fit">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
          <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map(plan => {
              const Icon = plan.icon;
              return (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-[1.02]' : ''}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-primary text-primary-foreground">Most Popular</Badge></div>}
                  {plan.current && <div className="absolute -top-3 right-4"><Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Current</Badge></div>}
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto p-3 rounded-xl bg-primary/10 w-fit mb-2"><Icon className="w-6 h-6 text-primary" /></div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-3"><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Module Access:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.moduleAccess.map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant={plan.aiAccess ? 'default' : 'secondary'} className={`text-xs ${!plan.aiAccess ? 'opacity-50' : ''}`}>
                        {plan.aiAccess ? '✓' : <Lock className="w-3 h-3 mr-1" />}AI Hub
                      </Badge>
                      <Badge variant={plan.analyticsAccess ? 'default' : 'secondary'} className={`text-xs ${!plan.analyticsAccess ? 'opacity-50' : ''}`}>
                        {plan.analyticsAccess ? '✓' : <Lock className="w-3 h-3 mr-1" />}Analytics
                      </Badge>
                    </div>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          {f.included ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
                          <span className={`text-sm ${f.included ? '' : 'text-muted-foreground'}`}>{f.name}</span>
                        </div>
                      ))}
                    </div>
                    {plan.current ? (
                      <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    ) : (
                      <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} onClick={() => toast({ title: 'Upgrade Requested', description: `Request to upgrade to ${plan.name} submitted.` })}>
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Vendor Subscription Status</CardTitle>
              <CardDescription>Manage vendor access — expired subscriptions auto-disable access</CardDescription>
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
                    <TableHead className="font-semibold">Expiry</TableHead>
                    <TableHead className="font-semibold text-center">Days Left</TableHead>
                    <TableHead className="font-semibold text-center">Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorSubs.map(v => (
                    <TableRow key={v.vendorId} className={!v.enabled ? 'opacity-60' : ''}>
                      <TableCell className="font-mono text-sm">{v.vendorId}</TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell><Badge variant="secondary">{v.plan}</Badge></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          v.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' :
                          v.status === 'trial' ? 'bg-blue-500/15 text-blue-600 border-blue-500/30' :
                          'bg-rose-500/15 text-rose-600 border-rose-500/30'
                        }>{v.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.lastPayment === '—' ? '—' : format(new Date(v.lastPayment), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-sm">{format(new Date(v.expiryDate), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={
                          v.daysRemaining <= 0 ? 'bg-rose-500/10 text-rose-600' :
                          v.daysRemaining <= 7 ? 'bg-amber-500/10 text-amber-600' :
                          'bg-emerald-500/10 text-emerald-600'
                        }>{v.daysRemaining <= 0 ? 'Expired' : `${v.daysRemaining}d`}</Badge>
                      </TableCell>
                      <TableCell className="text-center"><Switch checked={v.enabled} onCheckedChange={() => toggleVendor(v.vendorId)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Feature Lock Message */}
          <Card className="border-amber-500/30 bg-amber-500/5 mt-4">
            <CardContent className="p-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold text-amber-600">Feature Access Control</p>
                <p className="text-sm text-muted-foreground">Vendors on expired or Basic plans will see locked module indicators. Upgrade prompts are shown automatically when accessing restricted features.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{adminDashboard.active}</p><p className="text-sm text-muted-foreground">Active Subs</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-rose-500/10"><AlertTriangle className="w-5 h-5 text-rose-600" /></div><div><p className="text-2xl font-bold text-rose-600">{adminDashboard.expired}</p><p className="text-sm text-muted-foreground">Expired</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Calendar className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{adminDashboard.trial}</p><p className="text-sm text-muted-foreground">Trial</p></div></div></CardContent></Card>
              <Card className="bg-primary/5 border-primary/20"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><IndianRupee className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold text-primary">₹{adminDashboard.monthlyRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Monthly Revenue</p></div></div></CardContent></Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Revenue Breakdown</CardTitle>
                <CardDescription>Monthly recurring revenue by plan tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Basic', 'Pro', 'Enterprise'].map(planName => {
                    const count = vendorSubs.filter(v => v.plan === planName && v.status === 'active').length;
                    const plan = plans.find(p => p.name === planName);
                    const revenue = count * (plan ? parseInt(plan.price.replace(/[₹,]/g, '')) : 0);
                    const pct = adminDashboard.monthlyRevenue > 0 ? Math.round((revenue / adminDashboard.monthlyRevenue) * 100) : 0;
                    return (
                      <div key={planName} className="flex items-center gap-4">
                        <div className="w-24 font-medium text-sm">{planName}</div>
                        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-20 text-right text-sm font-medium">₹{revenue.toLocaleString()}</div>
                        <div className="w-16 text-right text-xs text-muted-foreground">{count} vendors</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
