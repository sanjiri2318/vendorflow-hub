import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, UserPlus, Users, Phone, Mail, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, Search, Download, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { leadsDb } from '@/services/database';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';
type LeadSource = 'indiamart' | 'justdial' | 'tradeindia' | 'website' | 'referral' | 'whatsapp' | 'social_media';

const sourceConfig: Record<string, { label: string; icon: string; color: string }> = {
  indiamart: { label: 'IndiaMART', icon: '🏭', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  justdial: { label: 'JustDial', icon: '📞', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  tradeindia: { label: 'TradeIndia', icon: '🌐', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
  website: { label: 'Website', icon: '💻', color: 'bg-violet-500/10 text-violet-600 border-violet-500/30' },
  referral: { label: 'Referral', icon: '🤝', color: 'bg-pink-500/10 text-pink-600 border-pink-500/30' },
  whatsapp: { label: 'WhatsApp', icon: '💬', color: 'bg-green-500/10 text-green-600 border-green-500/30' },
  social_media: { label: 'Social Media', icon: '📱', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'New', color: 'bg-blue-500/15 text-blue-600 border-blue-500/30', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30', icon: Phone },
  qualified: { label: 'Qualified', color: 'bg-violet-500/15 text-violet-600 border-violet-500/30', icon: CheckCircle2 },
  negotiation: { label: 'Negotiation', color: 'bg-orange-500/15 text-orange-600 border-orange-500/30', icon: TrendingUp },
  won: { label: 'Won', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30', icon: CheckCircle2 },
  lost: { label: 'Lost', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30', icon: XCircle },
};

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function LeadManagement() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLead, setNewLead] = useState({ company_name: '', contact_person: '', phone: '', email: '', source: 'website', status: 'new' as LeadStatus, priority: 'medium' as any, value: 0, notes: '' });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsDb.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
        search: searchQuery || undefined,
      });
      setLeads(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, [searchQuery, statusFilter, sourceFilter]);

  const handleCreateLead = async () => {
    try {
      await leadsDb.create(newLead);
      toast({ title: 'Lead Created', description: `${newLead.company_name} added to pipeline` });
      setShowNewLead(false);
      setNewLead({ company_name: '', contact_person: '', phone: '', email: '', source: 'website', status: 'new', priority: 'medium', value: 0, notes: '' });
      fetchLeads();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    try {
      await leadsDb.update(id, { status });
      toast({ title: 'Status Updated' });
      fetchLeads();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    active: leads.filter(l => ['contacted', 'qualified', 'negotiation'].includes(l.status)).length,
    won: leads.filter(l => l.status === 'won').length,
    lost: leads.filter(l => l.status === 'lost').length,
    totalValue: leads.filter(l => l.status !== 'lost').reduce((s, l) => s + (l.value || 0), 0),
    unassigned: leads.filter(l => !l.assigned_to).length,
  }), [leads]);

  const pipelineData = useMemo(() => {
    const stages: LeadStatus[] = ['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'];
    return stages.map(s => ({
      status: s,
      ...(statusConfig[s] || { label: s, color: '', icon: AlertCircle }),
      count: leads.filter(l => l.status === s).length,
      value: leads.filter(l => l.status === s).reduce((sum, l) => sum + (l.value || 0), 0),
    }));
  }, [leads]);

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage business leads from all sources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: 'Exported' })}><Download className="w-4 h-4" />Export</Button>
          <Button className="gap-2" onClick={() => setShowNewLead(true)}><Plus className="w-4 h-4" />Add Lead</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Leads</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold text-blue-600">{stats.new}</p><p className="text-xs text-muted-foreground">New</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold text-amber-600">{stats.active}</p><p className="text-xs text-muted-foreground">Active Pipeline</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold text-emerald-600">{stats.won}</p><p className="text-xs text-muted-foreground">Won</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold text-rose-600">{stats.lost}</p><p className="text-xs text-muted-foreground">Lost</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold">{fmt(stats.totalValue)}</p><p className="text-xs text-muted-foreground">Pipeline Value</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xl font-bold text-orange-600">{stats.unassigned}</p><p className="text-xs text-muted-foreground">Unassigned</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Sales Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {pipelineData.map(stage => (
              <div key={stage.status} className="text-center p-3 rounded-lg bg-muted/30 border">
                <Badge variant="outline" className={stage.color}>{stage.label}</Badge>
                <p className="text-2xl font-bold mt-2">{stage.count}</p>
                <p className="text-xs text-muted-foreground">{fmt(stage.value)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {Object.entries(sourceConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Lead</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold text-right">Value</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map(lead => {
                const src = sourceConfig[lead.source] || { label: lead.source, icon: '📋', color: '' };
                const st = statusConfig[lead.status] || { label: lead.status, color: '', icon: AlertCircle };
                const StIcon = st.icon;
                return (
                  <TableRow key={lead.id}>
                    <TableCell><div><p className="font-medium">{lead.company_name}</p><p className="text-xs text-muted-foreground">{lead.contact_person}</p></div></TableCell>
                    <TableCell><div><p className="text-sm">{lead.phone || '—'}</p><p className="text-xs text-muted-foreground">{lead.email || '—'}</p></div></TableCell>
                    <TableCell><Badge variant="outline" className={src.color}>{src.icon} {src.label}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={st.color}><StIcon className="w-3 h-3 mr-1" />{st.label}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={lead.priority === 'high' ? 'bg-rose-500/10 text-rose-600 border-rose-500/30' : lead.priority === 'medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-muted text-muted-foreground'}>{lead.priority}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{fmt(lead.value || 0)}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}><Eye className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                );
              })}
              {leads.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No leads found. Add your first lead above.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Detail */}
      <Dialog open={!!selectedLead} onOpenChange={open => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedLead?.company_name}</DialogTitle></DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Contact</p><p className="font-medium">{selectedLead.contact_person}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p>{selectedLead.phone || '—'}</p></div>
                <div><p className="text-muted-foreground">Email</p><p>{selectedLead.email || '—'}</p></div>
                <div><p className="text-muted-foreground">Value</p><p className="font-bold">{fmt(selectedLead.value || 0)}</p></div>
              </div>
              {selectedLead.notes && <div><p className="text-sm text-muted-foreground">Notes</p><p className="text-sm">{selectedLead.notes}</p></div>}
              <div className="flex gap-2 flex-wrap">
                {(['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'] as LeadStatus[]).map(s => (
                  <Button key={s} variant={selectedLead.status === s ? 'default' : 'outline'} size="sm" onClick={() => { handleUpdateStatus(selectedLead.id, s); setSelectedLead({ ...selectedLead, status: s }); }}>
                    {statusConfig[s]?.label || s}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Lead */}
      <Dialog open={showNewLead} onOpenChange={setShowNewLead}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Company Name *</Label><Input value={newLead.company_name} onChange={e => setNewLead(p => ({ ...p, company_name: e.target.value }))} /></div>
              <div><Label>Contact Person *</Label><Input value={newLead.contact_person} onChange={e => setNewLead(p => ({ ...p, contact_person: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} /></div>
              <div><Label>Email</Label><Input value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Source</Label>
                <Select value={newLead.source} onValueChange={v => setNewLead(p => ({ ...p, source: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(sourceConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Value (₹)</Label><Input type="number" value={newLead.value} onChange={e => setNewLead(p => ({ ...p, value: Number(e.target.value) }))} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={newLead.notes} onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewLead(false)}>Cancel</Button>
            <Button onClick={handleCreateLead}>Create Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
