import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOrderReconciliation } from '@/services/mockData';
import { CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function Reconciliation() {
  const matchedCount = mockOrderReconciliation.filter((r) => r.status === 'matched').length;
  const mismatchCount = mockOrderReconciliation.filter((r) => r.status === 'mismatch').length;
  const totalExpected = mockOrderReconciliation.reduce((sum, r) => sum + r.expectedOrders, 0);
  const totalProcessed = mockOrderReconciliation.reduce((sum, r) => sum + r.processedOrders, 0);
  const totalDifference = mockOrderReconciliation.reduce((sum, r) => sum + r.difference, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order Reconciliation</h1>
        <p className="text-muted-foreground">Track expected vs processed orders across all portals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOrderReconciliation.length}</p>
                <p className="text-sm text-muted-foreground">Days Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{matchedCount}</p>
                <p className="text-sm text-muted-foreground">Matched</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mismatchCount}</p>
                <p className="text-sm text-muted-foreground">Mismatches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExpected}</p>
                <p className="text-sm text-muted-foreground">Expected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <TrendingDown className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600">-{totalDifference}</p>
                <p className="text-sm text-muted-foreground">Total Gap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Reconciliation Report</CardTitle>
          <CardDescription>Compare expected orders from portals vs processed orders in VMS</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Expected Orders</TableHead>
                <TableHead className="text-center">Processed Orders</TableHead>
                <TableHead className="text-center">Difference</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrderReconciliation.map((record, index) => (
                <TableRow 
                  key={index}
                  className={record.status === 'mismatch' ? 'bg-amber-500/5' : ''}
                >
                  <TableCell className="font-medium">
                    {format(new Date(record.date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="text-center font-medium">{record.expectedOrders}</TableCell>
                  <TableCell className="text-center font-medium">{record.processedOrders}</TableCell>
                  <TableCell className="text-center">
                    {record.difference === 0 ? (
                      <span className="text-muted-foreground">0</span>
                    ) : (
                      <span className="font-medium text-rose-600">-{record.difference}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.status === 'matched' ? (
                      <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Matched
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30 gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Mismatch
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-bold border-t-2">
                <TableCell>Total (7 Days)</TableCell>
                <TableCell className="text-center">{totalExpected}</TableCell>
                <TableCell className="text-center">{totalProcessed}</TableCell>
                <TableCell className="text-center text-rose-600">-{totalDifference}</TableCell>
                <TableCell className="text-center">
                  <span className="text-muted-foreground text-sm">
                    {((totalProcessed / totalExpected) * 100).toFixed(1)}% accuracy
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
