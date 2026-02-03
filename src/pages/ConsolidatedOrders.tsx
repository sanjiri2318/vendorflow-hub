import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { mockConsolidatedOrders, portalConfigs } from '@/services/mockData';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConsolidatedOrders() {
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consolidated Orders</h1>
          <p className="text-muted-foreground">Single sheet view of orders across all portals</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
      </div>

      {/* Consolidated Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary by SKU</CardTitle>
          <CardDescription>Order quantities across all sales channels</CardDescription>
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
                {mockConsolidatedOrders.map((row) => (
                  <TableRow key={row.skuId}>
                    <TableCell className="font-medium">{row.skuName}</TableCell>
                    <TableCell className="text-center">
                      {row.amazon > 0 ? (
                        <span className="font-medium">{row.amazon}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.flipkart > 0 ? (
                        <span className="font-medium">{row.flipkart}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.meesho > 0 ? (
                        <span className="font-medium">{row.meesho}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.firstcry > 0 ? (
                        <span className="font-medium">{row.firstcry}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.blinkit > 0 ? (
                        <span className="font-medium">{row.blinkit}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.own_website > 0 ? (
                        <span className="font-medium">{row.own_website}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center bg-primary/5">
                      <span className="font-bold text-primary">{row.total}</span>
                    </TableCell>
                  </TableRow>
                ))}
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
