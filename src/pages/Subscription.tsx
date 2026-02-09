import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X, Crown, Zap, Building2 } from 'lucide-react';
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
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    description: 'Perfect for small vendors getting started',
    icon: Zap,
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
    id: 'growth',
    name: 'Growth',
    price: '₹14,999',
    period: '/month',
    description: 'For growing businesses scaling operations',
    icon: Crown,
    popular: true,
    current: true,
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

export default function Subscription() {
  const { toast } = useToast();

  const handleUpgrade = (planName: string) => {
    toast({ title: 'Upgrade Requested', description: `Your request to upgrade to ${planName} has been submitted.` });
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that fits your business. Upgrade or downgrade anytime.</p>
      </div>

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
    </div>
  );
}
