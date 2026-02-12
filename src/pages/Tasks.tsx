import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTasks, portalConfigs } from '@/services/mockData';
import { ListTodo, Plus, CheckCircle2, Clock, AlertCircle, Loader2, Eye, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus } from '@/types';

type KanbanStatus = 'pending' | 'in_progress' | 'under_review' | 'completed';

interface KanbanTask extends Task {
  kanbanStatus: KanbanStatus;
}

const columns: { id: KanbanStatus; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'pending', label: 'To Do', icon: Clock, color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  { id: 'in_progress', label: 'In Progress', icon: Loader2, color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  { id: 'under_review', label: 'Under Review', icon: Eye, color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
];

const priorityBadge = (priority: string) => {
  const cls = priority === 'urgent' ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
    : priority === 'high' ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
    : priority === 'medium' ? 'bg-blue-500/15 text-blue-600 border-blue-500/30'
    : 'bg-muted text-muted-foreground';
  return <Badge variant="outline" className={`capitalize text-xs ${cls}`}>{priority}</Badge>;
};

const roleLabels: Record<string, string> = {
  'ops-001': 'Operations',
  'admin-001': 'Admin',
  'vendor-001': 'Vendor',
};

export default function Tasks() {
  const { toast } = useToast();

  const [tasks, setTasks] = useState<KanbanTask[]>(() =>
    mockTasks.map(t => ({
      ...t,
      kanbanStatus: t.status === 'escalated' ? 'pending' as KanbanStatus : t.status as KanbanStatus,
    }))
  );

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columnCounts = useMemo(() => {
    const counts: Record<KanbanStatus, number> = { pending: 0, in_progress: 0, under_review: 0, completed: 0 };
    tasks.forEach(t => counts[t.kanbanStatus]++);
    return counts;
  }, [tasks]);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStatus: KanbanStatus) => {
    if (!draggedTask) return;
    setTasks(prev => prev.map(t =>
      t.taskId === draggedTask ? { ...t, kanbanStatus: targetStatus, status: targetStatus === 'under_review' ? 'in_progress' as TaskStatus : targetStatus as TaskStatus } : t
    ));
    const task = tasks.find(t => t.taskId === draggedTask);
    const col = columns.find(c => c.id === targetStatus);
    toast({
      title: 'Task Moved',
      description: `"${task?.title}" moved to ${col?.label}`,
    });
    setDraggedTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground">Drag and drop tasks between columns to update status</p>
        </div>
        <Button className="gap-2" onClick={() => toast({ title: 'Create Task', description: 'Task creation form would open here.' })}>
          <Plus className="w-4 h-4" />New Task
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map(col => {
          const Icon = col.icon;
          return (
            <Card key={col.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${col.color.split(' ').slice(0, 1).join(' ')}`}>
                    <Icon className={`w-5 h-5 ${col.color.split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{columnCounts[col.id]}</p>
                    <p className="text-sm text-muted-foreground">{col.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const Icon = col.icon;
          const colTasks = tasks.filter(t => t.kanbanStatus === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
            >
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-lg border border-b-0 ${col.color}`}>
                <Icon className="w-4 h-4" />
                <span className="font-semibold text-sm">{col.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs">{colTasks.length}</Badge>
              </div>
              <div className="flex-1 min-h-[300px] bg-muted/20 border rounded-b-lg p-2 space-y-2">
                {colTasks.map(task => {
                  const portal = portalConfigs.find(p => p.id === task.portal);
                  const isOverdue = new Date(task.dueDate) < new Date() && task.kanbanStatus !== 'completed';
                  return (
                    <Card
                      key={task.taskId}
                      draggable
                      onDragStart={() => handleDragStart(task.taskId)}
                      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                        draggedTask === task.taskId ? 'opacity-50 scale-95' : ''
                      } ${isOverdue ? 'border-rose-500/30' : ''}`}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                            <p className="text-sm font-medium leading-tight">{task.title}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 pl-5">{task.description}</p>
                        <div className="flex items-center gap-1.5 flex-wrap pl-5">
                          {priorityBadge(task.priority)}
                          {portal && <Badge variant="secondary" className="text-xs">{portal.icon} {portal.name}</Badge>}
                        </div>
                        <div className="flex items-center justify-between pl-5">
                          <Badge variant="secondary" className="text-xs">{roleLabels[task.assignedTo] || task.assignedTo}</Badge>
                          <span className={`text-xs ${isOverdue ? 'text-rose-600 font-medium' : 'text-muted-foreground'}`}>
                            {format(new Date(task.dueDate), 'dd MMM')}
                            {isOverdue && ' ⚠'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-xs text-muted-foreground/50 border-2 border-dashed rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
