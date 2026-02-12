import { useState, useMemo } from 'react';
import { mockReturns, mockProducts, portalConfigs } from '@/services/mockData';
import { Portal, ClaimStatus, ReturnReason } from '@/types';
import { PortalFilter } from '@/components/dashboard/PortalFilter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle, IndianRupee, User, ChevronRight } from 'lucide-react';
import { DateFilter, ExportButton, useRowSelection, SelectAllCheckbox, RowCheckbox } from '@/components/TableEnhancements';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type LifecycleStage = 'return_initiated' | 'pickup_completed' | 'claim_raised' | 'claim_approved' | 'claim_rejected' | 'settlement_adjusted';

interface ReturnLifecycle {
  returnId: string;
  orderId: string;
  portal: Portal;
  productName: string;
  skuId: string;
  reason: ReturnReason;
  refundAmount: number;
  currentStage: LifecycleStage;
  responsibleUser: string;
  timeline: { stage: LifecycleStage; timestamp: string; note?: string; user: string }[];
}

const stageConfig: Record<LifecycleStage, { label: string; color: string; icon: React.ElementType }> = {
  return_initiated: { label: 'Return Initiated', color: 'bg-amber-500/10 text-amber-600', icon: RotateCcw },
  pickup_completed: { label: 'Pickup Completed', color: 'bg-blue-500/10 text-blue-600', icon: CheckCircle },
  claim_raised: { label: 'Claim Raised', color: 'bg-purple-500/10 text-purple-600', icon: AlertTriangle },
  claim_approved: { label: 'Claim Approved', color: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle },
  claim_rejected: { label: 'Claim Rejected', color: 'bg-rose-500/10 text-rose-600', icon: XCircle },
  settlement_adjusted: { label: 'Settlement Adjusted', color: 'bg-primary/10 text-primary', icon: IndianRupee },
};

const reasonLabels: Record<ReturnReason, string> = {
  damaged: 'Damaged Product', wrong_item: 'Wrong Item', not_as_described: 'Not as Described',
  size_issue: 'Size/Fit Issue', quality_issue: 'Quality Issue', changed_mind: 'Changed Mind',
};

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

const mockLifecycleData: ReturnLifecycle[] = [
  {
    returnId: 'RET-2024-001', orderId: 'ORD-2024-002', portal: 'flipkart', productName: 'Organic Cotton T-Shirt', skuId: 'SKU-FLK-003',
    reason: 'size_issue', refundAmount: 599, currentStage: 'claim_raised', responsibleUser: 'Operations',
    timeline: [
      { stage: 'return_initiated', timestamp: daysAgo(5), user: 'Customer', note: 'Size too small' },
      { stage: 'pickup_completed', timestamp: daysAgo(3), user: 'Logistics', note: 'Item picked up from customer' },
      { stage: 'claim_raised', timestamp: daysAgo(2), user: 'Operations', note: 'Claim raised with Flipkart' },
    ],
  },
  {
    returnId: 'RET-2024-002', orderId: 'ORD-2024-005', portal: 'blinkit', productName: 'Stainless Steel Water Bottle', skuId: 'SKU-BLK-004',
    reason: 'damaged', refundAmount: 799, currentStage: 'settlement_adjusted', responsibleUser: 'Finance',
    timeline: [
      { stage: 'return_initiated', timestamp: daysAgo(10), user: 'Customer', note: 'Dent on bottle' },
      { stage: 'pickup_completed', timestamp: daysAgo(8), user: 'Logistics' },
      { stage: 'claim_raised', timestamp: daysAgo(7), user: 'Operations' },
      { stage: 'claim_approved', timestamp: daysAgo(5), user: 'Blinkit', note: 'Full refund approved' },
      { stage: 'settlement_adjusted', timestamp: daysAgo(3), user: 'Finance', note: 'Settlement adjusted in next cycle' },
    ],
  },
  {
    returnId: 'RET-2024-003', orderId: 'ORD-2024-001', portal: 'amazon', productName: 'Premium Wireless Earbuds Pro', skuId: 'SKU-AMZ-001',
    reason: 'not_as_described', refundAmount: 2999, currentStage: 'pickup_completed', responsibleUser: 'Logistics',
    timeline: [
      { stage: 'return_initiated', timestamp: daysAgo(3), user: 'Customer', note: 'Product not matching description' },
      { stage: 'pickup_completed', timestamp: daysAgo(1), user: 'Logistics', note: 'Reverse pickup done' },
    ],
  },
  {
    returnId: 'RET-2024-004', orderId: 'ORD-2024-007', portal: 'amazon', productName: 'Smart Fitness Watch X2', skuId: 'SKU-AMZ-002',
    reason: 'quality_issue', refundAmount: 4999, currentStage: 'claim_rejected', responsibleUser: 'Operations',
    timeline: [
      { stage: 'return_initiated', timestamp: daysAgo(15), user: 'Customer' },
      { stage: 'pickup_completed', timestamp: daysAgo(12), user: 'Logistics' },
      { stage: 'claim_raised', timestamp: daysAgo(10), user: 'Operations' },
      { stage: 'claim_rejected', timestamp: daysAgo(7), user: 'Amazon', note: 'Item not in return policy window' },
    ],
  },
  {
    returnId: 'RET-2024-005', orderId: 'ORD-2024-009', portal: 'meesho', productName: 'Yoga Mat Premium', skuId: 'SKU-MSH-007',
    reason: 'changed_mind', refundAmount: 899, currentStage: 'return_initiated', responsibleUser: 'Logistics',
    timeline: [
      { stage: 'return_initiated', timestamp: daysAgo(1), user: 'Customer', note: 'Customer changed mind' },
    ],
  },
];

export default function Returns() {
  const { toast } = useToast();
  const [selectedPortal, setSelectedPortal] = useState<Portal | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('30days');
  const [selectedReturn, setSelectedReturn] = useState<ReturnLifecycle | null>(null);
  const [lifecycleData, setLifecycleData] = useState(mockLifecycleData);

  const filtered = useMemo(() => {
    return lifecycleData.filter(r => {
      if (selectedPortal !== 'all' && r.portal !== selectedPortal) return false;
      if (stageFilter !== 'all' && r.currentStage !== stageFilter) return false;
      if (searchQuery && !r.returnId.toLowerCase().includes(searchQuery.toLowerCase()) && !r.orderId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [lifecycleData, selectedPortal, stageFilter, searchQuery]);

  const rowSelection = useRowSelection(filtered.map(r => r.returnId));

  const summary = useMemo(() => ({
    total: lifecycleData.length,
    pending: lifecycleData.filter(r => ['return_initiated', 'pickup_completed', 'claim_raised'].includes(r.currentStage)).length,
    approved: lifecycleData.filter(r => r.currentStage === 'claim_approved' || r.currentStage === 'settlement_adjusted').length,
    rejected: lifecycleData.filter(r => r.currentStage === 'claim_rejected').length,
    financialImpact: lifecycleData.filter(r => r.currentStage !== 'claim_rejected').reduce((s, r) => s + r.refundAmount, 0),
  }), [lifecycleData]);

  const advanceStage = (returnId: string) => {
    const stageOrder: LifecycleStage[] = ['return_initiated', 'pickup_completed', 'claim_raised', 'claim_approved', 'settlement_adjusted'];
    setLifecycleData(prev => prev.map(r => {
      if (r.returnId !== returnId) return r;
      const currentIdx = stageOrder.indexOf(r.currentStage);
      if (currentIdx < 0 || currentIdx >= stageOrder.length - 1) return r;
      const nextStage = stageOrder[currentIdx + 1];
      return {
        ...r,
        currentStage: nextStage,
        timeline: [...r.timeline, { stage: nextStage, timestamp: new Date().toISOString(), user: 'Admin' }],
      };
    }));
    toast({ title: 'Stage Advanced', description: `Return ${returnId} moved to next stage` });
  };

  const dateLabel = dateFilter === 'today' ? 'Today' : dateFilter === '7days' ? 'Last 7 Days' : dateFilter === '30days' ? 'Last 30 Days' : 'Custom';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Returns, Claims & Settlement Lifecycle</h1>
          <p className="text-muted-foreground">Full lifecycle tracking from return initiation to settlement adjustment</p>
        </div>
        <ExportButton label={rowSelection.count > 0 ? undefined : `Export – ${dateLabel}`} selectedCount={rowSelection.count} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><RotateCcw className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{summary.total}</p><p className="text-sm text-muted-foreground">Total Returns</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Clock className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{summary.pending}</p><p className="text-sm text-muted-foreground">Pending Claims</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{summary.approved}</p><p className="text-sm text-muted-foreground">Approved</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-rose-500/10"><XCircle className="w-5 h-5 text-rose-600" /></div><div><p className="text-2xl font-bold">{summary.rejected}</p><p className="text-sm text-muted-foreground">Rejected</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><IndianRupee className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">₹{summary.financialImpact.toLocaleString()}</p><p className="text-sm text-muted-foreground">Financial Impact</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <PortalFilter selectedPortal={selectedPortal} onPortalChange={setSelectedPortal} />
            <div className="flex flex-1 flex-wrap gap-3">
              <DateFilter value={dateFilter} onChange={setDateFilter} />
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search Return ID or Order ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Lifecycle Stage" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {Object.entries(stageConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
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
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Portal</TableHead>
                  <TableHead className="font-semibold">Reason</TableHead>
                  <TableHead className="text-right font-semibold">Refund ₹</TableHead>
                  <TableHead className="font-semibold">Current Stage</TableHead>
                  <TableHead className="font-semibold">Responsible</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => {
                  const stage = stageConfig[r.currentStage];
                  const StageIcon = stage.icon;
                  const portal = portalConfigs.find(p => p.id === r.portal);
                  return (
                    <TableRow key={r.returnId} className={`hover:bg-muted/30 ${rowSelection.isSelected(r.returnId) ? 'bg-primary/5' : ''}`}>
                      <TableCell><RowCheckbox checked={rowSelection.isSelected(r.returnId)} onCheckedChange={() => rowSelection.toggle(r.returnId)} /></TableCell>
                      <TableCell className="font-medium">{r.returnId}</TableCell>
                      <TableCell className="text-accent">{r.orderId}</TableCell>
                      <TableCell><div><p className="text-sm font-medium">{r.productName}</p><p className="text-xs text-muted-foreground font-mono">{r.skuId}</p></div></TableCell>
                      <TableCell><Badge variant="outline" className="gap-1">{portal?.icon} {portal?.name}</Badge></TableCell>
                      <TableCell><span className="text-sm">{reasonLabels[r.reason]}</span></TableCell>
                      <TableCell className="text-right font-medium">₹{r.refundAmount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="secondary" className={`gap-1 ${stage.color}`}><StageIcon className="w-3 h-3" />{stage.label}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{r.responsibleUser}</Badge></TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedReturn(r)}>Timeline</Button>
                          {r.currentStage !== 'settlement_adjusted' && r.currentStage !== 'claim_rejected' && (
                            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => advanceStage(r.returnId)}>
                              <ChevronRight className="w-3 h-3" />Advance
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12"><RotateCcw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No returns found</p></div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Dialog */}
      <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Return Timeline — {selectedReturn?.returnId}</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Order:</span> <span className="font-medium">{selectedReturn.orderId}</span></div>
                <div><span className="text-muted-foreground">Portal:</span> <span className="font-medium">{portalConfigs.find(p => p.id === selectedReturn.portal)?.name}</span></div>
                <div><span className="text-muted-foreground">Product:</span> <span className="font-medium">{selectedReturn.productName}</span></div>
                <div><span className="text-muted-foreground">Refund:</span> <span className="font-bold">₹{selectedReturn.refundAmount.toLocaleString()}</span></div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-3">Lifecycle Timeline</h4>
                <div className="space-y-3">
                  {selectedReturn.timeline.map((entry, idx) => {
                    const cfg = stageConfig[entry.stage];
                    const Icon = cfg.icon;
                    const isLast = idx === selectedReturn.timeline.length - 1;
                    return (
                      <div key={idx} className={`flex gap-3 ${isLast ? '' : 'pb-3 border-b border-dashed'}`}>
                        <div className={`p-1.5 rounded-lg shrink-0 ${cfg.color}`}><Icon className="w-4 h-4" /></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cfg.label}</p>
                          {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                            <Badge variant="secondary" className="text-xs">{entry.user}</Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
