import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, TrendingUp, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PriceBreakdown {
  productName: string;
  productId: string;
  portal: string;
  portalIcon: string;
  channel: string;
  marketplacePrice: number;
  commission: number;
  commissionPct: number;
  platformFees: number;
  shippingFees: number;
  gst: number;
  tcs: number;
  netPayout: number;
}

const mockPriceData: PriceBreakdown[] = [
  { productName: 'Premium Wireless Earbuds Pro', productId: 'PROD-001', portal: 'Amazon', portalIcon: '🛒', channel: 'Amazon', marketplacePrice: 2999, commission: 450, commissionPct: 15, platformFees: 45, shippingFees: 60, gst: 162, tcs: 30, netPayout: 2252 },
  { productName: 'Premium Wireless Earbuds Pro', productId: 'PROD-001', portal: 'Flipkart', portalIcon: '🛍️', channel: 'Flipkart', marketplacePrice: 2999, commission: 390, commissionPct: 13, platformFees: 50, shippingFees: 55, gst: 162, tcs: 30, netPayout: 2312 },
  { productName: 'Premium Wireless Earbuds Pro', productId: 'PROD-001', portal: 'Own Website', portalIcon: '🌐', channel: 'Website', marketplacePrice: 2999, commission: 0, commissionPct: 0, platformFees: 75, shippingFees: 80, gst: 162, tcs: 0, netPayout: 2682 },
  { productName: 'Smart Fitness Watch X2', productId: 'PROD-002', portal: 'Amazon', portalIcon: '🛒', channel: 'Amazon', marketplacePrice: 4999, commission: 750, commissionPct: 15, platformFees: 75, shippingFees: 60, gst: 270, tcs: 50, netPayout: 3794 },
  { productName: 'Smart Fitness Watch X2', productId: 'PROD-002', portal: 'Meesho', portalIcon: '📦', channel: 'Meesho', marketplacePrice: 4999, commission: 600, commissionPct: 12, platformFees: 40, shippingFees: 65, gst: 270, tcs: 50, netPayout: 3974 },
  { productName: 'Smart Fitness Watch X2', productId: 'PROD-002', portal: 'Shopify', portalIcon: '🛒', channel: 'Shopify', marketplacePrice: 4999, commission: 0, commissionPct: 0, platformFees: 150, shippingFees: 70, gst: 270, tcs: 0, netPayout: 4509 },
  { productName: 'Organic Cotton T-Shirt', productId: 'PROD-003', portal: 'Amazon', portalIcon: '🛒', channel: 'Amazon', marketplacePrice: 599, commission: 120, commissionPct: 20, platformFees: 15, shippingFees: 50, gst: 32, tcs: 6, netPayout: 376 },
  { productName: 'Organic Cotton T-Shirt', productId: 'PROD-003', portal: 'Flipkart', portalIcon: '🛍️', channel: 'Flipkart', marketplacePrice: 599, commission: 108, commissionPct: 18, platformFees: 18, shippingFees: 45, gst: 32, tcs: 6, netPayout: 390 },
  { productName: 'Organic Cotton T-Shirt', productId: 'PROD-003', portal: 'Manual', portalIcon: '📋', channel: 'Manual', marketplacePrice: 599, commission: 0, commissionPct: 0, platformFees: 0, shippingFees: 60, gst: 32, tcs: 0, netPayout: 507 },
  { productName: 'Baby Care Gift Set', productId: 'PROD-005', portal: 'FirstCry', portalIcon: '👶', channel: 'FirstCry', marketplacePrice: 1299, commission: 195, commissionPct: 15, platformFees: 25, shippingFees: 55, gst: 70, tcs: 13, netPayout: 941 },
  { productName: 'Baby Care Gift Set', productId: 'PROD-005', portal: 'Own Website', portalIcon: '🌐', channel: 'Website', marketplacePrice: 1299, commission: 0, commissionPct: 0, platformFees: 35, shippingFees: 60, gst: 70, tcs: 0, netPayout: 1134 },
  { productName: 'Stainless Steel Water Bottle', productId: 'PROD-004', portal: 'Blinkit', portalIcon: '⚡', channel: 'Blinkit', marketplacePrice: 799, commission: 160, commissionPct: 20, platformFees: 20, shippingFees: 0, gst: 43, tcs: 8, netPayout: 568 },
];

const channels = ['All Channels', 'Amazon', 'Flipkart', 'Meesho', 'Shopify', 'Website', 'Manual', 'FirstCry', 'Blinkit'];

export default function PricePayout() {
  const { toast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState('All Channels');

  const filteredData = useMemo(() => {
    if (selectedChannel === 'All Channels') return mockPriceData;
    return mockPriceData.filter(p => p.channel === selectedChannel);
  }, [selectedChannel]);

  const avgMargin = filteredData.length > 0
    ? Math.round(filteredData.reduce((s, p) => s + (p.netPayout / p.marketplacePrice * 100), 0) / filteredData.length)
    : 0;
  const avgCommission = filteredData.length > 0
    ? Math.round(filteredData.reduce((s, p) => s + p.commissionPct, 0) / filteredData.length)
    : 0;
  const totalPayout = filteredData.reduce((s, p) => s + p.netPayout, 0);

  const handleExport = () => {
    const label = selectedChannel === 'All Channels' ? 'All Channels' : selectedChannel;
    toast({ title: 'Export Initiated', description: `Exporting payout data for ${label}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Price & Payout Split</h1>
          <p className="text-muted-foreground">Per-product, per-portal commission and payout breakdown</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sales Channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map(ch => (
                <SelectItem key={ch} value={ch}>{ch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export – {selectedChannel === 'All Channels' ? 'All' : selectedChannel}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><FileSpreadsheet className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{filteredData.length}</p><p className="text-sm text-muted-foreground">Price Entries</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><TrendingUp className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{avgMargin}%</p><p className="text-sm text-muted-foreground">Avg Net Margin</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><IndianRupee className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{avgCommission}%</p><p className="text-sm text-muted-foreground">Avg Commission</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><IndianRupee className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">₹{totalPayout.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Net Payout</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Breakdown per Product per Portal</CardTitle>
          <CardDescription>Marketplace Price → Commission → Fees → GST → TCS → Net Payout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Channel</TableHead>
                  <TableHead className="text-right font-semibold">MRP</TableHead>
                  <TableHead className="text-right font-semibold">Commission</TableHead>
                  <TableHead className="text-right font-semibold">Platform Fee</TableHead>
                  <TableHead className="text-right font-semibold">Shipping</TableHead>
                  <TableHead className="text-right font-semibold">GST</TableHead>
                  <TableHead className="text-right font-semibold">TCS</TableHead>
                  <TableHead className="text-right font-semibold bg-primary/10 text-primary">Net Payout</TableHead>
                  <TableHead className="text-right font-semibold">Margin %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, i) => {
                  const margin = Math.round((row.netPayout / row.marketplacePrice) * 100);
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{row.productName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{row.productId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">{row.portalIcon} {row.portal}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{row.marketplacePrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-rose-600">-₹{row.commission}</span>
                        <span className="text-xs text-muted-foreground block">{row.commissionPct}%</span>
                      </TableCell>
                      <TableCell className="text-right text-rose-600">-₹{row.platformFees}</TableCell>
                      <TableCell className="text-right text-rose-600">-₹{row.shippingFees}</TableCell>
                      <TableCell className="text-right text-rose-600">-₹{row.gst}</TableCell>
                      <TableCell className="text-right text-rose-600">-₹{row.tcs}</TableCell>
                      <TableCell className="text-right bg-primary/5 font-bold text-primary">₹{row.netPayout.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={margin >= 75 ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : margin >= 60 ? 'bg-blue-500/15 text-blue-600 border-blue-500/30' : 'bg-amber-500/15 text-amber-600 border-amber-500/30'}>
                          {margin}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No payout data for selected channel</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
