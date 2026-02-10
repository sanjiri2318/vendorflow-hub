import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTasks, portalConfigs } from '@/services/mockData';
import { ListTodo, Plus, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const statusBadge = (status: string) => {
  switch (status) {
    case 'completed': return <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 gap-1"><CheckCircle2 className="w-3 h-3" />Completed</Badge>;
    case 'in_progress': return <Badge variant="outline" className="bg-blue-500/15 text-blue-600 border-blue-500/30 gap-1"><Loader2 className="w-3 h-3" />In Progress</Badge>;
    case 'pending': return <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30 gap-1"><Clock className="w-3 h-3" />Open</Badge>;
    case 'escalated': return <Badge variant="outline" className="bg-rose-500/15 text-rose-600 border-rose-500/30 gap-1"><AlertCircle className="w-3 h-3" />Escalated</Badge>;
    default: return null;
  }
};

const priorityBadge = (priority: string) => {
  const cls = priority === 'urgent' ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
    : priority === 'high' ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
    : priority === 'medium' ? 'bg-blue-500/15 text-blue-600 border-blue-500/30'
    : 'bg-muted text-muted-foreground';
  return <Badge variant="outline" className={`capitalize ${cls}`}>{priority}</Badge>;
};

const roleLabels: Record<string, string> = {
  'ops-001': 'Operations',
  'admin-001': 'Admin',
  'vendor-001': 'Vendor',
};

export default function Tasks() {
  const { toast } = useToast();
  const openCount = mockTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = mockTasks.filter(t => t.status === 'in_progress').length;
  const completedCount = mockTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground">Track and manage operational tasks</p>
        </div>
        <Button className="gap-2" onClick={() => toast({ title: 'Create Task', description: 'Task creation form would open here.' })}>
          <Plus className="w-4 h-4" />New Task
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><ListTodo className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{mockTasks.length}</p><p className="text-sm text-muted-foreground">Total Tasks</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Clock className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{openCount}</p><p className="text-sm text-muted-foreground">Open</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Loader2 className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{inProgressCount}</p><p className="text-sm text-muted-foreground">In Progress</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">{completedCount}</p><p className="text-sm text-muted-foreground">Completed</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Operational task list with priorities and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Task ID</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="font-semibold">Portal</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasks.map(task => {
                const portal = portalConfigs.find(p => p.id === task.portal);
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
                return (
                  <TableRow key={task.taskId} className={isOverdue ? 'bg-rose-500/5' : ''}>
                    <TableCell className="font-mono text-sm">{task.taskId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{roleLabels[task.assignedTo] || task.assignedTo}</Badge></TableCell>
                    <TableCell>{portal ? <span>{portal.icon} {portal.name}</span> : <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{priorityBadge(task.priority)}</TableCell>
                    <TableCell>{statusBadge(task.status)}</TableCell>
                    <TableCell className={`text-sm ${isOverdue ? 'text-rose-600 font-medium' : 'text-muted-foreground'}`}>
                      {format(new Date(task.dueDate), 'dd MMM yyyy')}
                      {isOverdue && <span className="block text-xs">Overdue</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
