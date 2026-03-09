 import React, { useState, useCallback } from 'react';
 
 import {
   DndContext,
   closestCenter,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   DragEndEvent,
 } from '@dnd-kit/core';
 import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   verticalListSortingStrategy,
 } from '@dnd-kit/sortable';
 import { Target, Plus, CheckCircle2, Clock, AlertCircle, Flag } from 'lucide-react';
 import { isPast } from 'date-fns';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
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
 import { DraggableGoalCard } from '@/components/goals/DraggableGoalCard';

 import type { Goal } from '@/types/habits';

 
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

   const sensors = useSensors(
     useSensor(PointerSensor),
     useSensor(KeyboardSensor, {
       coordinateGetter: sortableKeyboardCoordinates,
     })
   );
 
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
   
   // Handle goal reordering
   const handleDragEnd = useCallback(async (event: DragEndEvent) => {
     const { active, over } = event;
     
     if (over && active.id !== over.id) {
       const oldIndex = goals.findIndex(g => g.id === active.id);
       const newIndex = goals.findIndex(g => g.id === over.id);
       
       if (oldIndex !== -1 && newIndex !== -1) {
         const newGoals = arrayMove(goals, oldIndex, newIndex);
         
         // Update sort_order for each goal
         for (let i = 0; i < newGoals.length; i++) {
           const goal = newGoals[i];
           if (goal.sort_order !== i) {
             await updateGoal(goal.id, { sort_order: i });
           }
         }
       }
     }
   }, [goals, updateGoal]);
  
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

   
  // Stats
  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const overdueGoals = goals.filter(g => g.deadline && isPast(new Date(g.deadline)) && g.status !== 'completed').length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + calculateProgress(g.id), 0) / goals.length)
    : 0;

  return (
    <>
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
           <DndContext
             sensors={sensors}
             collisionDetection={closestCenter}
             onDragEnd={handleDragEnd}
           >
             <SortableContext
               items={goals.map(g => g.id)}
               strategy={verticalListSortingStrategy}
             >
               {goals.map((goal) => {
                 const goalMilestones = getGoalMilestones(goal.id);
                 const isExpanded = expandedGoals.has(goal.id);
 
                 return (
                   <DraggableGoalCard
                     key={goal.id}
                     goal={goal}
                     milestones={goalMilestones}
                     isExpanded={isExpanded}
                     onToggleExpand={() => toggleGoalExpand(goal.id)}
                     onEdit={() => openEditGoal(goal)}
                     onDelete={() => deleteGoal(goal.id)}
                     onAddMilestone={() => openAddMilestone(goal.id)}
                     onToggleMilestone={(milestone) => updateMilestone(milestone.id, {
                       status: milestone.status === 'completed' ? 'pending' : 'completed',
                       completed_at: milestone.status === 'completed' ? null : new Date().toISOString()
                     })}
                     onDeleteMilestone={(milestoneId) => deleteMilestone(milestoneId)}
                   />
                 );
               })}
             </SortableContext>
           </DndContext>

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
    </>
  );
}
