import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Users, Plus, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PermissionRow {
  feature: string;
  category: string;
  superAdmin: boolean;
  financeManager: boolean;
  operationsManager: boolean;
  vendorUser: boolean;
  analyst: boolean;
}

const initialPermissions: PermissionRow[] = [
  { feature: 'Dashboard Overview', category: 'Overview', superAdmin: true, financeManager: true, operationsManager: true, vendorUser: true, analyst: true },
  { feature: 'Product Catalog', category: 'Catalog', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: true, analyst: false },
  { feature: 'Product Health', category: 'Catalog', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: true, analyst: true },
  { feature: 'SKU Mapping', category: 'Catalog', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: true, analyst: false },
  { feature: 'Inventory Management', category: 'Inventory', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: true, analyst: false },
  { feature: 'Orders', category: 'Inventory', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: true, analyst: true },
  { feature: 'Consolidated Orders', category: 'Inventory', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: false, analyst: true },
  { feature: 'Returns & Claims', category: 'Inventory', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: false, analyst: false },
  { feature: 'Settlements', category: 'Finance', superAdmin: true, financeManager: true, operationsManager: false, vendorUser: true, analyst: true },
  { feature: 'Reconciliation', category: 'Finance', superAdmin: true, financeManager: true, operationsManager: true, vendorUser: false, analyst: true },
  { feature: 'Price & Payout', category: 'Finance', superAdmin: true, financeManager: true, operationsManager: false, vendorUser: true, analyst: true },
  { feature: 'Landing Cost Analysis', category: 'Finance', superAdmin: true, financeManager: true, operationsManager: false, vendorUser: false, analyst: true },
  { feature: 'Vendor Management', category: 'Vendors', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: false, analyst: false },
  { feature: 'Warehouse & Storage', category: 'Vendors', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: false, analyst: false },
  { feature: 'Data Import', category: 'Operations', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: false, analyst: false },
  { feature: 'Task Manager', category: 'Operations', superAdmin: true, financeManager: false, operationsManager: true, vendorUser: false, analyst: false },
  { feature: 'Analytics', category: 'Operations', superAdmin: true, financeManager: true, operationsManager: false, vendorUser: true, analyst: true },
  { feature: 'Social Insights', category: 'Marketing', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: true, analyst: false },
  { feature: 'Reports & History', category: 'Reports', superAdmin: true, financeManager: true, operationsManager: true, vendorUser: true, analyst: true },
  { feature: 'Support Center', category: 'System', superAdmin: true, financeManager: true, operationsManager: true, vendorUser: true, analyst: true },
  { feature: 'Subscription', category: 'System', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: false, analyst: false },
  { feature: 'System Settings', category: 'Admin', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: false, analyst: false },
  { feature: 'AI Hub', category: 'System', superAdmin: true, financeManager: false, operationsManager: false, vendorUser: false, analyst: false },
];

const roles = [
  { key: 'superAdmin' as const, label: 'Super Admin', desc: 'Full system access', color: 'bg-primary/10 text-primary' },
  { key: 'financeManager' as const, label: 'Finance Manager', desc: 'Financial oversight', color: 'bg-emerald-500/10 text-emerald-600' },
  { key: 'operationsManager' as const, label: 'Operations Mgr', desc: 'Operations control', color: 'bg-blue-500/10 text-blue-600' },
  { key: 'vendorUser' as const, label: 'Vendor User', desc: 'Vendor portal access', color: 'bg-amber-500/10 text-amber-600' },
  { key: 'analyst' as const, label: 'Analyst', desc: 'Read-only analytics', color: 'bg-purple-500/10 text-purple-600' },
];

export default function Permissions() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState(initialPermissions);
  const categories = [...new Set(permissions.map(p => p.category))];

  const togglePermission = (idx: number, role: typeof roles[number]['key']) => {
    if (role === 'superAdmin') return;
    setPermissions(prev => prev.map((p, i) => i === idx ? { ...p, [role]: !p[role] } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Permissions & Role-Based Access</h1>
          <p className="text-muted-foreground">Configure module access per role — Role Management</p>
        </div>
        <Button className="gap-2" onClick={() => toast({ title: 'Add Role', description: 'Role creation form would open here.' })}>
          <Plus className="w-4 h-4" />Add Role
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {roles.map(r => (
          <Card key={r.key}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${r.color}`}><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-bold">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {permissions.filter(p => p[r.key]).length}/{permissions.length} features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5" />Permission Matrix</CardTitle>
              <CardDescription>Enable or disable features per role. Super Admin always has full access.</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1"><Shield className="w-3 h-3" />Security-Driven</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Feature</TableHead>
                  {roles.map(r => (
                    <TableHead key={r.key} className="text-center font-semibold text-xs">{r.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(cat => (
                  permissions.filter(p => p.category === cat).map((perm, idx, arr) => {
                    const globalIdx = permissions.indexOf(perm);
                    return (
                      <TableRow key={perm.feature}>
                        {idx === 0 && (
                          <TableCell rowSpan={arr.length} className="font-medium align-top border-r">
                            <Badge variant="secondary">{cat}</Badge>
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{perm.feature}</TableCell>
                        {roles.map(r => (
                          <TableCell key={r.key} className="text-center">
                            <Switch
                              checked={perm[r.key]}
                              onCheckedChange={() => togglePermission(globalIdx, r.key)}
                              disabled={r.key === 'superAdmin'}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
