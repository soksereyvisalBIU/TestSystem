import RichTextEditor from '@/components/RichTextEditor';

export default function QAQuestion({ q, value, onChange }: any) {
    return <RichTextEditor value={value || ''} onChange={(content) => onChange(q.id, content)} />;
}
