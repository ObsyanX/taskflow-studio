-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (no auth required for this simple todo app)
CREATE POLICY "Anyone can view tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (true);