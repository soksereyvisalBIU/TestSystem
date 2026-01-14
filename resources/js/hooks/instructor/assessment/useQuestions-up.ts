// src/hooks/useQuestions.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export interface Question {
    id?: number;
    assessment_id: number;
    type:
        | 'true_false'
        | 'fill_blank'
        | 'multiple_choice'
        | 'matching'
        | 'fileupload'
        | 'short_answer';
    question: string;
    options?: string[];
    answer?: string | string[] | Record<string, string>;
}

import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

// =======================
// Get questions (from Inertia props)
// =======================
export const useQuestions = (assessment_id: number) => {
    const { props } = usePage<{ questions?: Question[] }>();

    return {
        data: props.questions || [],
        isLoading: false,
    };
};

// =======================
// Create question
// =======================
export const useCreateQuestion = (assessment_id: number) => {
    return useMutation({
        mutationFn: async (payload: Question) => {
            console.log('Creating question:', payload);

            // Transform payload to match Laravel expectations
            const formData: any = {
                type: payload.type,
                question: payload.question,
                point: payload.point,
                order: payload.order,
            };

            // Handle different question types
            switch (payload.type) {
                case 'fileupload':
                    formData.accepted_file_types =
                        (payload as any).fileType || 'image';
                    formData.maxSize = (payload as any).maxSize || 10;
                    formData.media = (payload as any).referenceImages || [];
                    break;

                case 'multiple_choice':
                    formData.options = (payload as any).options || [];
                    formData.answer = (payload as any).answer;
                    break;

                case 'true_false':
                    formData.answer = (payload as any).answer;
                    break;

                case 'fill_blank':
                case 'short_answer':
                    formData.answer = (payload as any).answer;
                    break;

                case 'matching':
                    formData.answer = (payload as any).answer;
                    break;
            }

            return new Promise((resolve, reject) => {
                router.post(
                    // `instructor/assessments/${assessment_id}/questions`,
                    route(
                        'classes.subjects.assessments.questions.store',
                        assessment_id,
                    ),
                    formData,
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            console.log('Question created successfully');
                            resolve(page);
                        },
                        onError: (errors) => {
                            console.error('Error creating question:', errors);
                            reject(errors);
                        },
                    },
                );
            });
        },
        onSuccess: () => {
            toast.success('Question created successfully!');
        },
        onError: (errors: any) => {
            if (typeof errors === 'object') {
                const allMessages = Object.values(errors).flat().join('\n');
                toast.error(allMessages);
            } else {
                toast.error('Failed to create question');
            }
        },
    });
};

// =======================
// Update question
// =======================
export const useUpdateQuestion = (assessment_id: number) => {
    return useMutation({
        mutationFn: async (payload: Question | Question[]) => {
            const questions = Array.isArray(payload) ? payload : [payload];

            const updatePromises = questions.map((q) => {
                if (!q?.id) {
                    console.warn(
                        '⚠️ Missing question ID — skipping update:',
                        q,
                    );
                    throw new Error(`Invalid question: missing "id"`);
                }

                // Transform payload to match Laravel expectations
                const formData: any = {
                    type: q.type,
                    question: q.question,
                    point: q.point,
                    order: q.order,
                    _method: 'PUT', // Laravel method spoofing
                };

                // Handle different question types
                switch (q.type) {
                    case 'fileupload':
                        formData.accepted_file_types =
                            (q as any).fileType || 'image';
                        formData.maxSize = (q as any).maxSize || 10;
                        formData.media = (q as any).referenceImages || [];
                        break;

                    case 'multiple_choice':
                        formData.options = (q as any).options || [];
                        formData.answer = (q as any).answer;
                        break;

                    case 'true_false':
                        formData.answer = (q as any).answer;
                        break;

                    case 'fill_blank':
                    case 'short_answer':
                        formData.answer = (q as any).answer;
                        break;

                    case 'matching':
                        formData.answer = (q as any).answer;
                        break;
                }

                return new Promise((resolve, reject) => {
                    router.post(
                        `instructor/assessments/${assessment_id}/questions/${q.id}`,
                        formData,
                        {
                            preserveState: true,
                            preserveScroll: true,
                            onSuccess: (page) => {
                                resolve(page);
                            },
                            onError: (errors) => {
                                reject(errors);
                            },
                        },
                    );
                });
            });

            return Promise.all(updatePromises);
        },
        onSuccess: (results) => {
            const count = Array.isArray(results) ? results.length : 1;
            toast.success(
                count > 1
                    ? 'Questions updated successfully!'
                    : 'Question updated successfully!',
            );
        },
        onError: (errors: any) => {
            console.error('❌ Update question failed:', errors);

            if (typeof errors === 'object') {
                const allMessages = Object.values(errors).flat().join('\n');
                toast.error(allMessages);
            } else {
                toast.error('Failed to update question');
            }
        },
    });
};

// =======================
// Delete question
// =======================
export const useDeleteQuestion = (assessment_id: number) => {
    return useMutation({
        mutationFn: async (question_id: number) => {
            return new Promise((resolve, reject) => {
                router.delete(
                    `instructor/assessments/${assessment_id}/questions/${question_id}`,
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            resolve(page);
                        },
                        onError: (errors) => {
                            reject(errors);
                        },
                    },
                );
            });
        },
        onSuccess: () => {
            toast.success('Question deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete question.');
        },
    });
};

// =======================
// Show single question (from Inertia props)
// =======================
export const useShowQuestion = (assessment_id: number, question_id: number) => {
    const { props } = usePage<{ question?: Question }>();

    return {
        data: props.question,
        isLoading: false,
    };
};
