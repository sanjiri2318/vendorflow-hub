import { useState, useMemo } from 'react';
import { mockOrders, portalConfigs } from '@/services/mockData';
import { Portal, Order, OrderStatus } from '@/types';
import { PortalFilter } from '@/components/dashboard/PortalFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Search, Download, ShoppingCart, Package, Truck, CheckCircle, Clock,
  X, Eye, Users, UserPlus, UserCheck, Star, Layers,
} from 'lucide-react';
import { DateFilter, ExportButton, useRowSelection, SelectAllCheckbox, RowCheckbox } from '@/components/TableEnhancements';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-info/10 text-info', icon: CheckCircle },
  packed: { label: 'Packed', color: 'bg-accent/10 text-accent', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-primary/10 text-primary', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-success/10 text-success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive', icon: X },
  returned: { label: 'Returned', color: 'bg-muted text-muted-foreground', icon: Package },
};

// Compute customer intelligence from orders
function computeCustomerProfiles(orders: Order[]) {
  const map: Record<string, { name: string; phone: string; email: string; orderCount: number; totalSpend: number; lastOrderDate: string }> = {};
  orders.forEach(o => {
    if (!map[o.customerId]) {
      map[o.customerId] = { name: o.customerName, phone: o.customerPhone, email: o.customerEmail, orderCount: 0, totalSpend: 0, lastOrderDate: o.orderDate };
    }
    map[o.customerId].orderCount++;
    map[o.customerId].totalSpend += o.totalAmount;
    if (new Date(o.orderDate) > new Date(map[o.customerId].lastOrderDate)) {
      map[o.customerId].lastOrderDate = o.orderDate;
    }
  });
  return map;
}

type CustomerTypeFilter = 'all' | 'new' | 'repeat' | 'high_value';

export default function Orders() {
  const [selectedPortal, setSelectedPortal] = useState<Portal | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<CustomerTypeFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('30days');

  const customerProfiles = useMemo(() => computeCustomerProfiles(mockOrders), []);

  const getCustomerType = (customerId: string): 'new' | 'repeat' => {
    return (customerProfiles[customerId]?.orderCount ?? 0) > 1 ? 'repeat' : 'new';
  };

  const isHighValue = (customerId: string) => (customerProfiles[customerId]?.totalSpend ?? 0) >= 7000;

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesPortal = selectedPortal === 'all' || order.portal === selectedPortal;
      const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.portalOrderId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const custType = getCustomerType(order.customerId);
      const matchesCustomerType = customerTypeFilter === 'all' ||
        (customerTypeFilter === 'new' && custType === 'new') ||
        (customerTypeFilter === 'repeat' && custType === 'repeat') ||
        (customerTypeFilter === 'high_value' && isHighValue(order.customerId));
      
      return matchesPortal && matchesSearch && matchesStatus && matchesCustomerType;
    });
  }, [selectedPortal, searchQuery, statusFilter, customerTypeFilter, customerProfiles]);

  const rowSelection = useRowSelection(filteredOrders.map(o => o.orderId));

  const stats = useMemo(() => {
    const orders = selectedPortal === 'all' ? mockOrders : mockOrders.filter(o => o.portal === selectedPortal);
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  }, [selectedPortal]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const exportLabel = useMemo(() => {
    const parts = ['Export'];
    if (customerTypeFilter !== 'all') {
      const labels: Record<string, string> = { new: 'New Customers', repeat: 'Repeat Customers', high_value: 'High Value' };
      parts.push(labels[customerTypeFilter]);
    }
    parts.push('Orders');
    return parts.join(' ');
  }, [customerTypeFilter]);

  const selectedProfile = selectedCustomerId ? customerProfiles[selectedCustomerId] : null;

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground">Manage orders across all sales channels</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton label={rowSelection.count > 0 ? undefined : exportLabel} selectedCount={rowSelection.count} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Truck className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <PortalFilter selectedPortal={selectedPortal} onPortalChange={setSelectedPortal} />
              
              <div className="flex flex-1 flex-wrap gap-3">
                <DateFilter value={dateFilter} onChange={setDateFilter} />
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Order ID or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={customerTypeFilter} onValueChange={(v) => setCustomerTypeFilter(v as CustomerTypeFilter)}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Customer Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers</SelectItem>
                    <SelectItem value="repeat">Repeat Customers</SelectItem>
                    <SelectItem value="high_value">High Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10"><SelectAllCheckbox checked={rowSelection.isAllSelected} onCheckedChange={rowSelection.toggleAll} /></TableHead>
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Portal</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Customer Type</TableHead>
                    <TableHead className="font-semibold">Order Type</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const portal = portalConfigs.find(p => p.id === order.portal);
                    const StatusIcon = status.icon;
                    const isMulti = order.items.length > 1;
                    const custType = getCustomerType(order.customerId);
                    const totalSkus = order.items.reduce((s, i) => s + i.quantity, 0);
                    
                      return (
                        <TableRow key={order.orderId} className={`hover:bg-muted/30 ${rowSelection.isSelected(order.orderId) ? 'bg-primary/5' : ''}`}>
                          <TableCell><RowCheckbox checked={rowSelection.isSelected(order.orderId)} onCheckedChange={() => rowSelection.toggle(order.orderId)} /></TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.orderId}</p>
                            <p className="text-xs text-muted-foreground">{order.portalOrderId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {portal?.icon} {portal?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <button
                              className="font-medium text-primary hover:underline cursor-pointer text-left"
                              onClick={() => setSelectedCustomerId(order.customerId)}
                            >
                              {order.customerName}
                            </button>
                            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {custType === 'repeat' ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600">
                                  <UserCheck className="w-3 h-3" />
                                  Repeat
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>Customer has placed orders before</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600">
                              <UserPlus className="w-3 h-3" />
                              New
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isMulti ? (
                            <div className="flex items-center gap-1.5">
                              <Badge variant="secondary" className="gap-1 bg-purple-500/10 text-purple-600">
                                <Layers className="w-3 h-3" />
                                Multi-SKU
                              </Badge>
                              <span className="text-xs text-muted-foreground">({order.items.length} SKUs)</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Single Item</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`gap-1 ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Order Details - {selectedOrder?.orderId}
                {selectedOrder && selectedOrder.items.length > 1 && (
                  <Badge variant="secondary" className="gap-1 bg-purple-500/10 text-purple-600">
                    <Layers className="w-3 h-3" />
                    Multi-SKU ({selectedOrder.items.length})
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Portal Order ID</p>
                    <p className="font-medium">{selectedOrder.portalOrderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Portal</p>
                    <Badge variant="outline" className="gap-1 mt-1">
                      {portalConfigs.find(p => p.id === selectedOrder.portal)?.icon}{' '}
                      {portalConfigs.find(p => p.id === selectedOrder.portal)?.name}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-bold text-lg">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Shipping Address</p>
                      <p className="font-medium">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items - Enhanced SKU Table */}
                <div>
                  <h4 className="font-semibold mb-3">Order Items ({selectedOrder.items.length} SKU{selectedOrder.items.length > 1 ? 's' : ''})</h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold text-xs">SKU ID</TableHead>
                          <TableHead className="font-semibold text-xs">Product</TableHead>
                          <TableHead className="font-semibold text-xs">Brand</TableHead>
                          <TableHead className="font-semibold text-xs text-center">Qty</TableHead>
                          <TableHead className="font-semibold text-xs text-right">Price</TableHead>
                          <TableHead className="font-semibold text-xs text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-xs font-mono">{item.skuId}</TableCell>
                            <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">{item.brand}</Badge>
                            </TableCell>
                            <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right font-medium text-sm">{formatCurrency(item.price * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h4 className="font-semibold mb-3">Status Timeline</h4>
                  <div className="space-y-3">
                    {selectedOrder.statusTimeline.map((event, index) => {
                      const config = statusConfig[event.status];
                      const Icon = config.icon;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full ${config.color}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{config.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString('en-IN')}
                              </p>
                            </div>
                            {event.note && (
                              <p className="text-sm text-muted-foreground">{event.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Customer Profile Modal */}
        <Dialog open={!!selectedCustomerId} onOpenChange={() => setSelectedCustomerId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Profile
              </DialogTitle>
            </DialogHeader>
            {selectedProfile && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {selectedProfile.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedProfile.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProfile.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProfile.orderCount > 1 && (
                    <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600">
                      <UserCheck className="w-3 h-3" />
                      Repeat Customer
                    </Badge>
                  )}
                  {isHighValue(selectedCustomerId!) && (
                    <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600">
                      <Star className="w-3 h-3" />
                      High Value Customer
                    </Badge>
                  )}
                  {selectedProfile.orderCount >= 3 && (
                    <Badge variant="secondary" className="gap-1 bg-purple-500/10 text-purple-600">
                      <ShoppingCart className="w-3 h-3" />
                      Frequent Buyer
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedProfile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="font-bold text-lg">{selectedProfile.orderCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spend</p>
                    <p className="font-bold text-lg">{formatCurrency(selectedProfile.totalSpend)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Order</p>
                    <p className="font-medium">{formatDate(selectedProfile.lastOrderDate)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
