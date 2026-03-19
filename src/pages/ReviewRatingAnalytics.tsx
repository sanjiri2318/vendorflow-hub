import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Star, TrendingUp, TrendingDown, ThumbsDown, ThumbsUp, Search, AlertTriangle,
  BarChart3, MessageSquare, Lightbulb, ArrowUpRight, ArrowDownRight, Filter, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend
} from 'recharts';

// --- Mock data ---
const channelRatings = [
  { channel: 'Amazon', avg: 4.2, total: 3247, five: 1820, four: 680, three: 320, two: 210, one: 217, trend: 'up', change: 0.3 },
  { channel: 'Flipkart', avg: 4.0, total: 2192, five: 1050, four: 520, three: 280, two: 180, one: 162, trend: 'up', change: 0.1 },
  { channel: 'Meesho', avg: 3.6, total: 1456, five: 510, four: 380, three: 220, two: 190, one: 156, trend: 'down', change: -0.2 },
  { channel: 'Myntra', avg: 4.5, total: 821, five: 520, four: 180, three: 60, two: 35, one: 26, trend: 'up', change: 0.4 },
  { channel: 'Own Website', avg: 4.3, total: 534, five: 310, four: 120, three: 50, two: 30, one: 24, trend: 'up', change: 0.2 },
  { channel: 'Nykaa', avg: 4.1, total: 387, five: 190, four: 98, three: 45, two: 30, one: 24, trend: 'down', change: -0.1 },
];

const negativeIssues = [
  { id: 1, product: 'Wireless Earbuds Pro', sku: 'WEP-001', issue: 'Battery drains quickly after 2 hours', mentions: 47, severity: 'critical', channels: ['Amazon', 'Flipkart'], trend: 'rising', impact: -12500 },
  { id: 2, product: 'Cotton T-Shirt XL', sku: 'CTS-XL', issue: 'Size runs 1-2 sizes smaller than listed', mentions: 38, severity: 'high', channels: ['Meesho', 'Myntra'], trend: 'rising', impact: -8900 },
  { id: 3, product: 'Phone Case Premium', sku: 'PCP-001', issue: 'Poor packaging causes damage in transit', mentions: 29, severity: 'medium', channels: ['Amazon'], trend: 'stable', impact: -4200 },
  { id: 4, product: 'Smart Watch Band', sku: 'SWB-001', issue: 'Strap material peels after 1 month', mentions: 22, severity: 'high', channels: ['Flipkart', 'Amazon'], trend: 'declining', impact: -6700 },
  { id: 5, product: 'Yoga Mat Pro', sku: 'YMP-001', issue: 'Strong chemical smell on arrival', mentions: 18, severity: 'medium', channels: ['Amazon', 'Own Website'], trend: 'stable', impact: -3100 },
  { id: 6, product: 'LED Desk Lamp', sku: 'LDL-001', issue: 'Flickers at highest brightness setting', mentions: 14, severity: 'low', channels: ['Flipkart'], trend: 'declining', impact: -1800 },
  { id: 7, product: 'Travel Backpack', sku: 'TBP-001', issue: 'Zipper breaks easily under load', mentions: 11, severity: 'high', channels: ['Amazon', 'Meesho'], trend: 'rising', impact: -5400 },
];

const keywordData = [
  { keyword: 'quality', positive: 342, negative: 45, total: 387, sentiment: 0.88 },
  { keyword: 'delivery speed', positive: 287, negative: 32, total: 319, sentiment: 0.90 },
  { keyword: 'size issue', positive: 12, negative: 156, total: 168, sentiment: 0.07 },
  { keyword: 'value for money', positive: 234, negative: 28, total: 262, sentiment: 0.89 },
  { keyword: 'packaging', positive: 45, negative: 98, total: 143, sentiment: 0.31 },
  { keyword: 'comfortable', positive: 189, negative: 8, total: 197, sentiment: 0.96 },
  { keyword: 'durability', positive: 67, negative: 89, total: 156, sentiment: 0.43 },
  { keyword: 'color accuracy', positive: 23, negative: 67, total: 90, sentiment: 0.26 },
  { keyword: 'customer support', positive: 156, negative: 45, total: 201, sentiment: 0.78 },
  { keyword: 'return process', positive: 34, negative: 78, total: 112, sentiment: 0.30 },
];

const seoSuggestions = [
  { keyword: 'wireless earbuds', volume: 74000, difficulty: 68, current: 'Not ranking', suggestion: 'Add "long battery life" to title & bullet points', priority: 'high' },
  { keyword: 'cotton t-shirt men', volume: 45000, difficulty: 42, current: 'Page 3', suggestion: 'Include size chart in A+ content, add "true to size" keyword', priority: 'high' },
  { keyword: 'premium phone case', volume: 28000, difficulty: 55, current: 'Page 2', suggestion: 'Add lifestyle images & "shock-proof" keyword', priority: 'medium' },
  { keyword: 'yoga mat non-slip', volume: 32000, difficulty: 38, current: 'Not ranking', suggestion: 'Add "eco-friendly" and "6mm thick" to backend keywords', priority: 'high' },
  { keyword: 'smart watch band', volume: 18000, difficulty: 51, current: 'Page 4', suggestion: 'Use "adjustable" and material-specific keywords', priority: 'medium' },
  { keyword: 'led desk lamp', volume: 22000, difficulty: 35, current: 'Page 1', suggestion: 'Maintain position; add "USB powered" for related searches', priority: 'low' },
];

const monthlyTrend = [
  { month: 'Oct', amazon: 4.0, flipkart: 3.8, meesho: 3.5, myntra: 4.3, overall: 3.9 },
  { month: 'Nov', amazon: 4.1, flipkart: 3.9, meesho: 3.6, myntra: 4.4, overall: 4.0 },
  { month: 'Dec', amazon: 4.0, flipkart: 3.9, meesho: 3.7, myntra: 4.3, overall: 4.0 },
  { month: 'Jan', amazon: 4.1, flipkart: 4.0, meesho: 3.5, myntra: 4.5, overall: 4.0 },
  { month: 'Feb', amazon: 4.2, flipkart: 4.0, meesho: 3.6, myntra: 4.5, overall: 4.1 },
  { month: 'Mar', amazon: 4.2, flipkart: 4.0, meesho: 3.6, myntra: 4.5, overall: 4.1 },
];

const improvementActions = [
  { action: 'Fix battery issue in Wireless Earbuds Pro (hardware revision)', impact: 'High', estimatedRating: '+0.4', status: 'urgent', cost: '₹85,000' },
  { action: 'Update size chart for Cotton T-Shirt range', impact: 'High', estimatedRating: '+0.3', status: 'in_progress', cost: '₹5,000' },
  { action: 'Upgrade packaging materials for Phone Case Premium', impact: 'Medium', estimatedRating: '+0.2', status: 'planned', cost: '₹12,000' },
  { action: 'Source better strap material for Smart Watch Band', impact: 'High', estimatedRating: '+0.3', status: 'planned', cost: '₹35,000' },
  { action: 'Air-out Yoga Mats before packaging', impact: 'Medium', estimatedRating: '+0.2', status: 'in_progress', cost: '₹8,000' },
  { action: 'Add brightness stabilizer circuit to LED Desk Lamp', impact: 'Low', estimatedRating: '+0.1', status: 'backlog', cost: '₹22,000' },
];

const severityColor: Record<string, string> = {
  critical: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
  high: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  low: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
};

const statusColor: Record<string, string> = {
  urgent: 'bg-rose-500/15 text-rose-600',
  in_progress: 'bg-blue-500/15 text-blue-600',
  planned: 'bg-amber-500/15 text-amber-600',
  backlog: 'bg-muted text-muted-foreground',
};

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function ReviewRatingAnalytics() {
  const [channelFilter, setChannelFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredKeywords = keywordData.filter(k =>
    k.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const overallAvg = (channelRatings.reduce((s, c) => s + c.avg * c.total, 0) / channelRatings.reduce((s, c) => s + c.total, 0)).toFixed(1);
  const totalReviews = channelRatings.reduce((s, c) => s + c.total, 0);
  const totalNegative = negativeIssues.reduce((s, n) => s + n.mentions, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review & Rating Analytics</h1>
          <p className="text-muted-foreground">Monitor reviews, track negativity, and improve search rankings across all channels</p>
        </div>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[180px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {channelRatings.map(c => <SelectItem key={c.channel} value={c.channel}>{c.channel}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /><p className="text-2xl font-bold">{overallAvg}</p></div><p className="text-xs text-muted-foreground">Overall Rating</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-2xl font-bold">{totalReviews.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Reviews</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-2xl font-bold text-rose-600">{totalNegative}</p><p className="text-xs text-muted-foreground">Negative Mentions</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-2xl font-bold text-emerald-600">{seoSuggestions.filter(s => s.priority === 'high').length}</p><p className="text-xs text-muted-foreground">High Priority SEO Fixes</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-2xl font-bold text-primary">{improvementActions.filter(a => a.status === 'urgent').length}</p><p className="text-xs text-muted-foreground">Urgent Actions</p></CardContent></Card>
      </div>

      <Tabs defaultValue="ratings">
        <TabsList className="flex-wrap">
          <TabsTrigger value="ratings" className="gap-1.5"><Star className="w-4 h-4" />Channel Ratings</TabsTrigger>
          <TabsTrigger value="negative" className="gap-1.5"><ThumbsDown className="w-4 h-4" />Negative Tracking</TabsTrigger>
          <TabsTrigger value="keywords" className="gap-1.5"><Search className="w-4 h-4" />Keyword Analysis</TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5"><Lightbulb className="w-4 h-4" />SEO Suggestions</TabsTrigger>
          <TabsTrigger value="actions" className="gap-1.5"><Sparkles className="w-4 h-4" />Improvement Plan</TabsTrigger>
        </TabsList>

        {/* Channel Ratings Tab */}
        <TabsContent value="ratings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Rating Distribution by Channel</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelRatings}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="five" name="5★" stackId="a" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="four" name="4★" stackId="a" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="three" name="3★" stackId="a" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="two" name="2★" stackId="a" fill="hsl(var(--chart-4))" />
                    <Bar dataKey="one" name="1★" stackId="a" fill="hsl(var(--chart-5))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Rating Trend (6 Months)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amazon" name="Amazon" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="flipkart" name="Flipkart" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="meesho" name="Meesho" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    <Line type="monotone" dataKey="myntra" name="Myntra" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                    <Line type="monotone" dataKey="overall" name="Overall" stroke="hsl(var(--primary))" strokeWidth={3} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Channel</TableHead>
                    <TableHead className="font-semibold">Avg Rating</TableHead>
                    <TableHead className="font-semibold">Total Reviews</TableHead>
                    <TableHead className="font-semibold">5★</TableHead>
                    <TableHead className="font-semibold">4★</TableHead>
                    <TableHead className="font-semibold">3★</TableHead>
                    <TableHead className="font-semibold">2★</TableHead>
                    <TableHead className="font-semibold">1★</TableHead>
                    <TableHead className="font-semibold">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelRatings.map(c => (
                    <TableRow key={c.channel}>
                      <TableCell className="font-medium">{c.channel}</TableCell>
                      <TableCell><div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /><span className="font-bold">{c.avg}</span></div></TableCell>
                      <TableCell>{c.total.toLocaleString()}</TableCell>
                      <TableCell className="text-emerald-600 font-medium">{c.five}</TableCell>
                      <TableCell className="text-blue-600">{c.four}</TableCell>
                      <TableCell className="text-amber-600">{c.three}</TableCell>
                      <TableCell className="text-orange-600">{c.two}</TableCell>
                      <TableCell className="text-rose-600">{c.one}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {c.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                          <span className={c.trend === 'up' ? 'text-emerald-600 text-sm' : 'text-rose-600 text-sm'}>{c.change > 0 ? '+' : ''}{c.change}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Negative Tracking Tab */}
        <TabsContent value="negative" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500" />Negative Review Tracker</CardTitle>
              <CardDescription>Products with recurring negative feedback patterns</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Issue</TableHead>
                    <TableHead className="font-semibold">Mentions</TableHead>
                    <TableHead className="font-semibold">Severity</TableHead>
                    <TableHead className="font-semibold">Channels</TableHead>
                    <TableHead className="font-semibold">Trend</TableHead>
                    <TableHead className="font-semibold text-right">Est. Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {negativeIssues.map(n => (
                    <TableRow key={n.id}>
                      <TableCell className="font-medium">{n.product}</TableCell>
                      <TableCell className="font-mono text-xs">{n.sku}</TableCell>
                      <TableCell className="max-w-[250px] text-sm text-muted-foreground">{n.issue}</TableCell>
                      <TableCell><Badge variant="secondary" className="font-bold">{n.mentions}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`capitalize ${severityColor[n.severity]}`}>{n.severity}</Badge></TableCell>
                      <TableCell><div className="flex gap-1 flex-wrap">{n.channels.map(ch => <Badge key={ch} variant="outline" className="text-[10px]">{ch}</Badge>)}</div></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={n.trend === 'rising' ? 'text-rose-600 border-rose-500/30' : n.trend === 'stable' ? 'text-amber-600 border-amber-500/30' : 'text-emerald-600 border-emerald-500/30'}>
                          {n.trend === 'rising' ? '↑' : n.trend === 'declining' ? '↓' : '→'} {n.trend}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-rose-600">₹{Math.abs(n.impact).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyword Analysis Tab */}
        <TabsContent value="keywords" className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search keywords..." className="pl-9" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Keyword Sentiment Map</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredKeywords} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis dataKey="keyword" type="category" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="positive" name="Positive" fill="hsl(var(--chart-1))" stackId="a" />
                    <Bar dataKey="negative" name="Negative" fill="hsl(var(--chart-5))" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Keyword Details</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Keyword</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Sentiment</TableHead>
                      <TableHead className="font-semibold">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeywords.map(k => (
                      <TableRow key={k.keyword}>
                        <TableCell className="font-medium">{k.keyword}</TableCell>
                        <TableCell>{k.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {k.sentiment > 0.7 ? <ThumbsUp className="w-4 h-4 text-emerald-500" /> : k.sentiment > 0.4 ? <BarChart3 className="w-4 h-4 text-amber-500" /> : <ThumbsDown className="w-4 h-4 text-rose-500" />}
                            <Progress value={k.sentiment * 100} className="h-2 w-20" />
                          </div>
                        </TableCell>
                        <TableCell className={`font-bold ${k.sentiment > 0.7 ? 'text-emerald-600' : k.sentiment > 0.4 ? 'text-amber-600' : 'text-rose-600'}`}>{(k.sentiment * 100).toFixed(0)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Suggestions Tab */}
        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />Search Engine Improvement Suggestions</CardTitle>
              <CardDescription>AI-powered keyword & listing optimization recommendations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Target Keyword</TableHead>
                    <TableHead className="font-semibold">Search Volume</TableHead>
                    <TableHead className="font-semibold">Difficulty</TableHead>
                    <TableHead className="font-semibold">Current Rank</TableHead>
                    <TableHead className="font-semibold">AI Suggestion</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seoSuggestions.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{s.keyword}</TableCell>
                      <TableCell>{s.volume.toLocaleString()}/mo</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={s.difficulty} className="h-2 w-16" />
                          <span className="text-xs">{s.difficulty}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={s.current === 'Not ranking' ? 'text-rose-600' : s.current === 'Page 1' ? 'text-emerald-600' : 'text-amber-600'}>{s.current}</Badge></TableCell>
                      <TableCell className="max-w-[300px] text-sm">{s.suggestion}</TableCell>
                      <TableCell><Badge variant="outline" className={s.priority === 'high' ? severityColor.high : s.priority === 'medium' ? severityColor.medium : severityColor.low}>{s.priority}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvement Plan Tab */}
        <TabsContent value="actions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />AI-Recommended Improvement Actions</CardTitle>
              <CardDescription>Prioritized actions to improve ratings based on negative review analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Action</TableHead>
                    <TableHead className="font-semibold">Impact</TableHead>
                    <TableHead className="font-semibold">Est. Rating Gain</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Est. Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {improvementActions.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium max-w-[350px]">{a.action}</TableCell>
                      <TableCell><Badge variant="outline" className={a.impact === 'High' ? severityColor.high : a.impact === 'Medium' ? severityColor.medium : severityColor.low}>{a.impact}</Badge></TableCell>
                      <TableCell className="text-emerald-600 font-bold">{a.estimatedRating}</TableCell>
                      <TableCell><Badge className={`capitalize ${statusColor[a.status]}`}>{a.status.replace('_', ' ')}</Badge></TableCell>
                      <TableCell className="text-right font-semibold">{a.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
