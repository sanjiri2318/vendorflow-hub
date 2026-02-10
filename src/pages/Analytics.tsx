import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders, mockInventory, mockReturns, mockSalesData, portalConfigs } from '@/services/mockData';
import { BarChart3, ShoppingCart, Package, RotateCcw, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['hsl(142, 71%, 45%)', 'hsl(217, 91%, 60%)', 'hsl(340, 82%, 52%)', 'hsl(199, 89%, 48%)', 'hsl(45, 100%, 51%)', 'hsl(262, 83%, 58%)'];

export default function Analytics() {
  const ordersByPortal = useMemo(() => 
    portalConfigs.map(p => ({
      name: p.name,
      orders: mockOrders.filter(o => o.portal === p.id).length,
      revenue: mockOrders.filter(o => o.portal === p.id).reduce((s, o) => s + o.totalAmount, 0),
    })), []);

  const inventoryByStatus = useMemo(() => {
    const healthy = mockInventory.filter(i => i.availableStock > i.lowStockThreshold).length;
    const low = mockInventory.filter(i => i.availableStock <= i.lowStockThreshold && i.availableStock > 0).length;
    const out = mockInventory.filter(i => i.availableStock === 0).length;
    return [
      { name: 'Healthy', value: healthy, color: 'hsl(142, 71%, 45%)' },
      { name: 'Low Stock', value: low, color: 'hsl(45, 100%, 51%)' },
      { name: 'Out of Stock', value: out, color: 'hsl(0, 84%, 60%)' },
    ];
  }, []);

  const returnsByReason = useMemo(() => {
    const reasons: Record<string, number> = {};
    mockReturns.forEach(r => { reasons[r.reason] = (reasons[r.reason] || 0) + 1; });
    return Object.entries(reasons).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  }, []);

  const trendData = useMemo(() => {
    const grouped: Record<string, { date: string; revenue: number; orders: number }> = {};
    mockSalesData.forEach(d => {
      const key = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[key]) grouped[key] = { date: key, revenue: 0, orders: 0 };
      grouped[key].revenue += d.revenue;
      grouped[key].orders += d.orders;
    });
    return Object.values(grouped).slice(-10);
  }, []);

  const totalRevenue = mockOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = mockOrders.length;
  const totalReturns = mockReturns.length;
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Operational Analytics</h1>
        <p className="text-muted-foreground">Business performance overview across all channels</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><TrendingUp className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">₹{(totalRevenue / 1000).toFixed(0)}K</p><p className="text-sm text-muted-foreground">Total Revenue</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><ShoppingCart className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{totalOrders}</p><p className="text-sm text-muted-foreground">Total Orders</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><Package className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">₹{avgOrderValue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Avg Order Value</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-rose-500/10"><RotateCcw className="w-5 h-5 text-rose-600" /></div><div><p className="text-2xl font-bold">{totalReturns}</p><p className="text-sm text-muted-foreground">Returns</p></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Revenue Trend</CardTitle><CardDescription>Daily revenue across all portals</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Orders by Portal</CardTitle><CardDescription>Order distribution across marketplaces</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByPortal}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Inventory Status</CardTitle><CardDescription>Current stock health overview</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={inventoryByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {inventoryByStatus.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Returns by Reason</CardTitle><CardDescription>Breakdown of return reasons</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={returnsByReason} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(340, 82%, 52%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
