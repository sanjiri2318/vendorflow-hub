import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Heart, Play, MessageCircle, Share2, ExternalLink } from 'lucide-react';

const mockMetrics = [
  { platform: 'Facebook', icon: '📘', reach: '24.5K', engagement: '3.2K', growth: 12.4, color: 'bg-blue-500/10 text-blue-600' },
  { platform: 'Instagram', icon: '📸', reach: '38.7K', engagement: '5.8K', growth: 18.2, color: 'bg-pink-500/10 text-pink-600' },
  { platform: 'YouTube', icon: '🎬', reach: '12.3K', engagement: '1.4K', growth: 8.7, color: 'bg-red-500/10 text-red-600' },
  { platform: 'Twitter/X', icon: '🐦', reach: '8.1K', engagement: '920', growth: -2.3, color: 'bg-sky-500/10 text-sky-600' },
];

const mockCampaigns = [
  { id: 'CMP-001', name: 'Summer Sale 2026', platform: 'Facebook + Instagram', status: 'active', impressions: '45.2K', clicks: '3.8K', ctr: '8.4%', spend: '₹12,500' },
  { id: 'CMP-002', name: 'New Product Launch', platform: 'YouTube', status: 'active', impressions: '18.9K', clicks: '1.2K', ctr: '6.3%', spend: '₹8,200' },
  { id: 'CMP-003', name: 'Festive Collection', platform: 'Instagram', status: 'completed', impressions: '62.1K', clicks: '5.4K', ctr: '8.7%', spend: '₹15,800' },
  { id: 'CMP-004', name: 'Flash Deals', platform: 'Facebook', status: 'paused', impressions: '9.5K', clicks: '680', ctr: '7.2%', spend: '₹4,300' },
];

const mockPosts = [
  { id: 1, platform: '📸 Instagram', title: 'Premium Earbuds — Now Available!', engagement: '1.2K likes', time: '2h ago', type: 'image' },
  { id: 2, platform: '📘 Facebook', title: 'Summer Sale up to 40% off', engagement: '890 reactions', time: '5h ago', type: 'post' },
  { id: 3, platform: '🎬 YouTube', title: 'Fitness Watch X2 — Full Review', engagement: '3.4K views', time: '1d ago', type: 'video' },
  { id: 4, platform: '📸 Instagram', title: 'Behind the scenes: Warehouse tour', engagement: '2.1K likes', time: '1d ago', type: 'reel' },
  { id: 5, platform: '📘 Facebook', title: 'Customer testimonial: Baby Care Set', engagement: '456 reactions', time: '2d ago', type: 'post' },
  { id: 6, platform: '🎬 YouTube', title: 'How to choose the right speaker', engagement: '1.8K views', time: '3d ago', type: 'video' },
  { id: 7, platform: '📸 Instagram', title: 'New arrivals: LED Desk Lamp', engagement: '987 likes', time: '3d ago', type: 'image' },
  { id: 8, platform: '🐦 Twitter/X', title: 'Exciting updates coming soon!', engagement: '234 likes', time: '4d ago', type: 'tweet' },
  { id: 9, platform: '📘 Facebook', title: 'Weekly deals roundup', engagement: '678 reactions', time: '5d ago', type: 'post' },
  { id: 10, platform: '📸 Instagram', title: 'Yoga Mat Premium — Perfect for home', engagement: '1.5K likes', time: '6d ago', type: 'image' },
];

export default function SocialInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Social Media & Insights</h1>
        <p className="text-muted-foreground">Monitor marketing performance across social channels</p>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockMetrics.map(m => (
          <Card key={m.platform}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <span className="text-xl">{m.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{m.platform}</p>
                  <p className="text-xl font-bold">{m.reach}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className={`w-3 h-3 ${m.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
                    <span className={`text-xs font-medium ${m.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.growth >= 0 ? '+' : ''}{m.growth}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{m.engagement}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{m.reach}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Active and recent marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCampaigns.map(c => (
                <div key={c.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.platform}</p>
                    </div>
                    <Badge variant="outline" className={
                      c.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' :
                      c.status === 'paused' ? 'bg-amber-500/15 text-amber-600 border-amber-500/30' :
                      'bg-muted text-muted-foreground'
                    }>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Impressions</span><p className="font-medium">{c.impressions}</p></div>
                    <div><span className="text-muted-foreground">Clicks</span><p className="font-medium">{c.clicks}</p></div>
                    <div><span className="text-muted-foreground">CTR</span><p className="font-medium">{c.ctr}</p></div>
                    <div><span className="text-muted-foreground">Spend</span><p className="font-medium">{c.spend}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Last 10 social media posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between p-2.5 hover:bg-muted/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm shrink-0">{post.platform.split(' ')[0]}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.engagement} • {post.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">{post.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Preview Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Play className="w-5 h-5" />Video Content</CardTitle>
          <CardDescription>Latest product videos and promotional content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Fitness Watch X2 Review', 'Premium Earbuds Unboxing', 'Warehouse Tour BTS'].map((title, i) => (
              <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center relative group cursor-pointer">
                <div className="text-center">
                  <Play className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
