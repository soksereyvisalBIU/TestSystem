import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function MatrixForm({ data, onChange }: any) {
  const rows = data.rows || ['Row 1'];
  const cols = data.cols || ['Col 1'];

  const update = (r: string[], c: string[]) => onChange({ ...data, rows: r, cols: c });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Rows (Questions)</Label>
        {rows.map((r: string, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={r} onChange={(e) => {
              const next = [...rows]; next[i] = e.target.value; update(next, cols);
            }} />
            <Button size="icon" variant="ghost" onClick={() => update(rows.filter((_: any, idx: number) => idx !== i), cols)}><X size={14}/></Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => update([...rows, ''], cols)}><Plus size={14}/> Add Row</Button>
      </div>

      <div className="space-y-2">
        <Label>Columns (Categories)</Label>
        <div className="flex flex-wrap gap-2">
          {cols.map((c: string, i: number) => (
            <div key={i} className="flex items-center border rounded pl-2">
              <input className="outline-none bg-transparent w-20 text-sm" value={c} onChange={(e) => {
                const next = [...cols]; next[i] = e.target.value; update(rows, next);
              }} />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => update(rows, cols.filter((_: any, idx: number) => idx !== i))}><X size={12}/></Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => update(rows, [...cols, ''])}><Plus size={14}/></Button>
        </div>
      </div>
    </div>
  );
}