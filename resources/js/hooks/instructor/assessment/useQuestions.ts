// src/hooks/useQuestions.ts
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export interface Question {
    id?: number;
    assessment_id: number;
    type:
        | 'true_false'
        | 'fill_blank'
        | 'multiple_choice'
        | 'matching'
        | 'short_answer';
    question: string;
    options?: string[];
    answer?: string | string[] | Record<string, string>;
}

// =======================
// Fetch all questions for an assessment
// =======================
export const useQuestions = (assessment_id: number) =>
    useQuery<Question[]>({
        queryKey: ['assessments', assessment_id, 'questions'],
        queryFn: async () => {
            const { data } = await api.get(
                `api/v1/assessments/${assessment_id}/questions`,
            );
            return data.data;
        },
        enabled: !!assessment_id,
        onError: (error: any) => {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const allMessages = Object.values(errors).flat().join('\n');
                toast.error(allMessages);
            } else {
                toast.error('Server error — try again later');
            }
        },
    });

// =======================
// Create question
// =======================
export const useCreateQuestion = (assessment_id: number) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (payload: Question) => {
            const { data } = await api.post(
                `api/v1/assessments/${assessment_id}/questions`,
                payload,
            );
            console.log(data)
            console.log(data.data)
            return data.data;
        },
        onSuccess: (newQuestion) => {
            toast.success('Question created successfully!');
            console.log(newQuestion);
            qc.setQueryData<Question[]>(
                ['assessments', assessment_id, 'questions'],
                (old = []) => [newQuestion, ...old],
            );
        },
        onError: (error: any) => {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const allMessages = Object.values(errors).flat().join('\n');
                toast.error(allMessages);
            }else if(error){
              const errors = error.response.data;
                const allMessages = Object.values(errors).flat().join('\n');
                toast.error(allMessages);
            } 
            else {
                toast.error('Server error — try again later');
            }
        },
    });
};

// =======================
// Update question
// =======================
export const useUpdateQuestion = (assessment_id: number) => {
    const qc = useQueryClient();

    return useMutation({
        // 🔹 Accepts either a single question or an array of questions
        mutationFn: async (payload: Question | Question[]) => {
            const questions = Array.isArray(payload) ? payload : [payload];

            try {
                const results = await Promise.all(
                    questions.map(async (q) => {
                        if (!q?.id) {
                            console.warn('⚠️ Missing question ID — skipping update:', q);
                            throw new Error(`Invalid question: missing "id"`);
                        }

                        const { data } = await api.put(
                            `api/v1/assessments/${assessment_id}/questions/${q.id}`,
                            q,
                        );

                        return data.data;
                    }),
                );

                return results;
            } catch (error) {
                console.error('❌ Error updating questions:', error);
                throw error; // rethrow so React Query handles it in onError
            }
        },

        onSuccess: (updatedQuestions) => {
            const updatedList = Array.isArray(updatedQuestions)
                ? updatedQuestions
                : [updatedQuestions];

            updatedList.forEach((q) => {
                if (!q?.id) return;
                qc.setQueryData<Question>(['questions', q.id], q);
            });

            qc.invalidateQueries({
                queryKey: ['assessments', assessment_id, 'questions'],
            });

            console.log('✅ Updated questions:', updatedQuestions);

            toast.success(
                updatedList.length > 1
                    ? 'Questions updated successfully!'
                    : 'Question updated successfully!',
            );
        },

        onError: (error: any) => {
            console.error('❌ Update question failed:', error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const allMessages = Object.values(errors).flat().join('\n');
                toast.error(allMessages);
            } else {
                toast.error('Server error — try again later');
            }
        },
    });
};


// =======================
// Delete question
// =======================
export const useDeleteQuestion = (assessment_id: number) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (question_id: number) => {
            await api.delete(
                `api/v1/assessments/${assessment_id}/questions/${question_id}`,
            );
        },
        onSuccess: () => {
            toast.success('Question deleted successfully!');
            qc.invalidateQueries({
                queryKey: ['assessments', assessment_id, 'questions'],
            });
        },
        onError: () => toast.error('Failed to delete question.'),
    });
};

// =======================
// Fetch single question
// =======================
export const useShowQuestion = (assessment_id: number, question_id: number) =>
    useQuery<Question>({
        queryKey: ['questions', question_id],
        queryFn: async () => {
            const { data } = await api.get(
                `api/v1/assessments/${assessment_id}/questions/${question_id}`,
            );
            return data.data;
        },
        enabled: !!assessment_id && !!question_id,
        onError: () => toast.error('Failed to fetch question.'),
    });
