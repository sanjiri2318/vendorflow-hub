import { useState, useMemo } from 'react';
import { mockReturns, mockOrders, portalConfigs } from '@/services/mockData';
import { Portal, ClaimStatus, ReturnReason } from '@/types';
import { PortalFilter } from '@/components/dashboard/PortalFilter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText
} from 'lucide-react';

const claimStatusConfig: Record<ClaimStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  eligible: { label: 'Eligible', color: 'bg-info/10 text-info', icon: AlertTriangle },
  ineligible: { label: 'Ineligible', color: 'bg-muted text-muted-foreground', icon: XCircle },
  approved: { label: 'Approved', color: 'bg-success/10 text-success', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: XCircle },
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

  const filteredReturns = useMemo(() => {
    return mockReturns.filter(ret => {
      const matchesPortal = selectedPortal === 'all' || ret.portal === selectedPortal;
      const matchesSearch = ret.returnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ret.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
      
      return matchesPortal && matchesSearch && matchesStatus;
    });
  }, [selectedPortal, searchQuery, statusFilter]);

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
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Returns & Claims</h1>
          <p className="text-muted-foreground">Manage return requests and claim eligibility</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RotateCcw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Returns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <AlertTriangle className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.eligible}</p>
                <p className="text-sm text-muted-foreground">Claim Eligible</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <PortalFilter selectedPortal={selectedPortal} onPortalChange={setSelectedPortal} />
            
            <div className="flex flex-1 flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Return ID or Order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(claimStatusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Return ID</TableHead>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Portal</TableHead>
                  <TableHead className="font-semibold">Reason</TableHead>
                  <TableHead className="font-semibold">Request Date</TableHead>
                  <TableHead className="font-semibold text-right">Refund Amount</TableHead>
                  <TableHead className="font-semibold">Claim Eligible</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => {
                  const status = claimStatusConfig[ret.status];
                  const portal = portalConfigs.find(p => p.id === ret.portal);
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={ret.returnId} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{ret.returnId}</TableCell>
                      <TableCell>
                        <a href={`/orders/${ret.orderId}`} className="text-accent hover:underline">
                          {ret.orderId}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {portal?.icon} {portal?.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <span className="text-sm">{returnReasonLabels[ret.reason]}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(ret.requestDate)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(ret.refundAmount)}
                      </TableCell>
                      <TableCell>
                        {ret.claimEligible ? (
                          <Badge variant="secondary" className="bg-success/10 text-success gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Eligible
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1">
                            <XCircle className="w-3 h-3" />
                            Not Eligible
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`gap-1 ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <FileText className="w-4 h-4" />
                          Details
                        </Button>
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
