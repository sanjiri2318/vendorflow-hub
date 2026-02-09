import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockConsolidatedOrders, portalConfigs } from '@/services/mockData';
import { Download, FileSpreadsheet, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'quarter', label: 'This Quarter' },
];

export default function ConsolidatedOrders() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('7days');

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Your consolidated orders report is being prepared for download.',
    });
  };

  const totalOrders = mockConsolidatedOrders.reduce((sum, row) => sum + row.total, 0);
  const portalTotals = {
    amazon: mockConsolidatedOrders.reduce((sum, row) => sum + row.amazon, 0),
    flipkart: mockConsolidatedOrders.reduce((sum, row) => sum + row.flipkart, 0),
    meesho: mockConsolidatedOrders.reduce((sum, row) => sum + row.meesho, 0),
    firstcry: mockConsolidatedOrders.reduce((sum, row) => sum + row.firstcry, 0),
    blinkit: mockConsolidatedOrders.reduce((sum, row) => sum + row.blinkit, 0),
    own_website: mockConsolidatedOrders.reduce((sum, row) => sum + row.own_website, 0),
  };

  const highVolumeThreshold = 80;
  const topSku = mockConsolidatedOrders.reduce((max, row) => row.total > max.total ? row : max, mockConsolidatedOrders[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consolidated Orders</h1>
          <p className="text-muted-foreground">Command center — single sheet view across all portals</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] gap-2">
              <Calendar className="w-4 h-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map(dr => (
                <SelectItem key={dr.value} value={dr.value}>{dr.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {portalConfigs.map((portal) => (
          <Card key={portal.id}>
            <CardContent className="pt-4 pb-3">
              <div className="text-center">
                <span className="text-2xl">{portal.icon}</span>
                <p className="text-lg font-bold mt-1">{portalTotals[portal.id as keyof typeof portalTotals]}</p>
                <p className="text-xs text-muted-foreground">{portal.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4 pb-3">
            <div className="text-center">
              <FileSpreadsheet className="w-6 h-6 mx-auto text-primary" />
              <p className="text-lg font-bold mt-1 text-primary">{totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-emerald-600" />
              <p className="text-lg font-bold mt-1 text-emerald-600">{topSku.skuName.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-xs text-muted-foreground">Top SKU ({topSku.total})</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consolidated Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary by SKU</CardTitle>
          <CardDescription>Order quantities across all sales channels • High-volume SKUs (&gt;{highVolumeThreshold}) are highlighted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">SKU Name</TableHead>
                  <TableHead className="text-center font-semibold">🛒 Amazon</TableHead>
                  <TableHead className="text-center font-semibold">🛍️ Flipkart</TableHead>
                  <TableHead className="text-center font-semibold">📦 Meesho</TableHead>
                  <TableHead className="text-center font-semibold">👶 FirstCry</TableHead>
                  <TableHead className="text-center font-semibold">⚡ Blinkit</TableHead>
                  <TableHead className="text-center font-semibold">🌐 Own Website</TableHead>
                  <TableHead className="text-center font-semibold bg-primary/10 text-primary">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockConsolidatedOrders.map((row) => {
                  const isHighVolume = row.total >= highVolumeThreshold;
                  return (
                    <TableRow key={row.skuId} className={isHighVolume ? 'bg-emerald-500/5' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {row.skuName}
                          {isHighVolume && (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                      </TableCell>
                      {(['amazon', 'flipkart', 'meesho', 'firstcry', 'blinkit', 'own_website'] as const).map(portal => (
                        <TableCell key={portal} className="text-center">
                          {row[portal] > 0 ? (
                            <span className={`font-medium ${row[portal] >= 50 ? 'text-emerald-600' : ''}`}>
                              {row[portal]}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-center bg-primary/5">
                        <span className={`font-bold ${isHighVolume ? 'text-emerald-600' : 'text-primary'}`}>
                          {row.total}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Totals Row */}
                <TableRow className="bg-muted/50 font-bold border-t-2">
                  <TableCell>Total Orders</TableCell>
                  <TableCell className="text-center">{portalTotals.amazon}</TableCell>
                  <TableCell className="text-center">{portalTotals.flipkart}</TableCell>
                  <TableCell className="text-center">{portalTotals.meesho}</TableCell>
                  <TableCell className="text-center">{portalTotals.firstcry}</TableCell>
                  <TableCell className="text-center">{portalTotals.blinkit}</TableCell>
                  <TableCell className="text-center">{portalTotals.own_website}</TableCell>
                  <TableCell className="text-center bg-primary/10 text-primary">{totalOrders}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
