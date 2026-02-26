import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users, Search, Download, Eye, AlertTriangle, ShieldAlert, UserCheck, UserPlus,
  MapPin, Package, RotateCcw, TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FRAUD_THRESHOLD = 30; // return rate % threshold

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  state: string;
  city: string;
  totalOrders: number;
  totalReturns: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  channels: string[];
}

const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43210', address: '45, MG Road, Andheri East', pincode: '400069', state: 'Maharashtra', city: 'Mumbai', totalOrders: 12, totalReturns: 1, totalSpent: 45600, firstOrderDate: '2025-08-15', lastOrderDate: '2026-02-20', channels: ['Amazon', 'Flipkart'] },
  { id: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '+91 87654 32109', address: '12, Koramangala 4th Block', pincode: '560034', state: 'Karnataka', city: 'Bengaluru', totalOrders: 8, totalReturns: 0, totalSpent: 32800, firstOrderDate: '2025-10-01', lastOrderDate: '2026-02-18', channels: ['Amazon'] },
  { id: 'CUST-003', name: 'Amit Singh', email: 'amit.singh@outlook.com', phone: '+91 76543 21098', address: '88, Connaught Place', pincode: '110001', state: 'Delhi', city: 'New Delhi', totalOrders: 25, totalReturns: 10, totalSpent: 128500, firstOrderDate: '2025-05-20', lastOrderDate: '2026-02-25', channels: ['Amazon', 'Meesho', 'Website'] },
  { id: 'CUST-004', name: 'Sneha Reddy', email: 'sneha.r@gmail.com', phone: '+91 65432 10987', address: '23, T Nagar', pincode: '600017', state: 'Tamil Nadu', city: 'Chennai', totalOrders: 3, totalReturns: 2, totalSpent: 8900, firstOrderDate: '2026-01-10', lastOrderDate: '2026-02-14', channels: ['Meesho'] },
  { id: 'CUST-005', name: 'Vikram Joshi', email: 'vikram.j@hotmail.com', phone: '+91 54321 09876', address: '56, Baner Road', pincode: '411045', state: 'Maharashtra', city: 'Pune', totalOrders: 18, totalReturns: 2, totalSpent: 67200, firstOrderDate: '2025-06-12', lastOrderDate: '2026-02-22', channels: ['Flipkart', 'Amazon'] },
  { id: 'CUST-006', name: 'Kavita Nair', email: 'kavita.nair@gmail.com', phone: '+91 43210 98765', address: '101, Marine Drive', pincode: '682001', state: 'Kerala', city: 'Kochi', totalOrders: 6, totalReturns: 4, totalSpent: 15400, firstOrderDate: '2025-11-05', lastOrderDate: '2026-02-10', channels: ['Blinkit', 'Amazon'] },
  { id: 'CUST-007', name: 'Deepak Gupta', email: 'deepak.g@company.in', phone: '+91 32109 87654', address: '77, Salt Lake, Sector V', pincode: '700091', state: 'West Bengal', city: 'Kolkata', totalOrders: 1, totalReturns: 0, totalSpent: 3200, firstOrderDate: '2026-02-20', lastOrderDate: '2026-02-20', channels: ['Website'] },
  { id: 'CUST-008', name: 'Meera Iyer', email: 'meera.i@gmail.com', phone: '+91 21098 76543', address: '34, Jubilee Hills', pincode: '500033', state: 'Telangana', city: 'Hyderabad', totalOrders: 15, totalReturns: 8, totalSpent: 54000, firstOrderDate: '2025-07-22', lastOrderDate: '2026-02-24', channels: ['Flipkart', 'Meesho'] },
];

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function CustomerManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selected, setSelected] = useState<Customer | null>(null);

  const enriched = useMemo(() => mockCustomers.map(c => {
    const returnRate = c.totalOrders > 0 ? (c.totalReturns / c.totalOrders) * 100 : 0;
    const isRepeat = c.totalOrders > 1;
    const isFraudRisk = returnRate >= FRAUD_THRESHOLD;
    return { ...c, returnRate, isRepeat, isFraudRisk };
  }), []);

  const filtered = useMemo(() => enriched.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.pincode.includes(search) || c.state.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || (typeFilter === 'repeat' ? c.isRepeat : !c.isRepeat);
    const matchRisk = riskFilter === 'all' || (riskFilter === 'fraud' ? c.isFraudRisk : !c.isFraudRisk);
    return matchSearch && matchType && matchRisk;
  }), [enriched, search, typeFilter, riskFilter]);

  const stats = useMemo(() => ({
    total: enriched.length,
    repeat: enriched.filter(c => c.isRepeat).length,
    newCust: enriched.filter(c => !c.isRepeat).length,
    fraudRisk: enriched.filter(c => c.isFraudRisk).length,
    totalRevenue: enriched.reduce((s, c) => s + c.totalSpent, 0),
  }), [enriched]);

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Pincode', 'State', 'City', 'Orders', 'Returns', 'Total Spent', 'Type', 'Fraud Risk'];
    const rows = enriched.map(c => [c.id, c.name, c.email, c.phone, c.address, c.pincode, c.state, c.city, c.totalOrders, c.totalReturns, c.totalSpent, c.isRepeat ? 'Repeat' : 'New', c.isFraudRisk ? 'Yes' : 'No']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'customers.csv'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Customer data exported to CSV' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">Auto-captured customer database from orders</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-primary" /></div><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Customers</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2 mb-1"><UserCheck className="w-4 h-4 text-emerald-600" /></div><p className="text-xl font-bold text-emerald-600">{stats.repeat}</p><p className="text-xs text-muted-foreground">Repeat Customers</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2 mb-1"><UserPlus className="w-4 h-4 text-blue-600" /></div><p className="text-xl font-bold text-blue-600">{stats.newCust}</p><p className="text-xs text-muted-foreground">New Customers</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2 mb-1"><ShieldAlert className="w-4 h-4 text-rose-600" /></div><p className="text-xl font-bold text-rose-600">{stats.fraudRisk}</p><p className="text-xs text-muted-foreground">Fraud Risk</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-primary" /></div><p className="text-xl font-bold">{fmt(stats.totalRevenue)}</p><p className="text-xs text-muted-foreground">Total Revenue</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, pincode, state..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="repeat">Repeat</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="fraud">Fraud Risk</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Channels</TableHead>
                <TableHead className="font-semibold text-center">Orders</TableHead>
                <TableHead className="font-semibold text-center">Returns</TableHead>
                <TableHead className="font-semibold text-right">Spent</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Risk</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.email}</p></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm"><MapPin className="w-3 h-3 text-muted-foreground" />{c.city}, {c.state}</div>
                    <p className="text-xs text-muted-foreground">{c.pincode}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">{c.channels.map(ch => <Badge key={ch} variant="secondary" className="text-xs">{ch}</Badge>)}</div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{c.totalOrders}</TableCell>
                  <TableCell className="text-center">{c.totalReturns}</TableCell>
                  <TableCell className="text-right font-semibold">{fmt(c.totalSpent)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.isRepeat ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-blue-500/10 text-blue-600 border-blue-500/30'}>
                      {c.isRepeat ? 'Repeat' : 'New'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {c.isFraudRisk ? (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 gap-1">
                        <AlertTriangle className="w-3 h-3" />High Risk
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Safe</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(c)}><Eye className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (() => {
            const c = enriched.find(x => x.id === selected.id)!;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Email</p><p className="font-medium">{c.email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{c.phone}</p></div>
                  <div><p className="text-muted-foreground">Address</p><p className="font-medium">{c.address}</p></div>
                  <div><p className="text-muted-foreground">Pincode / State</p><p className="font-medium">{c.pincode} — {c.state}</p></div>
                  <div><p className="text-muted-foreground">First Order</p><p className="font-medium">{c.firstOrderDate}</p></div>
                  <div><p className="text-muted-foreground">Last Order</p><p className="font-medium">{c.lastOrderDate}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card><CardContent className="pt-4 pb-3 text-center"><Package className="w-5 h-5 mx-auto mb-1 text-primary" /><p className="text-lg font-bold">{c.totalOrders}</p><p className="text-xs text-muted-foreground">Orders</p></CardContent></Card>
                  <Card><CardContent className="pt-4 pb-3 text-center"><RotateCcw className="w-5 h-5 mx-auto mb-1 text-amber-600" /><p className="text-lg font-bold">{c.totalReturns}</p><p className="text-xs text-muted-foreground">Returns</p></CardContent></Card>
                  <Card><CardContent className="pt-4 pb-3 text-center"><TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-600" /><p className="text-lg font-bold">{fmt(c.totalSpent)}</p><p className="text-xs text-muted-foreground">Spent</p></CardContent></Card>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={c.isRepeat ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-blue-500/10 text-blue-600 border-blue-500/30'}>
                    {c.isRepeat ? 'Repeat Customer' : 'New Customer'}
                  </Badge>
                  {c.isFraudRisk && (
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 gap-1">
                      <AlertTriangle className="w-3 h-3" />Fraud Risk — Return Rate {c.returnRate.toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.channels.map(ch => <Badge key={ch} variant="secondary">{ch}</Badge>)}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
