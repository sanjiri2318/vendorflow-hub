import { useState, useMemo } from 'react';
import { mockInventory, portalConfigs } from '@/services/mockData';
import { Portal } from '@/types';
import { PortalFilter } from '@/components/dashboard/PortalFilter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertTriangle, Package, Upload } from 'lucide-react';
import { DateFilter, ExportButton, useRowSelection, SelectAllCheckbox, RowCheckbox, ImportModal } from '@/components/TableEnhancements';

const allBrands = Array.from(new Set(mockInventory.map(i => i.brand))).sort();

export default function Inventory() {
  const [selectedPortal, setSelectedPortal] = useState<Portal | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('30days');
  const [importOpen, setImportOpen] = useState(false);

  const warehouses = useMemo(() => {
    const unique = new Set(mockInventory.map(i => i.warehouse));
    return Array.from(unique);
  }, []);

  const filteredInventory = useMemo(() => {
    return mockInventory.filter(item => {
      const matchesPortal = selectedPortal === 'all' || item.portal === selectedPortal;
      const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.skuId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'low' && item.availableStock <= item.lowStockThreshold) ||
                          (stockFilter === 'healthy' && item.availableStock > item.lowStockThreshold);
      const matchesBrand = brandFilter === 'all' || item.brand === brandFilter;
      return matchesPortal && matchesSearch && matchesWarehouse && matchesStock && matchesBrand;
    });
  }, [selectedPortal, searchQuery, warehouseFilter, stockFilter, brandFilter]);

  const rowSelection = useRowSelection(filteredInventory.map(i => i.skuId));

  const stats = useMemo(() => {
    const items = selectedPortal === 'all' ? mockInventory : mockInventory.filter(i => i.portal === selectedPortal);
    return {
      totalSKUs: items.length,
      totalStock: items.reduce((sum, i) => sum + i.availableStock, 0),
      lowStock: items.filter(i => i.availableStock <= i.lowStockThreshold).length,
      aging: items.filter(i => i.agingDays > 60).length,
    };
  }, [selectedPortal]);

  const getStockStatus = (available: number, threshold: number) => {
    if (available === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (available <= threshold) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'Healthy', variant: 'success' as const };
  };

  const dateLabel = dateFilter === 'today' ? 'Today' : dateFilter === '7days' ? 'Last 7 Days' : dateFilter === '30days' ? 'Last 30 Days' : dateFilter === 'this_month' ? 'This Month' : dateFilter === 'this_year' ? 'This Year' : 'Custom';
  const exportLabel = brandFilter !== 'all'
    ? `Export – ${brandFilter} Inventory`
    : rowSelection.count > 0 ? undefined : `Export – ${dateLabel}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels across all portals and warehouses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setImportOpen(true)}>
            <Upload className="w-4 h-4" />
            Import Inventory
          </Button>
          <ExportButton label={exportLabel} selectedCount={rowSelection.count} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><Package className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{stats.totalSKUs}</p><p className="text-sm text-muted-foreground">Total SKUs</p></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><Package className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Units</p></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><AlertTriangle className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{stats.lowStock}</p><p className="text-sm text-muted-foreground">Low Stock</p></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-rose-500/10"><AlertTriangle className="w-5 h-5 text-rose-600" /></div><div><p className="text-2xl font-bold">{stats.aging}</p><p className="text-sm text-muted-foreground">Aging (&gt;60d)</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <PortalFilter selectedPortal={selectedPortal} onPortalChange={setSelectedPortal} />
            <div className="flex flex-1 flex-wrap gap-3">
              <DateFilter value={dateFilter} onChange={setDateFilter} />
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by SKU or product name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouses.map(wh => (<SelectItem key={wh} value={wh}>{wh}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Brand" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {allBrands.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Stock Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10"><SelectAllCheckbox checked={rowSelection.isAllSelected} onCheckedChange={rowSelection.toggleAll} /></TableHead>
                  <TableHead className="font-semibold">SKU ID</TableHead>
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">Brand</TableHead>
                  <TableHead className="font-semibold">Portal</TableHead>
                  <TableHead className="font-semibold text-center">Available</TableHead>
                  <TableHead className="font-semibold text-center">Reserved</TableHead>
                  <TableHead className="font-semibold">Warehouse</TableHead>
                  <TableHead className="font-semibold text-center">Aging</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item.availableStock, item.lowStockThreshold);
                  const portal = portalConfigs.find(p => p.id === item.portal);
                  return (
                    <TableRow key={item.skuId} className={`hover:bg-muted/30 ${rowSelection.isSelected(item.skuId) ? 'bg-primary/5' : ''}`}>
                      <TableCell><RowCheckbox checked={rowSelection.isSelected(item.skuId)} onCheckedChange={() => rowSelection.toggle(item.skuId)} /></TableCell>
                      <TableCell className="font-mono text-sm">{item.skuId}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.productName}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{item.brand}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="gap-1">{portal?.icon} {portal?.name}</Badge></TableCell>
                      <TableCell className="text-center"><span className={`font-semibold ${item.availableStock <= item.lowStockThreshold ? 'text-amber-600' : 'text-foreground'}`}>{item.availableStock}</span></TableCell>
                      <TableCell className="text-center text-muted-foreground">{item.reservedStock}</TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={`${item.agingDays > 90 ? 'bg-rose-500/10 text-rose-600' : item.agingDays > 60 ? 'bg-amber-500/10 text-amber-600' : ''}`}>{item.agingDays}d</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${status.variant === 'destructive' ? 'bg-rose-500/10 text-rose-600' : status.variant === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No inventory items found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ImportModal open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
