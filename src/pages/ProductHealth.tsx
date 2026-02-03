import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProductHealth, portalConfigs } from '@/services/mockData';
import { ProductHealthStatus, Portal } from '@/types';
import { Activity, CheckCircle2, XCircle, Package } from 'lucide-react';

const statusConfig: Record<ProductHealthStatus, { label: string; icon: React.ElementType; className: string }> = {
  live: { label: 'Live', icon: CheckCircle2, className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  not_active: { label: 'Not Active', icon: XCircle, className: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  out_of_stock: { label: 'Out of Stock', icon: Package, className: 'bg-rose-500/15 text-rose-600 border-rose-500/30' },
};

export default function ProductHealth() {
  const [selectedPortal, setSelectedPortal] = useState<Portal | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProductHealthStatus | 'all'>('all');

  const filteredProducts = mockProductHealth.filter((product) => {
    if (selectedPortal !== 'all' && selectedStatus !== 'all') {
      return product.portalStatus[selectedPortal] === selectedStatus;
    }
    if (selectedStatus !== 'all') {
      return Object.values(product.portalStatus).includes(selectedStatus);
    }
    return true;
  });

  const getStatusBadge = (status: ProductHealthStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.className} gap-1 font-medium`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Calculate summary stats
  const totalProducts = mockProductHealth.length;
  const liveCount = mockProductHealth.filter(p => 
    Object.values(p.portalStatus).some(s => s === 'live')
  ).length;
  const notActiveCount = mockProductHealth.filter(p => 
    Object.values(p.portalStatus).some(s => s === 'not_active')
  ).length;
  const outOfStockCount = mockProductHealth.filter(p => 
    Object.values(p.portalStatus).some(s => s === 'out_of_stock')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Health Check</h1>
          <p className="text-muted-foreground">Monitor product visibility status across all portals</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPortal} onValueChange={(v) => setSelectedPortal(v as Portal | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Portal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Portals</SelectItem>
              {portalConfigs.map((portal) => (
                <SelectItem key={portal.id} value={portal.id}>
                  {portal.icon} {portal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ProductHealthStatus | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="live">🟢 Live</SelectItem>
              <SelectItem value="not_active">🟡 Not Active</SelectItem>
              <SelectItem value="out_of_stock">🔴 Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
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
                <p className="text-2xl font-bold">{liveCount}</p>
                <p className="text-sm text-muted-foreground">Live Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <XCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notActiveCount}</p>
                <p className="text-sm text-muted-foreground">Not Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <Package className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{outOfStockCount}</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Health Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Portal Status</CardTitle>
          <CardDescription>View product visibility across all marketplaces</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                {portalConfigs.map((portal) => (
                  <TableHead key={portal.id} className="text-center">
                    <span className="flex items-center justify-center gap-1">
                      {portal.icon} {portal.name}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-mono text-sm">{product.productId}</TableCell>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  {portalConfigs.map((portal) => (
                    <TableCell key={portal.id} className="text-center">
                      {getStatusBadge(product.portalStatus[portal.id])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
