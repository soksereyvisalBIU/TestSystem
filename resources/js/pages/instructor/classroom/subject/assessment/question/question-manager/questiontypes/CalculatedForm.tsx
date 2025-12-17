import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CalculatedForm({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Formula (use {'{a}'}, {'{b}'})</Label>
        <Input 
          placeholder="e.g. {a} * {b}" 
          value={data.formula || ''} 
          onChange={(e) => onChange({ ...data, formula: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Value for Variables</Label>
          <Input type="number" onChange={(e) => onChange({...data, min: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Max Value</Label>
          <Input type="number" onChange={(e) => onChange({...data, max: e.target.value})} />
        </div>
      </div>
    </div>
  );
}