import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSKUMappings } from '@/services/mockData';
import { MasterSKUMapping, SKUMappingStatus } from '@/types';
import { Plus, Edit2, Link, Unlink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SKUMapping() {
  const [mappings, setMappings] = useState<MasterSKUMapping[]>(mockSKUMappings);
  const [filterStatus, setFilterStatus] = useState<SKUMappingStatus | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<MasterSKUMapping | null>(null);
  const { toast } = useToast();

  const filteredMappings = mappings.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const handleAddMapping = () => {
    toast({
      title: 'Mapping Added',
      description: 'New SKU mapping has been created successfully.',
    });
    setIsAddDialogOpen(false);
  };

  const handleEditMapping = () => {
    toast({
      title: 'Mapping Updated',
      description: 'SKU mapping has been updated successfully.',
    });
    setEditingMapping(null);
  };

  const getMappedCount = (mapping: MasterSKUMapping) => {
    let count = 0;
    if (mapping.amazonSku) count++;
    if (mapping.flipkartSku) count++;
    if (mapping.meeshoSku) count++;
    if (mapping.firstcrySku) count++;
    if (mapping.blinkitSku) count++;
    if (mapping.ownWebsiteSku) count++;
    return count;
  };

  const mappedCount = mappings.filter((m) => m.status === 'mapped').length;
  const unmappedCount = mappings.filter((m) => m.status === 'unmapped').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SKU Mapping</h1>
          <p className="text-muted-foreground">Map multiple marketplace SKUs to a single internal SKU</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as SKUMappingStatus | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="mapped">Mapped</SelectItem>
              <SelectItem value="unmapped">Unmapped</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Mapping
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add SKU Mapping</DialogTitle>
                <DialogDescription>Map portal-specific SKUs to a master internal SKU</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Master SKU ID</Label>
                    <Input placeholder="MSK-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input placeholder="Product name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🛒 Amazon SKU</Label>
                    <Input placeholder="SKU-AMZ-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>🛍️ Flipkart SKU</Label>
                    <Input placeholder="SKU-FLK-XXX" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>📦 Meesho SKU</Label>
                    <Input placeholder="SKU-MSH-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>👶 FirstCry SKU</Label>
                    <Input placeholder="SKU-FCY-XXX" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>⚡ Blinkit SKU</Label>
                    <Input placeholder="SKU-BLK-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>🌐 Own Website SKU</Label>
                    <Input placeholder="SKU-OWN-XXX" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMapping}>Create Mapping</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Link className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mappings.length}</p>
                <p className="text-sm text-muted-foreground">Total SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Link className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mappedCount}</p>
                <p className="text-sm text-muted-foreground">Mapped</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Unlink className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unmappedCount}</p>
                <p className="text-sm text-muted-foreground">Unmapped</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>SKU Mapping List</CardTitle>
          <CardDescription>View and manage portal SKU mappings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Master SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-center">🛒 Amazon</TableHead>
                <TableHead className="text-center">🛍️ Flipkart</TableHead>
                <TableHead className="text-center">📦 Meesho</TableHead>
                <TableHead className="text-center">👶 FirstCry</TableHead>
                <TableHead className="text-center">⚡ Blinkit</TableHead>
                <TableHead className="text-center">🌐 Own Web</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.masterSkuId}>
                  <TableCell className="font-mono text-sm font-medium">{mapping.masterSkuId}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{mapping.productName}</TableCell>
                  <TableCell className="text-center">
                    {mapping.amazonSku ? (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{mapping.amazonSku}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {mapping.flipkartSku ? (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{mapping.flipkartSku}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {mapping.meeshoSku ? (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{mapping.meeshoSku}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {mapping.firstcrySku ? (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{mapping.firstcrySku}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {mapping.blinkitSku ? (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{mapping.blinkitSku}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {mapping.ownWebsiteSku ? (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{mapping.ownWebsiteSku}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        mapping.status === 'mapped'
                          ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                      }
                    >
                      {mapping.status === 'mapped' ? 'Mapped' : 'Unmapped'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={editingMapping?.masterSkuId === mapping.masterSkuId} onOpenChange={(open) => !open && setEditingMapping(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingMapping(mapping)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit SKU Mapping</DialogTitle>
                          <DialogDescription>Update portal-specific SKUs for {mapping.productName}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Master SKU ID</Label>
                              <Input value={mapping.masterSkuId} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Product Name</Label>
                              <Input defaultValue={mapping.productName} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>🛒 Amazon SKU</Label>
                              <Input defaultValue={mapping.amazonSku || ''} placeholder="SKU-AMZ-XXX" />
                            </div>
                            <div className="space-y-2">
                              <Label>🛍️ Flipkart SKU</Label>
                              <Input defaultValue={mapping.flipkartSku || ''} placeholder="SKU-FLK-XXX" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>📦 Meesho SKU</Label>
                              <Input defaultValue={mapping.meeshoSku || ''} placeholder="SKU-MSH-XXX" />
                            </div>
                            <div className="space-y-2">
                              <Label>👶 FirstCry SKU</Label>
                              <Input defaultValue={mapping.firstcrySku || ''} placeholder="SKU-FCY-XXX" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>⚡ Blinkit SKU</Label>
                              <Input defaultValue={mapping.blinkitSku || ''} placeholder="SKU-BLK-XXX" />
                            </div>
                            <div className="space-y-2">
                              <Label>🌐 Own Website SKU</Label>
                              <Input defaultValue={mapping.ownWebsiteSku || ''} placeholder="SKU-OWN-XXX" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingMapping(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditMapping}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
