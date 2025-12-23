import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceCard } from '../card/resource-card';
import { Resource } from '@/types/student/assessment';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderDown, Library, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface ResourcesListProps {
    resources: Resource[];
    onDownload?: (resourceId: number) => void;
}

export function ResourcesList({ resources, onDownload }: ResourcesListProps) {
    const [filter, setFilter] = useState('all');

    // Example categories based on types in your data
    const categories = ['all', ...new Set(resources.map(r => r.type.toLowerCase()))];

    const filteredResources = filter === 'all' 
        ? resources 
        : resources.filter(r => r.type.toLowerCase() === filter);

    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50">
            <CardHeader className="flex flex-col gap-6 border-b border-slate-50 p-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Library className="h-5 w-5" />
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                            Knowledge Base
                        </CardTitle>
                    </div>
                    <CardDescription className="text-sm font-medium text-slate-500">
                        {resources.length} study materials available for download.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-500">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button 
                        className="h-10 rounded-xl bg-slate-900 font-bold text-white shadow-lg transition-all hover:bg-blue-600 active:scale-95"
                        onClick={() => console.log('Bulk Download logic')}
                    >
                        <FolderDown className="mr-2 h-4 w-4" />
                        Download All
                    </Button>
                </div>
            </CardHeader>

            {/* Quick Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto bg-slate-50/50 px-8 py-3 no-scrollbar">
                <Filter className="mr-2 h-3 w-3 text-slate-400" />
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`whitespace-nowrap rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === cat 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                            : 'bg-white text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <CardContent className="p-6">
                <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredResources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ResourceCard
                                    resource={resource}
                                    onDownload={onDownload}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredResources.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-slate-50 p-6">
                            <Library className="h-12 w-12 text-slate-200" />
                        </div>
                        <h4 className="font-bold text-slate-900">No matching resources</h4>
                        <p className="text-sm text-slate-500">Try adjusting your filters.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}