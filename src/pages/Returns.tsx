import { useState, useMemo } from 'react';
import { mockReturns, mockProducts, portalConfigs } from '@/services/mockData';
import { Portal, ClaimStatus, ReturnReason } from '@/types';
import { PortalFilter } from '@/components/dashboard/PortalFilter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { DateFilter, ExportButton, useRowSelection, SelectAllCheckbox, RowCheckbox } from '@/components/TableEnhancements';

const skuBrandMap: Record<string, string> = {};
mockProducts.forEach(p => { skuBrandMap[p.productId] = p.brand; });

function getReturnBrand(returnOrder: typeof mockReturns[0]): string {
  if (returnOrder.items.length > 0) {
    const skuId = returnOrder.items[0].skuId;
    const num = skuId.replace(/SKU-[A-Z]+-/, '');
    const product = mockProducts.find(p => p.productId === `PROD-${num}`);
    return product?.brand || 'Unknown';
  }
  return 'Unknown';
}

// Mock tracking data
const mockTrackingData: Record<string, { tracking: string; reverseTracking: string; skuId: string; masterSkuId: string }> = {};
mockReturns.forEach((r, i) => {
  const skuId = r.items[0]?.skuId || `SKU-${i}`;
  mockTrackingData[r.returnId] = {
    tracking: `AWB${(900000 + i * 1234).toString()}`,
    reverseTracking: `RVS${(800000 + i * 567).toString()}`,
    skuId,
    masterSkuId: skuId.replace(/SKU-[A-Z]+-/, 'MSK-00'),
  };
});

const claimStatusConfig: Record<ClaimStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600', icon: Clock },
  eligible: { label: 'Eligible', color: 'bg-blue-500/10 text-blue-600', icon: AlertTriangle },
  ineligible: { label: 'Ineligible', color: 'bg-muted text-muted-foreground', icon: XCircle },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-rose-500/10 text-rose-600', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-primary/10 text-primary', icon: CheckCircle },
};

const returnReasonLabels: Record<ReturnReason, string> = {
  damaged: 'Damaged Product',
  wrong_item: 'Wrong Item Received',
  not_as_described: 'Not as Described',
  size_issue: 'Size/Fit Issue',
  quality_issue: 'Quality Issue',
  changed_mind: 'Changed Mind',
};

export default function Returns() {
  const [selectedPortal, setSelectedPortal] = useState<Portal | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('30days');

  const filteredReturns = useMemo(() => {
    return mockReturns.filter(ret => {
      const matchesPortal = selectedPortal === 'all' || ret.portal === selectedPortal;
      const matchesSearch = ret.returnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ret.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
      return matchesPortal && matchesSearch && matchesStatus;
    });
  }, [selectedPortal, searchQuery, statusFilter]);

  const rowSelection = useRowSelection(filteredReturns.map(r => r.returnId));

  const stats = useMemo(() => {
    const returns = selectedPortal === 'all' ? mockReturns : mockReturns.filter(r => r.portal === selectedPortal);
    return {
      total: returns.length,
      pending: returns.filter(r => r.status === 'pending').length,
      eligible: returns.filter(r => r.claimEligible).length,
      completed: returns.filter(r => r.status === 'completed' || r.status === 'approved').length,
    };
  }, [selectedPortal]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const dateLabel = dateFilter === 'today' ? 'Today' : dateFilter === '7days' ? 'Last 7 Days' : dateFilter === '30days' ? 'Last 30 Days' : dateFilter === 'this_month' ? 'This Month' : dateFilter === 'this_year' ? 'This Year' : 'Custom';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Returns & Claims</h1>
          <p className="text-muted-foreground">Manage return requests and claim eligibility</p>
        </div>
        <ExportButton label={rowSelection.count > 0 ? undefined : `Export – ${dateLabel}`} selectedCount={rowSelection.count} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><RotateCcw className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Returns</p></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Clock className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">Pending</p></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><AlertTriangle className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{stats.eligible}</p><p className="text-sm text-muted-foreground">Claim Eligible</p></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{stats.completed}</p><p className="text-sm text-muted-foreground">Resolved</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <PortalFilter selectedPortal={selectedPortal} onPortalChange={setSelectedPortal} />
            <div className="flex flex-1 flex-wrap gap-3">
              <DateFilter value={dateFilter} onChange={setDateFilter} />
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by Return ID or Order ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(claimStatusConfig).map(([key, config]) => (<SelectItem key={key} value={key}>{config.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10"><SelectAllCheckbox checked={rowSelection.isAllSelected} onCheckedChange={rowSelection.toggleAll} /></TableHead>
                  <TableHead className="font-semibold">Return ID</TableHead>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Brand</TableHead>
                  <TableHead className="font-semibold">Portal</TableHead>
                  <TableHead className="font-semibold">SKU ID</TableHead>
                  <TableHead className="font-semibold">Master SKU</TableHead>
                  <TableHead className="font-semibold">Tracking</TableHead>
                  <TableHead className="font-semibold">Reverse Tracking</TableHead>
                  <TableHead className="font-semibold">Reason</TableHead>
                  <TableHead className="font-semibold text-right">Refund</TableHead>
                  <TableHead className="font-semibold">Claim</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => {
                  const status = claimStatusConfig[ret.status];
                  const portal = portalConfigs.find(p => p.id === ret.portal);
                  const StatusIcon = status.icon;
                  const brand = getReturnBrand(ret);
                  const tracking = mockTrackingData[ret.returnId];
                  return (
                    <TableRow key={ret.returnId} className={`hover:bg-muted/30 ${rowSelection.isSelected(ret.returnId) ? 'bg-primary/5' : ''}`}>
                      <TableCell><RowCheckbox checked={rowSelection.isSelected(ret.returnId)} onCheckedChange={() => rowSelection.toggle(ret.returnId)} /></TableCell>
                      <TableCell className="font-medium">{ret.returnId}</TableCell>
                      <TableCell><span className="text-accent">{ret.orderId}</span></TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{brand}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="gap-1">{portal?.icon} {portal?.name}</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{tracking?.skuId}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{tracking?.masterSkuId}</TableCell>
                      <TableCell className="font-mono text-xs">{tracking?.tracking}</TableCell>
                      <TableCell className="font-mono text-xs">{tracking?.reverseTracking}</TableCell>
                      <TableCell className="max-w-[120px]"><span className="text-sm">{returnReasonLabels[ret.reason]}</span></TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(ret.refundAmount)}</TableCell>
                      <TableCell>
                        {ret.claimEligible ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 gap-1"><CheckCircle className="w-3 h-3" />Eligible</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1"><XCircle className="w-3 h-3" />No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`gap-1 ${status.color}`}><StatusIcon className="w-3 h-3" />{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredReturns.length === 0 && (
            <div className="text-center py-12">
              <RotateCcw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No returns found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
