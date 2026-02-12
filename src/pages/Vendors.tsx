import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockVendors } from '@/services/mockData';
import { Users, Plus, MapPin, Package, ShoppingCart, Crown } from 'lucide-react';
import { format } from 'date-fns';

const statusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Active</Badge>;
    case 'inactive': return <Badge variant="outline" className="bg-muted text-muted-foreground">Inactive</Badge>;
    case 'suspended': return <Badge variant="outline" className="bg-rose-500/15 text-rose-600 border-rose-500/30">Suspended</Badge>;
    default: return null;
  }
};

const subscriptionData: Record<string, { plan: string; status: string }> = {
  'VEN-001': { plan: 'Pro', status: 'active' },
  'VEN-002': { plan: 'Enterprise', status: 'active' },
  'VEN-003': { plan: 'Basic', status: 'expired' },
};

export default function Vendors() {
  const activeCount = mockVendors.filter(v => v.status === 'active').length;
  const totalProducts = mockVendors.reduce((s, v) => s + v.totalProducts, 0);
  const totalOrders = mockVendors.reduce((s, v) => s + v.totalOrders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground">Manage all vendor partners and their performance</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />Add Vendor</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><Users className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{mockVendors.length}</p><p className="text-sm text-muted-foreground">Total Vendors</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><Users className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{activeCount}</p><p className="text-sm text-muted-foreground">Active</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Package className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{totalProducts}</p><p className="text-sm text-muted-foreground">Total Products</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><ShoppingCart className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Orders</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor List</CardTitle>
          <CardDescription>All registered vendor partners with subscription status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Vendor ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Warehouses</TableHead>
                <TableHead className="text-center font-semibold">Products</TableHead>
                <TableHead className="text-center font-semibold">Orders</TableHead>
                <TableHead className="font-semibold">Subscription</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVendors.map(v => {
                const sub = subscriptionData[v.vendorId];
                return (
                  <TableRow key={v.vendorId}>
                    <TableCell className="font-mono text-sm">{v.vendorId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{v.address.split(',').slice(-2).join(',').trim()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{v.email}</p>
                        <p className="text-muted-foreground">{v.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {v.warehouses.map(w => <Badge key={w} variant="secondary" className="text-xs">{w}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{v.totalProducts}</TableCell>
                    <TableCell className="text-center font-medium">{v.totalOrders.toLocaleString()}</TableCell>
                    <TableCell>
                      {sub && (
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <Badge variant="secondary" className="text-xs">{sub.plan}</Badge>
                          <Badge variant="outline" className={`text-xs ${sub.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-rose-500/15 text-rose-600 border-rose-500/30'}`}>
                            {sub.status}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(v.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(v.joinDate), 'dd MMM yyyy')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
