import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileSpreadsheet, Sparkles, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RoutineBlock } from '@/types/routine';

interface Props {
  onImport: (blocks: Omit<RoutineBlock, 'id' | 'order'>[]) => void;
}

interface ParsedRow {
  subject: string;
  startDate: string;
  endDate: string;
}

function parseCSVFromExcel(text: string): ParsedRow[] {
  const lines = text.split('\n').filter(l => l.trim());
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t').length > 1 ? lines[i].split('\t') : lines[i].split(',');
    if (cols.length >= 3) {
      rows.push({ subject: cols[0]?.trim(), startDate: cols[1]?.trim(), endDate: cols[2]?.trim() });
    }
  }
  return rows.filter(r => r.subject && r.startDate && !r.startDate.includes('updated'));
}

export function ExcelUploader({ onImport }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    // Try to read as text (CSV/TSV) for preview
    const text = await f.text();
    const parsed = parseCSVFromExcel(text);
    if (parsed.length > 0) {
      setParsedData(parsed);
    } else {
      // For xlsx files, we'll send raw text and let AI interpret
      setParsedData([]);
      setManualData(text.substring(0, 2000));
    }
  };

  const handlePasteData = () => {
    if (!manualData.trim()) return;
    const parsed = parseCSVFromExcel(manualData);
    setParsedData(parsed);
  };

  const handleFormulate = async () => {
    const scheduleData = parsedData.length > 0 
      ? parsedData 
      : manualData 
        ? [{ raw: manualData }] 
        : null;

    if (!scheduleData) {
      toast.error('Please upload a file or paste your schedule data');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('formulate-routine', {
        body: { scheduleData, preferences: preferences || undefined },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.blocks && Array.isArray(data.blocks)) {
        onImport(data.blocks.map((b: any) => ({
          title: b.title || 'Untitled',
          type: b.type || 'study',
          duration: b.duration || 30,
          startTime: b.startTime,
          flowMode: b.flowMode || 'sequential',
          reminderStart: b.reminderStart ?? true,
          reminderEnd: b.reminderEnd ?? false,
          repeat: 'daily' as const,
        })));
        toast.success(data.summary || 'Routine created successfully!');
        setFile(null);
        setParsedData([]);
        setManualData('');
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to formulate routine');
    } finally {
      setLoading(false);
    }
  };

  // Pre-loaded GATE schedule data
  const loadSampleGATE = () => {
    const gateSchedule: ParsedRow[] = [
      { subject: 'Computer Organisation and Architecture', startDate: '2026-04-01', endDate: '2026-04-24' },
      { subject: 'Algorithms', startDate: '2026-04-23', endDate: '2026-05-26' },
      { subject: 'Computer Network', startDate: '2026-05-27', endDate: '2026-07-24' },
      { subject: 'Theory of Computation', startDate: '2026-06-29', endDate: '2026-07-30' },
      { subject: 'Discrete Mathematics', startDate: '2026-07-27', endDate: '2026-08-28' },
      { subject: 'C Programming', startDate: '2026-07-31', endDate: '2026-08-26' },
      { subject: 'Linear Algebra', startDate: '2026-08-24', endDate: '2026-09-08' },
      { subject: 'Operating System', startDate: '2026-08-27', endDate: '2026-09-25' },
      { subject: 'Compiler Design', startDate: '2026-08-31', endDate: '2026-09-18' },
      { subject: 'Probability And Statistics', startDate: '2026-09-09', endDate: '2026-10-09' },
      { subject: 'DBMS', startDate: '2026-09-28', endDate: '2026-11-06' },
      { subject: 'Calculus and Optimization', startDate: '2026-10-12', endDate: '2026-10-30' },
      { subject: 'Digital Logic (Weekend)', startDate: '2026-07-25', endDate: '2026-09-27' },
    ];
    setParsedData(gateSchedule);
    toast.success('GATE 2027 schedule loaded!');
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Import Schedule & Generate Routine</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Upload Excel/CSV</Label>
            <div className="mt-1">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.tsv,.txt,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button variant="outline" size="sm" className="w-full" onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {file ? file.name : 'Choose File'}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs">Or use sample</Label>
            <div className="mt-1">
              <Button variant="outline" size="sm" className="w-full" onClick={loadSampleGATE}>
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                Load GATE 2027
              </Button>
            </div>
          </div>
        </div>

        {parsedData.length === 0 && (
          <div>
            <Label className="text-xs">Or paste schedule data (CSV/tab-separated)</Label>
            <Textarea
              className="mt-1 text-xs font-mono h-20"
              placeholder="Subject, Start Date, End Date&#10;Algorithms, 2026-04-23, 2026-05-26&#10;..."
              value={manualData}
              onChange={e => setManualData(e.target.value)}
            />
            {manualData.trim() && (
              <Button variant="link" size="sm" className="px-0 text-xs mt-1" onClick={handlePasteData}>
                Parse pasted data
              </Button>
            )}
          </div>
        )}

        <AnimatePresence>
          {parsedData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{parsedData.length} subjects loaded</p>
                <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => { setParsedData([]); setFile(null); }}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="max-h-32 overflow-auto rounded border bg-muted/50 p-2">
                {parsedData.map((r, i) => (
                  <div key={i} className="text-xs py-0.5 flex justify-between">
                    <span className="font-medium truncate flex-1">{r.subject}</span>
                    <span className="text-muted-foreground ml-2 shrink-0">{r.startDate} → {r.endDate}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <Label className="text-xs">Preferences (optional)</Label>
          <Input
            className="mt-1 text-sm"
            placeholder="e.g. Morning person, include gym, 2 Pomodoro sessions..."
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
          />
        </div>

        <Button
          onClick={handleFormulate}
          disabled={loading || (parsedData.length === 0 && !manualData.trim())}
          className="w-full"
          size="sm"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> AI is formulating...</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-1.5" /> Formulate Daily Routine</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
