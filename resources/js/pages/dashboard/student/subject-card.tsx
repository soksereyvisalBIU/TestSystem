import { Link } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
export default function SubjectCard({ subject, classId, submissions }) {
    return (
        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-border bg-card p-7 transition-all hover:border-primary/50 hover:shadow-2xl">
            <div>
                <div className="mb-6 flex items-start justify-between">
                    <div className="h-16 w-16 overflow-hidden rounded-[1.25rem] border-2 border-border shadow-inner">
                        <img
                            src={`/storage/${subject.cover}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) =>
                                (e.target.src = `https://ui-avatars.com/api/?name=${subject.name}&background=6366f1&color=fff&bold=true`)
                            }
                        />
                    </div>
                    <Link
                        href={`/student/classes/${classId}/subjects/${subject.id}`}
                        className="rounded-2xl bg-muted p-3 text-muted-foreground shadow-sm transition-all hover:bg-primary hover:text-white"
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
                <h4 className="mb-2 text-2xl leading-none font-black tracking-tight text-title">
                    {subject.name}
                </h4>
                <p className="line-clamp-2 text-sm leading-relaxed font-medium text-muted-foreground">
                    {subject.description}
                </p>
            </div>

            <div className="mt-8 space-y-3">
                {subject.assessments.slice(0, 2).map((assess) => {
                    const sub = submissions.find(
                        (s) => s.assessment_id === assess.id,
                    );
                    return (
                        <Link
                            key={assess.id}
                            href={`/student/classes/${classId}/subjects/${subject.id}/assessment/${assess.id}`}
                            className="group/task flex items-center justify-between rounded-2xl bg-muted/30 p-4 transition-all hover:bg-muted"
                        >
                            <div className="flex items-center gap-3">
                                {sub?.status === 'scored' ? (
                                    <CheckCircle2
                                        size={16}
                                        className="text-emerald-500"
                                    />
                                ) : (
                                    <Clock
                                        size={16}
                                        className="text-amber-500"
                                    />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-title">
                                        {assess.title}
                                    </span>
                                    <span className="text-[9px] font-black uppercase opacity-40">
                                        {assess.type}
                                    </span>
                                </div>
                            </div>
                            {sub?.status === 'scored' ? (
                                <span className="text-xs font-black text-emerald-600">
                                    {sub.score}%
                                </span>
                            ) : (
                                <ArrowUpRight
                                    size={14}
                                    className="opacity-0 transition-all group-hover/task:opacity-100"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
