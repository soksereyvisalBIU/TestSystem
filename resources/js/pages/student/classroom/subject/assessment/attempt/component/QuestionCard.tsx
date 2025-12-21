// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import QuestionRenderer from './QuestionRenderer';

// export const QuestionCard = ({ 
//     q, index, total, answer, onAnswerChange, isCompleted, 
//     viewMode, isActive, onNext, onPrev, onShowSubmit, innerRef 
// }: any) => (
//     <section
//         ref={innerRef}
//         className={cn(
//             'relative rounded-[3rem] border p-10 transition-all duration-500',
//             isActive || viewMode === 'single'
//                 ? 'border-primary bg-white shadow-2xl ring-8 ring-primary/5 dark:bg-zinc-900'
//                 : 'border-slate-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/50',
//         )}
//     >
//         <div className="mb-8 flex items-center justify-between">
//             <Badge className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-black uppercase shadow-lg">
//                 Question {index + 1} {viewMode === 'single' && `of ${total}`}
//             </Badge>
//             {answer && (
//                 <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[10px] font-black text-green-600 uppercase dark:bg-green-900/30">
//                     <CheckCircle className="h-3 w-3" /> Recorded
//                 </div>
//             )}
//         </div>

//         <QuestionRenderer
//             question={q}
//             index={index}
//             answer={answer}
//             onAnswerChange={onAnswerChange}
//             disabled={isCompleted}
//         />

//         {viewMode === 'single' && (
//             <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8 dark:border-zinc-800">
//                 <Button variant="outline" onClick={onPrev} disabled={index === 0} className="h-14 rounded-2xl px-6 font-bold">
//                     <ChevronLeft className="mr-2 h-5 w-5" /> Previous
//                 </Button>
//                 <div className="text-sm font-black text-slate-300">{index + 1} / {total}</div>
//                 {index === total - 1 ? (
//                     <Button onClick={onShowSubmit} className="h-14 rounded-2xl bg-green-600 px-8 font-bold hover:bg-green-700">Review & Submit</Button>
//                 ) : (
//                     <Button onClick={onNext} className="h-14 rounded-2xl px-8 font-bold">Next <ChevronRight className="ml-2 h-5 w-5" /></Button>
//                 )}
//             </div>
//         )}
//     </section>
// );