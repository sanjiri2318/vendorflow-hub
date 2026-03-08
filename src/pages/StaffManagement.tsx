import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { employeesDb, attendanceDb, tailorWorkDb } from '@/services/database';
import {
  Plus, Download, Search, Users, IndianRupee, Calendar, Clock, Fingerprint,
  Wifi, Smartphone, UserCheck, UserX, Scissors, Package, AlertTriangle, CheckCircle2, Loader2
} from 'lucide-react';

export default function StaffManagement() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [tailorWork, setTailorWork] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [networkOnly, setNetworkOnly] = useState(true);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', role: '', department: 'General', type: 'fixed', phone: '', monthly_salary: 0, per_piece_rate: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, attData, twData] = await Promise.all([
        employeesDb.getAll(search || undefined),
        attendanceDb.getAll(),
        tailorWorkDb.getAll(),
      ]);
      setEmployees(empData);
      setAttendance(attData);
      setTailorWork(twData);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [search]);

  const handleAddEmployee = async () => {
    try {
      await employeesDb.create(newEmp);
      toast({ title: 'Employee Added' });
      setShowAddEmployee(false);
      setNewEmp({ name: '', role: '', department: 'General', type: 'fixed', phone: '', monthly_salary: 0, per_piece_rate: 0 });
      fetchData();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const activeCount = employees.filter(e => e.status === 'active').length;
  const totalPiecesCompleted = tailorWork.reduce((s, t) => s + (t.completed || 0), 0);
  const totalPiecesPending = tailorWork.reduce((s, t) => s + (t.pending || 0), 0);
  const totalSalary = employees.filter(e => e.status === 'active').reduce((s, e) => {
    return s + (e.type === 'fixed' ? (e.monthly_salary || 0) : (e.per_piece_rate || 0) * (tailorWork.filter(t => t.employee_id === e.id).reduce((sum, t) => sum + (t.completed || 0), 0)));
  }, 0);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { present: 'bg-green-100 text-green-700', half_day: 'bg-amber-100 text-amber-700', absent: 'bg-red-100 text-red-700', late: 'bg-orange-100 text-orange-700' };
    return map[status] || '';
  };

  const filteredAttendance = networkOnly ? attendance.filter(a => a.network === 'office_wifi') : attendance;

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff & Salary Management</h1>
          <p className="text-muted-foreground">Employee tracking, attendance, piece-rate & salary calculation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export Payroll</Button>
          <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
            <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Employee</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add New Employee</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Full Name</Label><Input placeholder="Employee name" value={newEmp.name} onChange={e => setNewEmp(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><Label>Phone</Label><Input placeholder="Mobile number" value={newEmp.phone} onChange={e => setNewEmp(p => ({ ...p, phone: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Role</Label><Input placeholder="e.g. Tailor, Packing" value={newEmp.role} onChange={e => setNewEmp(p => ({ ...p, role: e.target.value }))} /></div>
                  <div><Label>Department</Label>
                    <Select value={newEmp.department} onValueChange={v => setNewEmp(p => ({ ...p, department: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{['Stitching', 'Packing', 'Warehouse', 'QC', 'Admin'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Salary Type</Label>
                    <Select value={newEmp.type} onValueChange={v => setNewEmp(p => ({ ...p, type: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Monthly</SelectItem>
                        <SelectItem value="piece_rate">Piece Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Amount (₹)</Label><Input type="number" placeholder="Salary or rate per piece" onChange={e => {
                    const val = Number(e.target.value);
                    setNewEmp(p => newEmp.type === 'fixed' ? { ...p, monthly_salary: val } : { ...p, per_piece_rate: val });
                  }} /></div>
                </div>
                <Button className="w-full" onClick={handleAddEmployee}>Save Employee</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary"><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Active Staff</span></div><p className="text-2xl font-bold">{activeCount}</p><p className="text-xs text-muted-foreground">of {employees.length} total</p></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><IndianRupee className="w-4 h-4 text-green-600" /><span className="text-xs text-muted-foreground">Payroll (Est.)</span></div><p className="text-2xl font-bold">₹{totalSalary.toLocaleString('en-IN')}</p></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-blue-600" /><span className="text-xs text-muted-foreground">Pieces Done</span></div><p className="text-2xl font-bold">{totalPiecesCompleted}</p></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-orange-600" /><span className="text-xs text-muted-foreground">Pending Work</span></div><p className="text-2xl font-bold">{totalPiecesPending}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Employees</TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Attendance</TabsTrigger>
          <TabsTrigger value="piece_work" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Piece Rate Tracking</TabsTrigger>
          <TabsTrigger value="salary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Salary Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Employee Directory</CardTitle>
                <div className="relative"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input className="pl-8 w-[200px]" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Type</TableHead><TableHead>Rate / Salary</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employees.map(emp => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell><Badge variant="outline">{emp.department}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{emp.type === 'fixed' ? 'Fixed' : 'Piece Rate'}</Badge></TableCell>
                      <TableCell className="font-semibold">{emp.type === 'fixed' ? `₹${(emp.monthly_salary || 0).toLocaleString('en-IN')}/mo` : `₹${emp.per_piece_rate}/pc`}</TableCell>
                      <TableCell><Badge className={emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{emp.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {employees.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No employees found. Add your first employee above.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div><CardTitle>Attendance Log</CardTitle><p className="text-xs text-muted-foreground mt-1">Fingerprint & Face ID tracking via office network</p></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Wifi className="w-4 h-4 text-muted-foreground" /><Label className="text-xs">Office Network Only</Label><Switch checked={networkOnly} onCheckedChange={setNetworkOnly} /></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Date</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Method</TableHead><TableHead>Network</TableHead><TableHead>Hours</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredAttendance.map(att => (
                    <TableRow key={att.id}>
                      <TableCell className="font-medium">{att.employee_id}</TableCell>
                      <TableCell>{att.attendance_date}</TableCell>
                      <TableCell>{att.check_in || '—'}</TableCell>
                      <TableCell>{att.check_out || '—'}</TableCell>
                      <TableCell><Badge variant="outline" className="gap-1">{att.method === 'fingerprint' ? <Fingerprint className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}{att.method}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="gap-1">{att.network === 'office_wifi' ? <Wifi className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}{att.network}</Badge></TableCell>
                      <TableCell>{att.hours_worked || 0}h</TableCell>
                      <TableCell><Badge className={statusBadge(att.status || 'present')}>{att.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {filteredAttendance.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No attendance records</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="piece_work">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Scissors className="w-5 h-5" />Piece Rate Work Log</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Received</TableHead><TableHead>Completed</TableHead><TableHead>Pending</TableHead><TableHead>Rate</TableHead><TableHead>Earned</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>
                  {tailorWork.map(tw => (
                    <TableRow key={tw.id}>
                      <TableCell className="font-medium">{tw.employee_id}</TableCell>
                      <TableCell>{tw.product_name}</TableCell>
                      <TableCell className="font-mono text-xs">{tw.sku || '—'}</TableCell>
                      <TableCell>{tw.received || 0}</TableCell>
                      <TableCell className="text-emerald-600 font-semibold">{tw.completed || 0}</TableCell>
                      <TableCell className={`font-semibold ${(tw.pending || 0) > 0 ? 'text-orange-600' : ''}`}>{tw.pending || 0}</TableCell>
                      <TableCell>₹{tw.rate_per_piece || 0}/pc</TableCell>
                      <TableCell className="font-semibold text-emerald-600">₹{tw.total_earned || 0}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tw.work_date}</TableCell>
                    </TableRow>
                  ))}
                  {tailorWork.length === 0 && <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No piece rate work records</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><IndianRupee className="w-5 h-5" />Salary Summary</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>Base</TableHead><TableHead>Calculated</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employees.filter(e => e.status === 'active').map(emp => {
                    const piecesEarned = tailorWork.filter(t => t.employee_id === emp.id).reduce((s, t) => s + (t.total_earned || 0), 0);
                    const salary = emp.type === 'fixed' ? (emp.monthly_salary || 0) : piecesEarned;
                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell><Badge variant="secondary">{emp.type === 'fixed' ? 'Fixed' : 'Piece Rate'}</Badge></TableCell>
                        <TableCell>{emp.type === 'fixed' ? `₹${(emp.monthly_salary || 0).toLocaleString('en-IN')}` : `₹${emp.per_piece_rate}/pc`}</TableCell>
                        <TableCell className="font-semibold text-emerald-600">₹{salary.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
