import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockProducts, portalConfigs } from '@/services/mockData';
import { IndianRupee, TrendingUp } from 'lucide-react';

interface PriceBreakdown {
  productName: string;
  productId: string;
  portal: string;
  portalIcon: string;
  marketplacePrice: number;
  commission: number;
  commissionPct: number;
  platformFees: number;
  shippingFees: number;
  gst: number;
  netPayout: number;
}

const mockPriceData: PriceBreakdown[] = [
  { productName: 'Premium Wireless Earbuds Pro', productId: 'PROD-001', portal: 'Amazon', portalIcon: '🛒', marketplacePrice: 2999, commission: 450, commissionPct: 15, platformFees: 45, shippingFees: 60, gst: 162, netPayout: 2282 },
  { productName: 'Premium Wireless Earbuds Pro', productId: 'PROD-001', portal: 'Flipkart', portalIcon: '🛍️', marketplacePrice: 2999, commission: 390, commissionPct: 13, platformFees: 50, shippingFees: 55, gst: 162, netPayout: 2342 },
  { productName: 'Premium Wireless Earbuds Pro', productId: 'PROD-001', portal: 'Own Website', portalIcon: '🌐', marketplacePrice: 2999, commission: 0, commissionPct: 0, platformFees: 75, shippingFees: 80, gst: 162, netPayout: 2682 },
  { productName: 'Smart Fitness Watch X2', productId: 'PROD-002', portal: 'Amazon', portalIcon: '🛒', marketplacePrice: 4999, commission: 750, commissionPct: 15, platformFees: 75, shippingFees: 60, gst: 270, netPayout: 3844 },
  { productName: 'Smart Fitness Watch X2', productId: 'PROD-002', portal: 'Meesho', portalIcon: '📦', marketplacePrice: 4999, commission: 600, commissionPct: 12, platformFees: 40, shippingFees: 65, gst: 270, netPayout: 4024 },
  { productName: 'Organic Cotton T-Shirt', productId: 'PROD-003', portal: 'Amazon', portalIcon: '🛒', marketplacePrice: 599, commission: 120, commissionPct: 20, platformFees: 15, shippingFees: 50, gst: 32, netPayout: 382 },
  { productName: 'Organic Cotton T-Shirt', productId: 'PROD-003', portal: 'Flipkart', portalIcon: '🛍️', marketplacePrice: 599, commission: 108, commissionPct: 18, platformFees: 18, shippingFees: 45, gst: 32, netPayout: 396 },
  { productName: 'Baby Care Gift Set', productId: 'PROD-005', portal: 'FirstCry', portalIcon: '👶', marketplacePrice: 1299, commission: 195, commissionPct: 15, platformFees: 25, shippingFees: 55, gst: 70, netPayout: 954 },
  { productName: 'Baby Care Gift Set', productId: 'PROD-005', portal: 'Own Website', portalIcon: '🌐', marketplacePrice: 1299, commission: 0, commissionPct: 0, platformFees: 35, shippingFees: 60, gst: 70, netPayout: 1134 },
  { productName: 'Stainless Steel Water Bottle', productId: 'PROD-004', portal: 'Blinkit', portalIcon: '⚡', marketplacePrice: 799, commission: 160, commissionPct: 20, platformFees: 20, shippingFees: 0, gst: 43, netPayout: 576 },
];

export default function PricePayout() {
  const avgMargin = Math.round(mockPriceData.reduce((s, p) => s + (p.netPayout / p.marketplacePrice * 100), 0) / mockPriceData.length);
  const avgCommission = Math.round(mockPriceData.reduce((s, p) => s + p.commissionPct, 0) / mockPriceData.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Price & Payout Split</h1>
        <p className="text-muted-foreground">Per-product, per-portal commission and payout breakdown</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><IndianRupee className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{mockPriceData.length}</p><p className="text-sm text-muted-foreground">Price Entries</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><TrendingUp className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{avgMargin}%</p><p className="text-sm text-muted-foreground">Avg Net Margin</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><IndianRupee className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{avgCommission}%</p><p className="text-sm text-muted-foreground">Avg Commission</p></div></div></CardContent></Card>
        <Card className="bg-primary/5 border-primary/20"><CardContent className="pt-6"><div className="text-center"><p className="text-3xl font-bold text-primary">Best: 🌐</p><p className="text-sm text-muted-foreground">Own Website (0% comm.)</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Breakdown per Product per Portal</CardTitle>
          <CardDescription>Marketplace price → Commission → Fees → GST → Net Payout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Portal</TableHead>
                  <TableHead className="text-right font-semibold">MRP</TableHead>
                  <TableHead className="text-right font-semibold">Commission</TableHead>
                  <TableHead className="text-right font-semibold">Platform Fee</TableHead>
                  <TableHead className="text-right font-semibold">Shipping</TableHead>
                  <TableHead className="text-right font-semibold">GST</TableHead>
                  <TableHead className="text-right font-semibold bg-primary/10 text-primary">Net Payout</TableHead>
                  <TableHead className="text-right font-semibold">Margin %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPriceData.map((row, i) => {
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
        </CardContent>
      </Card>
    </div>
  );
}
