import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { portalConfigs } from '@/services/mockData';
import { Portal } from '@/types';
import { CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Activity, Target, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type ReconStatus = 'matched' | 'minor_difference' | 'mismatch';

interface ReconRecord {
  date: string;
  marketplace: Portal;
  expectedOrders: number;
  processedOrders: number;
  difference: number;
  status: ReconStatus;
}

const daysAgo = (days: number) => {
  const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString();
};

const mockReconData: ReconRecord[] = [
  { date: daysAgo(0), marketplace: 'amazon', expectedOrders: 67, processedOrders: 67, difference: 0, status: 'matched' },
  { date: daysAgo(0), marketplace: 'flipkart', expectedOrders: 52, processedOrders: 51, difference: 1, status: 'minor_difference' },
  { date: daysAgo(0), marketplace: 'meesho', expectedOrders: 28, processedOrders: 28, difference: 0, status: 'matched' },
  { date: daysAgo(0), marketplace: 'own_website', expectedOrders: 15, processedOrders: 15, difference: 0, status: 'matched' },
  { date: daysAgo(1), marketplace: 'amazon', expectedOrders: 72, processedOrders: 70, difference: 2, status: 'minor_difference' },
  { date: daysAgo(1), marketplace: 'flipkart', expectedOrders: 48, processedOrders: 48, difference: 0, status: 'matched' },
  { date: daysAgo(1), marketplace: 'blinkit', expectedOrders: 22, processedOrders: 18, difference: 4, status: 'mismatch' },
  { date: daysAgo(1), marketplace: 'firstcry', expectedOrders: 14, processedOrders: 14, difference: 0, status: 'matched' },
  { date: daysAgo(2), marketplace: 'amazon', expectedOrders: 61, processedOrders: 61, difference: 0, status: 'matched' },
  { date: daysAgo(2), marketplace: 'flipkart', expectedOrders: 55, processedOrders: 55, difference: 0, status: 'matched' },
  { date: daysAgo(2), marketplace: 'meesho', expectedOrders: 35, processedOrders: 30, difference: 5, status: 'mismatch' },
  { date: daysAgo(2), marketplace: 'own_website', expectedOrders: 18, processedOrders: 18, difference: 0, status: 'matched' },
  { date: daysAgo(3), marketplace: 'amazon', expectedOrders: 58, processedOrders: 58, difference: 0, status: 'matched' },
  { date: daysAgo(3), marketplace: 'flipkart', expectedOrders: 44, processedOrders: 43, difference: 1, status: 'minor_difference' },
  { date: daysAgo(3), marketplace: 'blinkit', expectedOrders: 19, processedOrders: 19, difference: 0, status: 'matched' },
  { date: daysAgo(4), marketplace: 'amazon', expectedOrders: 75, processedOrders: 68, difference: 7, status: 'mismatch' },
  { date: daysAgo(4), marketplace: 'flipkart', expectedOrders: 62, processedOrders: 62, difference: 0, status: 'matched' },
  { date: daysAgo(4), marketplace: 'meesho', expectedOrders: 41, processedOrders: 41, difference: 0, status: 'matched' },
];

const statusBadge = (status: ReconStatus) => {
  switch (status) {
    case 'matched':
      return (
        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Matched
        </Badge>
      );
    case 'minor_difference':
      return (
        <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30 gap-1">
          <AlertTriangle className="w-3 h-3" /> Minor Diff
        </Badge>
      );
    case 'mismatch':
      return (
        <Badge variant="outline" className="bg-rose-500/15 text-rose-600 border-rose-500/30 gap-1">
          <XCircle className="w-3 h-3" /> Mismatch
        </Badge>
      );
  }
};

export default function Reconciliation() {
  const [filterPortal, setFilterPortal] = useState<Portal | 'all'>('all');

  const filtered = filterPortal === 'all' ? mockReconData : mockReconData.filter(r => r.marketplace === filterPortal);

  const totalExpected = filtered.reduce((s, r) => s + r.expectedOrders, 0);
  const totalProcessed = filtered.reduce((s, r) => s + r.processedOrders, 0);
  const totalDifference = filtered.reduce((s, r) => s + r.difference, 0);
  const matchedCount = filtered.filter(r => r.status === 'matched').length;
  const mismatchCount = filtered.filter(r => r.status === 'mismatch').length;
  const accuracy = totalExpected > 0 ? ((totalProcessed / totalExpected) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Reconciliation</h1>
          <p className="text-muted-foreground">Track expected vs processed orders across all portals</p>
        </div>
        <Select value={filterPortal} onValueChange={(v) => setFilterPortal(v as Portal | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Marketplaces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Marketplaces</SelectItem>
            {portalConfigs.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filtered.length}</p>
                <p className="text-sm text-muted-foreground">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExpected}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{matchedCount}</p>
                <p className="text-sm text-muted-foreground">Matched</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mismatchCount}</p>
                <p className="text-sm text-muted-foreground">Mismatches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <TrendingDown className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600">-{totalDifference}</p>
                <p className="text-sm text-muted-foreground">Total Gap</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Report</CardTitle>
          <CardDescription>Compare expected orders from portals vs processed orders in VMS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Marketplace</TableHead>
                  <TableHead className="text-center font-semibold">Expected</TableHead>
                  <TableHead className="text-center font-semibold">Processed</TableHead>
                  <TableHead className="text-center font-semibold">Difference</TableHead>
                  <TableHead className="text-center font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record, index) => {
                  const portal = portalConfigs.find(p => p.id === record.marketplace);
                  return (
                    <TableRow
                      key={index}
                      className={record.status === 'mismatch' ? 'bg-rose-500/5' : record.status === 'minor_difference' ? 'bg-amber-500/5' : ''}
                    >
                      <TableCell className="font-medium">
                        {format(new Date(record.date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          {portal?.icon} {portal?.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">{record.expectedOrders}</TableCell>
                      <TableCell className="text-center font-medium">{record.processedOrders}</TableCell>
                      <TableCell className="text-center">
                        {record.difference === 0 ? (
                          <span className="text-muted-foreground">0</span>
                        ) : (
                          <span className="font-medium text-rose-600">-{record.difference}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {statusBadge(record.status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Totals */}
                <TableRow className="bg-muted/50 font-bold border-t-2">
                  <TableCell colSpan={2}>Totals</TableCell>
                  <TableCell className="text-center">{totalExpected}</TableCell>
                  <TableCell className="text-center">{totalProcessed}</TableCell>
                  <TableCell className="text-center text-rose-600">-{totalDifference}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">{accuracy}% accuracy</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
