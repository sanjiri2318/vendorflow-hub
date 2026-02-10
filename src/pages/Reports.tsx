import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Clock, ShoppingCart, Package, BarChart3, Upload, UserCheck, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const daysAgo = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString(); };

const mockReports = [
  { id: 'RPT-001', name: 'Sales Summary - January 2026', type: 'Sales', format: 'Excel', generatedAt: daysAgo(3), size: '1.2 MB' },
  { id: 'RPT-002', name: 'Inventory Snapshot - Week 5', type: 'Inventory', format: 'PDF', generatedAt: daysAgo(5), size: '845 KB' },
  { id: 'RPT-003', name: 'Order Reconciliation - Jan 2026', type: 'Orders', format: 'Excel', generatedAt: daysAgo(7), size: '2.1 MB' },
  { id: 'RPT-004', name: 'Returns Analysis - Q4 2025', type: 'Returns', format: 'PDF', generatedAt: daysAgo(12), size: '1.5 MB' },
  { id: 'RPT-005', name: 'Portal-wise Revenue - Jan 2026', type: 'Sales', format: 'Excel', generatedAt: daysAgo(2), size: '980 KB' },
];

const mockHistory = [
  { id: 1, action: 'Product Added', user: 'Sarah Johnson', role: 'Admin', detail: 'Added "LED Desk Lamp" to catalog', timestamp: daysAgo(0) },
  { id: 2, action: 'Excel Upload', user: 'Emily Davis', role: 'Operations', detail: 'Uploaded inventory_update_jan.xlsx (342 rows)', timestamp: daysAgo(0) },
  { id: 3, action: 'Order Status Changed', user: 'System', role: 'System', detail: 'ORD-2024-003 status → Packed', timestamp: daysAgo(0) },
  { id: 4, action: 'SKU Mapped', user: 'Michael Chen', role: 'Vendor', detail: 'Mapped MSK-001 → SKU-FLK-001 (Flipkart)', timestamp: daysAgo(1) },
  { id: 5, action: 'Return Approved', user: 'Emily Davis', role: 'Operations', detail: 'RET-2024-002 approved for refund ₹799', timestamp: daysAgo(1) },
  { id: 6, action: 'Settlement Completed', user: 'System', role: 'System', detail: 'SET-AMZ-2024-01 — ₹3,97,700 credited', timestamp: daysAgo(2) },
  { id: 7, action: 'Vendor Onboarded', user: 'Sarah Johnson', role: 'Admin', detail: 'BabyCare Essentials (VEN-003) activated', timestamp: daysAgo(3) },
  { id: 8, action: 'Product Deactivated', user: 'Michael Chen', role: 'Vendor', detail: 'Yoga Mat Premium set to inactive', timestamp: daysAgo(4) },
  { id: 9, action: 'Alert Resolved', user: 'Emily Davis', role: 'Operations', detail: 'Low stock alert for SKU-BLK-004 resolved', timestamp: daysAgo(5) },
  { id: 10, action: 'Report Generated', user: 'Sarah Johnson', role: 'Admin', detail: 'Sales Summary - January 2026', timestamp: daysAgo(5) },
];

const actionIcons: Record<string, React.ElementType> = {
  'Product Added': Package, 'Excel Upload': Upload, 'Order Status Changed': RefreshCw,
  'SKU Mapped': Package, 'Return Approved': RefreshCw, 'Settlement Completed': ShoppingCart,
  'Vendor Onboarded': UserCheck, 'Product Deactivated': Package, 'Alert Resolved': RefreshCw,
  'Report Generated': FileText,
};

export default function Reports() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & History</h1>
        <p className="text-muted-foreground">Access reports and view platform activity log</p>
      </div>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports" className="gap-1.5"><FileText className="w-4 h-4" />Reports</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><Clock className="w-4 h-4" />Activity History</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4 mt-4">
          {/* Quick Generate */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Sales Report', icon: BarChart3, color: 'bg-primary/10 text-primary' },
              { name: 'Inventory Report', icon: Package, color: 'bg-emerald-500/10 text-emerald-600' },
              { name: 'Orders Report', icon: ShoppingCart, color: 'bg-blue-500/10 text-blue-600' },
              { name: 'Returns Report', icon: RefreshCw, color: 'bg-amber-500/10 text-amber-600' },
            ].map(r => (
              <Card key={r.name} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: 'Generating Report', description: `${r.name} is being generated...` })}>
                <CardContent className="pt-6 text-center">
                  <div className={`mx-auto p-3 rounded-xl w-fit mb-3 ${r.color}`}>
                    <r.icon className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <Button variant="ghost" size="sm" className="mt-2 gap-1"><Download className="w-3 h-3" />Generate</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report History */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Report</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Format</TableHead>
                    <TableHead className="font-semibold">Size</TableHead>
                    <TableHead className="font-semibold">Generated</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell><Badge variant="secondary">{r.type}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{r.format}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.size}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(r.generatedAt), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => toast({ title: 'Download Started', description: `Downloading ${r.name}...` })}>
                          <Download className="w-3 h-3" />Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Platform activity and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockHistory.map(item => {
                  const Icon = actionIcons[item.action] || Clock;
                  return (
                    <div key={item.id} className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{item.action}</p>
                          <Badge variant="secondary" className="text-xs">{item.role}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.user} • {format(new Date(item.timestamp), 'dd MMM yyyy, HH:mm')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
