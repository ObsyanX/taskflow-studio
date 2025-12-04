-- Change due_date from date to timestamp with time zone to support time
ALTER TABLE public.tasks 
ALTER COLUMN due_date TYPE timestamp with time zone 
USING due_date::timestamp with time zone;