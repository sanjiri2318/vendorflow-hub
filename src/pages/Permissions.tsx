import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Users } from 'lucide-react';

interface PermissionRow {
  feature: string;
  category: string;
  admin: boolean;
  vendor: boolean;
  operations: boolean;
}

const permissions: PermissionRow[] = [
  { feature: 'Dashboard Overview', category: 'Overview', admin: true, vendor: true, operations: true },
  { feature: 'Product Catalog', category: 'Catalog', admin: true, vendor: true, operations: false },
  { feature: 'Product Health', category: 'Catalog', admin: true, vendor: true, operations: true },
  { feature: 'SKU Mapping', category: 'Catalog', admin: true, vendor: true, operations: false },
  { feature: 'Inventory Management', category: 'Inventory', admin: true, vendor: true, operations: true },
  { feature: 'Orders', category: 'Inventory', admin: true, vendor: true, operations: true },
  { feature: 'Consolidated Orders', category: 'Inventory', admin: true, vendor: false, operations: true },
  { feature: 'Returns & Claims', category: 'Inventory', admin: true, vendor: false, operations: true },
  { feature: 'Settlements', category: 'Finance', admin: true, vendor: true, operations: false },
  { feature: 'Reconciliation', category: 'Finance', admin: true, vendor: false, operations: true },
  { feature: 'Price & Payout', category: 'Finance', admin: true, vendor: true, operations: false },
  { feature: 'Vendor Management', category: 'Vendors', admin: true, vendor: false, operations: false },
  { feature: 'Warehouse & Storage', category: 'Vendors', admin: true, vendor: false, operations: true },
  { feature: 'Data Import', category: 'Operations', admin: true, vendor: false, operations: true },
  { feature: 'Task Manager', category: 'Operations', admin: true, vendor: false, operations: true },
  { feature: 'Analytics', category: 'Operations', admin: true, vendor: true, operations: false },
  { feature: 'Social Insights', category: 'Marketing', admin: true, vendor: true, operations: false },
  { feature: 'Reports & History', category: 'Reports', admin: true, vendor: true, operations: true },
  { feature: 'Support Center', category: 'System', admin: true, vendor: true, operations: true },
  { feature: 'Subscription', category: 'System', admin: true, vendor: false, operations: false },
  { feature: 'User Permissions', category: 'System', admin: true, vendor: false, operations: false },
  { feature: 'AI Hub', category: 'System', admin: true, vendor: false, operations: false },
];

export default function Permissions() {
  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Permissions & Access Control</h1>
        <p className="text-muted-foreground">Configure role-based feature access for the platform</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { role: 'Admin', desc: 'Full system access', count: permissions.filter(p => p.admin).length, color: 'bg-primary/10 text-primary' },
          { role: 'Vendor', desc: 'Catalog & orders access', count: permissions.filter(p => p.vendor).length, color: 'bg-blue-500/10 text-blue-600' },
          { role: 'Operations', desc: 'Fulfillment & ops access', count: permissions.filter(p => p.operations).length, color: 'bg-emerald-500/10 text-emerald-600' },
        ].map(r => (
          <Card key={r.role}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${r.color}`}><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="text-lg font-bold">{r.role}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                  <p className="text-sm text-muted-foreground mt-1">{r.count}/{permissions.length} features</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>Enable or disable features per role</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Feature</TableHead>
                <TableHead className="text-center font-semibold">Admin</TableHead>
                <TableHead className="text-center font-semibold">Vendor</TableHead>
                <TableHead className="text-center font-semibold">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(cat => (
                permissions.filter(p => p.category === cat).map((perm, idx) => (
                  <TableRow key={perm.feature}>
                    {idx === 0 && (
                      <TableCell rowSpan={permissions.filter(p => p.category === cat).length} className="font-medium align-top border-r">
                        <Badge variant="secondary">{cat}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{perm.feature}</TableCell>
                    <TableCell className="text-center"><Switch checked={perm.admin} disabled={perm.admin} /></TableCell>
                    <TableCell className="text-center"><Switch checked={perm.vendor} /></TableCell>
                    <TableCell className="text-center"><Switch checked={perm.operations} /></TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
