import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  MessageCircle, Instagram, Facebook, Mail, Search, Send, Bot, Zap, UserPlus, AlertTriangle,
  ChevronRight, Phone, Users, CheckCircle, Clock, XCircle, Sparkles, Tag, Brain, RotateCcw, Ban, CalendarClock, Loader2,
  ShoppingCart,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { socialMessagesDb } from '@/services/database';

type Channel = 'all' | 'instagram' | 'facebook' | 'whatsapp' | 'email' | 'marketplace';

const channelTabs: { id: Channel; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: MessageCircle },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
];

const statusColors: Record<string, string> = {
  unread: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  replied: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  escalated: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
};

const categoryConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new_lead: { label: 'New Lead', color: 'bg-emerald-500/10 text-emerald-600', icon: UserPlus },
  order_status: { label: 'Order Status', color: 'bg-blue-500/10 text-blue-600', icon: ShoppingCart },
  complaint: { label: 'Complaint', color: 'bg-rose-500/10 text-rose-600', icon: AlertTriangle },
  return: { label: 'Return', color: 'bg-orange-500/10 text-orange-600', icon: RotateCcw },
  follow_up: { label: 'Follow-up', color: 'bg-purple-500/10 text-purple-600', icon: CalendarClock },
  ignore: { label: 'Ignore', color: 'bg-muted text-muted-foreground', icon: Ban },
};

export default function SocialInsights() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState<Channel>('all');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(50);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await socialMessagesDb.getAll({
        channel: activeChannel !== 'all' ? activeChannel : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined,
      });
      setMessages(data);
      if (data.length > 0 && !selectedMessage) setSelectedMessage(data[0]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, [activeChannel, searchQuery, categoryFilter]);

  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    pending: messages.filter(m => m.status === 'pending').length,
    replied: messages.filter(m => m.status === 'replied').length,
    escalated: messages.filter(m => m.status === 'escalated').length,
    newLeads: messages.filter(m => m.category === 'new_lead').length,
    autoReplied: messages.filter(m => m.auto_reply_triggered).length,
    lowConfidence: messages.filter(m => (m.ai_confidence || 0) * 100 < aiConfidenceThreshold).length,
  }), [messages, aiConfidenceThreshold]);

  const triggerAutoReply = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    const confidence = msg.ai_confidence || 0;
    if (confidence * 100 < aiConfidenceThreshold) {
      await socialMessagesDb.update(msgId, { status: 'escalated', escalated_to: 'Human Agent' });
      toast({ title: 'Low Confidence — Assigned to Human', variant: 'destructive' });
    } else {
      await socialMessagesDb.update(msgId, { status: 'replied', auto_reply_triggered: true });
      toast({ title: 'AI Auto-Reply Sent' });
    }
    fetchMessages();
  };

  const escalateMessage = async (msgId: string) => {
    await socialMessagesDb.update(msgId, { status: 'escalated', escalated_to: 'Operations Manager' });
    toast({ title: 'Escalated' });
    fetchMessages();
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social & Marketplace Inbox</h1>
          <p className="text-muted-foreground">Unified communication hub with AI governance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <Label className="text-xs">AI Auto-Reply</Label>
            <Switch checked={aiAutoReply} onCheckedChange={setAiAutoReply} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence: {aiConfidenceThreshold}%</span>
            <Slider value={[aiConfidenceThreshold]} onValueChange={v => setAiConfidenceThreshold(v[0])} min={10} max={95} step={5} className="w-24" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: MessageCircle },
          { label: 'Unread', value: stats.unread, icon: Mail },
          { label: 'Pending', value: stats.pending, icon: Clock },
          { label: 'Replied', value: stats.replied, icon: CheckCircle },
          { label: 'Escalated', value: stats.escalated, icon: AlertTriangle },
          { label: 'New Leads', value: stats.newLeads, icon: UserPlus },
          { label: 'Auto-Replied', value: stats.autoReplied, icon: Zap },
          { label: 'Low Conf.', value: stats.lowConfidence, icon: Brain },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-3 text-center"><s.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-bold">{s.value}</p><p className="text-[10px] text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 flex-wrap">
        {channelTabs.map(ch => (
          <Button key={ch.id} variant={activeChannel === ch.id ? 'default' : 'outline'} size="sm" className="gap-1.5" onClick={() => setActiveChannel(ch.id)}>
            <ch.icon className="w-4 h-4" />{ch.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Message List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-base">Messages ({messages.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {messages.map(msg => {
                const catCfg = categoryConfig[msg.category] || categoryConfig.new_lead;
                const CatIcon = catCfg.icon;
                return (
                  <div key={msg.id} onClick={() => setSelectedMessage(msg)} className={`p-3 border-b cursor-pointer hover:bg-muted/30 transition-colors ${selectedMessage?.id === msg.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{msg.sender}</p>
                          {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.preview}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="outline" className={`text-[9px] h-4 px-1 ${catCfg.color}`}><CatIcon className="w-2.5 h-2.5 mr-0.5" />{catCfg.label}</Badge>
                          <Badge variant="outline" className={`text-[9px] h-4 px-1 ${statusColors[msg.status] || ''}`}>{msg.status}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && <p className="text-center py-12 text-muted-foreground">No messages found</p>}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{selectedMessage ? selectedMessage.sender : 'Select a message'}</CardTitle>
            {selectedMessage && <CardDescription>{selectedMessage.subject || selectedMessage.preview}</CardDescription>}
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={statusColors[selectedMessage.status] || ''}>{selectedMessage.status}</Badge>
                  <Badge variant="outline">{selectedMessage.channel}</Badge>
                  {selectedMessage.ai_confidence != null && (
                    <Badge variant="outline" className="gap-1"><Brain className="w-3 h-3" />AI: {Math.round((selectedMessage.ai_confidence || 0) * 100)}%</Badge>
                  )}
                  {selectedMessage.auto_reply_triggered && <Badge variant="outline" className="bg-primary/10 text-primary gap-1"><Zap className="w-3 h-3" />Auto-replied</Badge>}
                  {selectedMessage.escalated_to && <Badge variant="outline" className="bg-rose-500/10 text-rose-600 gap-1"><AlertTriangle className="w-3 h-3" />{selectedMessage.escalated_to}</Badge>}
                </div>

                {/* Conversation */}
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  {(selectedMessage.conversation_history || []).map((entry: any, i: number) => (
                    <div key={i} className={`mb-3 flex ${entry.role === 'customer' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        entry.role === 'customer' ? 'bg-muted' :
                        entry.role === 'ai' ? 'bg-primary/10 text-primary' :
                        'bg-blue-500/10 text-blue-700'
                      }`}>
                        <p className="text-[10px] font-semibold mb-1 uppercase">{entry.role}</p>
                        <p>{entry.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedMessage.conversation_history || selectedMessage.conversation_history.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">No conversation history</p>
                  )}
                </ScrollArea>

                <div className="flex gap-2">
                  {aiAutoReply && !selectedMessage.auto_reply_triggered && (
                    <Button size="sm" className="gap-1" onClick={() => triggerAutoReply(selectedMessage.id)}>
                      <Zap className="w-3 h-3" />Auto-Reply
                    </Button>
                  )}
                  {selectedMessage.status !== 'escalated' && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => escalateMessage(selectedMessage.id)}>
                      <AlertTriangle className="w-3 h-3" />Escalate
                    </Button>
                  )}
                  {selectedMessage.sender_phone && !selectedMessage.saved_to_contacts && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={async () => {
                      await socialMessagesDb.update(selectedMessage.id, { saved_to_contacts: true });
                      toast({ title: 'Contact Saved' });
                      fetchMessages();
                    }}>
                      <Phone className="w-3 h-3" />Save Contact
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">Select a message to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
