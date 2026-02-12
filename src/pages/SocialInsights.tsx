import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Eye, Heart, Search, Send, MessageCircle, Instagram, Facebook, Mail, MessageSquare as WhatsApp, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type Channel = 'all' | 'instagram' | 'facebook' | 'whatsapp' | 'email' | 'marketplace';

interface Message {
  id: string;
  channel: Channel;
  channelIcon: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  status: 'unread' | 'replied' | 'pending';
  avatar: string;
}

const mockMessages: Message[] = [
  { id: 'MSG-001', channel: 'instagram', channelIcon: '📸', sender: 'priya_fashion', subject: 'Product inquiry', preview: 'Hi, is the wireless earbuds available in white?', time: '2m ago', status: 'unread', avatar: 'P' },
  { id: 'MSG-002', channel: 'facebook', channelIcon: '📘', sender: 'Rahul Sharma', subject: 'Order status', preview: 'Can you check my order ORD-2024-001 status?', time: '15m ago', status: 'unread', avatar: 'R' },
  { id: 'MSG-003', channel: 'whatsapp', channelIcon: '💬', sender: '+91 98765 43210', subject: 'Bulk order', preview: 'We need 50 units of the fitness watch. Whats the bulk price?', time: '32m ago', status: 'pending', avatar: 'W' },
  { id: 'MSG-004', channel: 'email', channelIcon: '📧', sender: 'kavita.m@email.com', subject: 'Return request', preview: 'I received a damaged speaker, need to initiate return process.', time: '1h ago', status: 'replied', avatar: 'K' },
  { id: 'MSG-005', channel: 'marketplace', channelIcon: '🛒', sender: 'Amazon Buyer', subject: 'Quality concern', preview: 'The yoga mat seems different from the product image shown...', time: '2h ago', status: 'pending', avatar: 'A' },
  { id: 'MSG-006', channel: 'instagram', channelIcon: '📸', sender: 'sneha_reviews', subject: 'Collaboration', preview: 'Would love to review your products. Please DM details.', time: '3h ago', status: 'unread', avatar: 'S' },
  { id: 'MSG-007', channel: 'whatsapp', channelIcon: '💬', sender: '+91 87654 32109', subject: 'Payment query', preview: 'My payment got debited but order not confirmed yet', time: '4h ago', status: 'replied', avatar: 'W' },
  { id: 'MSG-008', channel: 'facebook', channelIcon: '📘', sender: 'Amit Kumar', subject: 'Product feedback', preview: 'The baby care gift set was amazing! Can you add more variants?', time: '5h ago', status: 'replied', avatar: 'A' },
  { id: 'MSG-009', channel: 'email', channelIcon: '📧', sender: 'vendor@partner.com', subject: 'Stock update', preview: 'Please update availability for SKU-AMZ-006 on your portal.', time: '6h ago', status: 'pending', avatar: 'V' },
  { id: 'MSG-010', channel: 'marketplace', channelIcon: '🛒', sender: 'Flipkart Buyer', subject: 'Size exchange', preview: 'Need size L instead of M for the cotton t-shirt order', time: '8h ago', status: 'replied', avatar: 'F' },
];

const channelTabs: { id: Channel; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: MessageCircle },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsApp },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  unread: { label: 'Unread', className: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
  replied: { label: 'Replied', className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  pending: { label: 'Pending', className: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
};

export default function SocialInsights() {
  const { toast } = useToast();
  const [activeChannel, setActiveChannel] = useState<Channel>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(mockMessages[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = mockMessages.filter(m => {
    const matchesChannel = activeChannel === 'all' || m.channel === activeChannel;
    const matchesSearch = m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const stats = {
    total: mockMessages.length,
    unread: mockMessages.filter(m => m.status === 'unread').length,
    pending: mockMessages.filter(m => m.status === 'pending').length,
    replied: mockMessages.filter(m => m.status === 'replied').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unified Inbox</h1>
          <p className="text-muted-foreground">All customer conversations across channels in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/15 text-blue-600 border-blue-500/30">{stats.unread} unread</Badge>
          <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30">{stats.pending} pending</Badge>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><MessageCircle className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Messages</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Eye className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{stats.unread}</p><p className="text-sm text-muted-foreground">Unread</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><TrendingUp className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">Pending</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><Heart className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{stats.replied}</p><p className="text-sm text-muted-foreground">Replied</p></div></div></CardContent></Card>
      </div>

      {/* Unified Inbox Layout */}
      <div className="grid grid-cols-12 gap-4 h-[600px]">
        {/* Channel Sidebar */}
        <Card className="col-span-12 md:col-span-2">
          <CardContent className="p-2 h-full">
            <div className="space-y-1">
              {channelTabs.map(ch => {
                const Icon = ch.icon;
                const count = ch.id === 'all' ? mockMessages.length : mockMessages.filter(m => m.channel === ch.id).length;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeChannel === ch.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{ch.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">{count}</Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Message List */}
        <Card className="col-span-12 md:col-span-4">
          <CardHeader className="p-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-0.5 p-2">
                {filteredMessages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedMessage?.id === msg.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                    } ${msg.status === 'unread' ? 'bg-blue-500/5' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                        {msg.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-sm truncate ${msg.status === 'unread' ? 'font-semibold' : 'font-medium'}`}>{msg.sender}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{msg.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.subject}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs">{msg.channelIcon}</span>
                          <Badge variant="outline" className={`text-[10px] h-4 px-1 ${statusConfig[msg.status].className}`}>
                            {statusConfig[msg.status].label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">No messages found</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="col-span-12 md:col-span-6">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                      {selectedMessage.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-base">{selectedMessage.sender}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5">
                        <span>{selectedMessage.channelIcon}</span>
                        <span>{selectedMessage.subject}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusConfig[selectedMessage.status].className}>
                    {statusConfig[selectedMessage.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{selectedMessage.time}</p>
                    <p className="text-sm">{selectedMessage.preview}</p>
                  </div>

                  {/* Response Tracking */}
                  <Card className="bg-muted/20">
                    <CardContent className="p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Response Tracking</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-muted-foreground block">First Response</span><span className="font-medium">{selectedMessage.status === 'replied' ? '12m' : 'Pending'}</span></div>
                        <div><span className="text-muted-foreground block">Assigned To</span><span className="font-medium">Team A</span></div>
                        <div><span className="text-muted-foreground block">Priority</span><span className="font-medium">{selectedMessage.status === 'unread' ? 'High' : 'Normal'}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input placeholder="Type a reply..." className="flex-1" />
                  <Button size="icon" onClick={() => toast({ title: 'Reply Sent', description: 'Message reply sent successfully (UI only).' })}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Select a message to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
