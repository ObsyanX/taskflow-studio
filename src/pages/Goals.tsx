import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit2,
  Flag
} from 'lucide-react';
import { format, differenceInDays, isPast, isToday } from 'date-fns';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout/MainLayout';
import type { Goal, Milestone } from '@/types/habits';

const priorityColors = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const statusColors = {
  not_started: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-500/10 text-blue-500',
  completed: 'bg-green-500/10 text-green-500',
  overdue: 'bg-red-500/10 text-red-500',
};

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};

export default function Goals() {
  const { user } = useAuth();
  const { 
    goals, 
    milestones, 
    isLoading, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    createMilestone,
    updateMilestone,
    deleteMilestone
  } = useGoals(user?.id);

  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  
  // Form state
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: '',
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    target_date: '',
  });

  const handleCreateGoal = async () => {
    if (!goalForm.title.trim()) return;
    
    await createGoal({
      title: goalForm.title,
      description: goalForm.description || null,
      priority: goalForm.priority,
      deadline: goalForm.deadline || null,
    });
    
    setGoalForm({ title: '', description: '', priority: 'medium', deadline: '' });
    setIsGoalDialogOpen(false);
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal || !goalForm.title.trim()) return;
    
    await updateGoal(editingGoal.id, {
      title: goalForm.title,
      description: goalForm.description || null,
      priority: goalForm.priority,
      deadline: goalForm.deadline || null,
    });
    
    setGoalForm({ title: '', description: '', priority: 'medium', deadline: '' });
    setEditingGoal(null);
    setIsGoalDialogOpen(false);
  };

  const handleCreateMilestone = async () => {
    if (!selectedGoalId || !milestoneForm.title.trim()) return;
    
    await createMilestone({
      goal_id: selectedGoalId,
      title: milestoneForm.title,
      description: milestoneForm.description || null,
      target_date: milestoneForm.target_date || null,
    });
    
    setMilestoneForm({ title: '', description: '', target_date: '' });
    setIsMilestoneDialogOpen(false);
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || '',
      priority: goal.priority,
      deadline: goal.deadline || '',
    });
    setIsGoalDialogOpen(true);
  };

  const openAddMilestone = (goalId: string) => {
    setSelectedGoalId(goalId);
    setMilestoneForm({ title: '', description: '', target_date: '' });
    setIsMilestoneDialogOpen(true);
  };

  const toggleGoalExpand = (goalId: string) => {
    setExpandedGoals(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const getGoalMilestones = (goalId: string) => {
    return milestones.filter(m => m.goal_id === goalId);
  };

  const calculateProgress = (goalId: string) => {
    const goalMilestones = getGoalMilestones(goalId);
    if (goalMilestones.length === 0) return 0;
    const completed = goalMilestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / goalMilestones.length) * 100);
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days;
  };

  // Stats
  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const overdueGoals = goals.filter(g => g.deadline && isPast(new Date(g.deadline)) && g.status !== 'completed').length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + calculateProgress(g.id), 0) / goals.length)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Goals & Milestones</h1>
            <p className="text-muted-foreground">Track your long-term objectives</p>
          </div>
          <Button onClick={() => { setEditingGoal(null); setGoalForm({ title: '', description: '', priority: 'medium', deadline: '' }); setIsGoalDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeGoals}</p>
                  <p className="text-xs text-muted-foreground">Active Goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedGoals}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overdueGoals}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgProgress}%</p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          <AnimatePresence>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.id);
              const daysRemaining = getDaysRemaining(goal.deadline);
              const goalMilestones = getGoalMilestones(goal.id);
              const isExpanded = expandedGoals.has(goal.id);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="overflow-hidden">
                    <Collapsible open={isExpanded} onOpenChange={() => toggleGoalExpand(goal.id)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 mt-0.5">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <CardTitle className="text-lg">{goal.title}</CardTitle>
                                <Badge variant="outline" className={priorityColors[goal.priority]}>
                                  {goal.priority}
                                </Badge>
                                <Badge className={statusColors[goal.status]}>
                                  {statusLabels[goal.status]}
                                </Badge>
                              </div>
                              {goal.description && (
                                <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                {goal.deadline && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                                    {daysRemaining !== null && (
                                      <span className={cn(
                                        'ml-1',
                                        daysRemaining < 0 ? 'text-red-500' : daysRemaining <= 7 ? 'text-yellow-500' : ''
                                      )}>
                                        ({daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`})
                                      </span>
                                    )}
                                  </div>
                                )}
                                <span>{goalMilestones.length} milestones</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => openEditGoal(goal)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 pl-9">
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium w-10 text-right">{progress}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CollapsibleContent>
                        <CardContent className="pt-0 pl-12">
                          <div className="border-t border-border pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium">Milestones</h4>
                              <Button variant="outline" size="sm" onClick={() => openAddMilestone(goal.id)}>
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                            
                            {goalMilestones.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-4 text-center">
                                No milestones yet. Add milestones to track progress.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {goalMilestones.map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    className={cn(
                                      'flex items-center gap-3 p-3 rounded-lg border',
                                      milestone.status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/50'
                                    )}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0"
                                      onClick={() => updateMilestone(milestone.id, {
                                        status: milestone.status === 'completed' ? 'pending' : 'completed',
                                        completed_at: milestone.status === 'completed' ? null : new Date().toISOString()
                                      })}
                                    >
                                      <CheckCircle2 className={cn(
                                        'h-4 w-4',
                                        milestone.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                                      )} />
                                    </Button>
                                    <div className="flex-1 min-w-0">
                                      <p className={cn(
                                        'text-sm font-medium',
                                        milestone.status === 'completed' && 'line-through text-muted-foreground'
                                      )}>
                                        {milestone.title}
                                      </p>
                                      {milestone.target_date && (
                                        <p className="text-xs text-muted-foreground">
                                          Due: {format(new Date(milestone.target_date), 'MMM d, yyyy')}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0"
                                      onClick={() => deleteMilestone(milestone.id)}
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {goals.length === 0 && !isLoading && (
            <Card className="p-12">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first goal to start tracking your progress
                </p>
                <Button onClick={() => setIsGoalDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Goal Dialog */}
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter goal title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={goalForm.description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={goalForm.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => setGoalForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Flag className="h-3 w-3 text-red-500" />
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Flag className="h-3 w-3 text-yellow-500" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Flag className="h-3 w-3 text-green-500" />
                          Low
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={goalForm.deadline}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}>
                {editingGoal ? 'Update' : 'Create'} Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Milestone Dialog */}
        <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="milestone-title">Title</Label>
                <Input
                  id="milestone-title"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter milestone title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestone-description">Description</Label>
                <Textarea
                  id="milestone-description"
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this milestone..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestone-date">Target Date</Label>
                <Input
                  id="milestone-date"
                  type="date"
                  value={milestoneForm.target_date}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, target_date: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMilestone}>
                Add Milestone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
