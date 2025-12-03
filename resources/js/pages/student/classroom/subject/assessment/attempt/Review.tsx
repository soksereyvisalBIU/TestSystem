import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAssessmentScore from '@/hooks/student/useAssessmentScore';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { Answer, Attempt, Question } from '@/types/assessment'; // Added Question type
import { Head } from '@inertiajs/react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { useMemo } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react'; // Import icons

// Define an interface to augment the Question type with the correct options
interface DetailedQuestion extends Question {
    options?: { // Assuming a question might have options (like for MCQs or Matching)
        id: number;
        question_id: number;
        option_text: string;
        is_correct: 0 | 1; // Assuming 0 for false, 1 for true
    }[];
}

// Augment Attempt type to use DetailedQuestion and include required dates
interface DetailedAttempt extends Attempt {
    assessment: {
        title: string;
        questions: DetailedQuestion[];
        // ... other assessment properties
    };
    answers: Answer[];
    // Ensure these fields exist or are safely accessed
    started_at: string;
    submitted_at: string | null;
    score: number | null;
    sub_score: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Review Attempt', href: dashboard().url },
];

// Helper function to get status and styling
const getQuestionStatus = (
    question: DetailedQuestion,
    qAnswers: Answer[]
) => {
    // 1. Check if an answer was provided
    if (qAnswers.length === 0) {
        return {
            status: 'Not Answered',
            badgeVariant: 'secondary' as const,
            icon: <Clock className="h-4 w-4 text-muted-foreground" />,
            pointsDisplay: '0 / ' + question.point,
            pointsColor: 'text-muted-foreground',
        };
    }

    // 2. Check for manual grading
    if (['short_answer', 'essay'].includes(question.type)) {
        const anyAnswerGraded = qAnswers.some(ans => ans.points_earned !== null);
        
        if (!anyAnswerGraded) {
             return {
                status: 'Pending Grading',
                badgeVariant: 'default' as const,
                icon: <Clock className="h-4 w-4 text-amber-500" />,
                pointsDisplay: `${qAnswers[0]?.points_earned ?? '-'} / ${question.point}`,
                pointsColor: 'text-amber-500',
            };
        }
    }
    
    // 3. Automated grading (assuming point is on the answer object)
    // For auto-graded types (true_false, multiple_choice, matching), 
    // we use the points_earned on the first answer object for simplicity,
    // assuming all related answers for one question get graded together.
    const pointsEarned = qAnswers[0]?.points_earned ?? 0;
    const maxPoints = Number(question.point);
    const earned = Number(pointsEarned);

    if (earned === maxPoints) {
        return {
            status: 'Correct',
            badgeVariant: 'default' as const,
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            pointsDisplay: `${earned} / ${maxPoints}`,
            pointsColor: 'text-green-500',
        };
    } else if (earned > 0) {
        return {
            status: 'Partially Correct',
            badgeVariant: 'default' as const,
            icon: <CheckCircle className="h-4 w-4 text-yellow-500" />,
            pointsDisplay: `${earned} / ${maxPoints}`,
            pointsColor: 'text-yellow-500',
        };
    } else {
        return {
            status: 'Incorrect',
            badgeVariant: 'destructive' as const,
            icon: <XCircle className="h-4 w-4 text-red-500" />,
            pointsDisplay: `${earned} / ${maxPoints}`,
            pointsColor: 'text-red-500',
        };
    }
};


export default function AttemptReview({
    assessmentAttempt, assessmentAttemptResource
}: {
    assessmentAttempt: DetailedAttempt , assessmentAttemptResource:any
}) {
    // The useAssessmentScore hook isn't strictly necessary if the data is already pre-loaded
    // and correctly shaped as DetailedAttempt, but keeping it for context if it handles
    // additional score calculation/fetching.
    const studentAssessmentAttempt = useAssessmentScore(assessmentAttempt);

    console.log(assessmentAttemptResource);
    // {
    //     "data": {
    //         "student_assesment_id": 3,
    //         "status": "submitted",
    //         "started_at": "2025-12-03T10:59:09.000000Z",
    //         "completed_at": null,
    //         "sub_score": 0,
    //         "assessment": {
    //             "course_id": null,
    //             "title": "Week I Quizz",
    //             "description": "Good Luck Everyone",
    //             "type": "quiz",
    //             "start_time": "2025-12-02 10:45:00",
    //             "end_time": "2025-12-04 10:45:00",
    //             "duration": null,
    //             "max_attempts": 3,
    //             "questions": [
    //                 {
    //                     "id": "1",
    //                     "question": "Vero fuga Exercitat",
    //                     "type": "true_false",
    //                     "point": 10,
    //                     "order": 1,
    //                     "options": [
    //                         {
    //                             "id": 1,
    //                             "text": "True"
    //                         },
    //                         {
    //                             "id": 2,
    //                             "text": "False"
    //                         }
    //                     ],
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "2",
    //                     "question": "Facilis quasi deseru",
    //                     "type": "true_false",
    //                     "point": 10,
    //                     "order": 2,
    //                     "options": [
    //                         {
    //                             "id": 3,
    //                             "text": "True"
    //                         },
    //                         {
    //                             "id": 4,
    //                             "text": "False"
    //                         }
    //                     ],
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "3",
    //                     "question": "Aut ab voluptatibus",
    //                     "type": "multiple_choice",
    //                     "point": 10,
    //                     "order": 3,
    //                     "options": [
    //                         {
    //                             "id": 5,
    //                             "text": "Inventore sed ipsam"
    //                         },
    //                         {
    //                             "id": 6,
    //                             "text": "Fugiat qui qui volup"
    //                         },
    //                         {
    //                             "id": 7,
    //                             "text": "Et neque veniam odi"
    //                         },
    //                         {
    //                             "id": 8,
    //                             "text": "Recusandae Veniam"
    //                         }
    //                     ],
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "4",
    //                     "question": "Accusamus laborum S",
    //                     "type": "multiple_choice",
    //                     "point": 10,
    //                     "order": 4,
    //                     "options": [
    //                         {
    //                             "id": 9,
    //                             "text": "Corporis deserunt bl"
    //                         },
    //                         {
    //                             "id": 10,
    //                             "text": "Dolores aute irure v"
    //                         },
    //                         {
    //                             "id": 11,
    //                             "text": "Odio consectetur sa"
    //                         },
    //                         {
    //                             "id": 12,
    //                             "text": "Ut ut impedit aut d"
    //                         }
    //                     ],
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "5",
    //                     "question": "Vero excepturi et ve",
    //                     "type": "matching",
    //                     "point": 15,
    //                     "order": 5,
    //                     "options": {
    //                         "left": [
    //                             {
    //                                 "id": 13,
    //                                 "text": "Dolorem vero sint ad"
    //                             },
    //                             {
    //                                 "id": 14,
    //                                 "text": "Proident velit quae"
    //                             },
    //                             {
    //                                 "id": 15,
    //                                 "text": "Sed consequatur Pro"
    //                             },
    //                             {
    //                                 "id": 16,
    //                                 "text": "Error molestias sit"
    //                             },
    //                             {
    //                                 "id": 17,
    //                                 "text": "Sit obcaecati occae"
    //                             }
    //                         ],
    //                         "right": [
    //                             {
    //                                 "text": "Iste ut aut qui repu"
    //                             },
    //                             {
    //                                 "text": "Veritatis quia provi"
    //                             },
    //                             {
    //                                 "text": "Inventore ea sunt is"
    //                             },
    //                             {
    //                                 "text": "Quibusdam ipsam cum"
    //                             },
    //                             {
    //                                 "text": "Ex explicabo Eum vo"
    //                             }
    //                         ]
    //                     },
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "6",
    //                     "question": "Aut irure laboris pl",
    //                     "type": "matching",
    //                     "point": 15,
    //                     "order": 6,
    //                     "options": {
    //                         "left": [
    //                             {
    //                                 "id": 18,
    //                                 "text": "Enim recusandae Mol"
    //                             },
    //                             {
    //                                 "id": 19,
    //                                 "text": "Molestiae ut odit se"
    //                             },
    //                             {
    //                                 "id": 20,
    //                                 "text": "Ex iure esse dolorem"
    //                             },
    //                             {
    //                                 "id": 21,
    //                                 "text": "Aut ullam quae unde"
    //                             },
    //                             {
    //                                 "id": 22,
    //                                 "text": "Maxime iusto volupta"
    //                             }
    //                         ],
    //                         "right": [
    //                             {
    //                                 "text": "Dolore provident qu"
    //                             },
    //                             {
    //                                 "text": "Quis sed vitae dolor"
    //                             },
    //                             {
    //                                 "text": "Pariatur Dolorem id"
    //                             },
    //                             {
    //                                 "text": "Officia debitis dolo"
    //                             },
    //                             {
    //                                 "text": "Sed consequat Id do"
    //                             }
    //                         ]
    //                     },
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "7",
    //                     "question": "Laboriosam voluptat",
    //                     "type": "short_answer",
    //                     "point": 15,
    //                     "order": 7,
    //                     "options": null,
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 },
    //                 {
    //                     "id": "8",
    //                     "question": "Quaerat sit laborios",
    //                     "type": "short_answer",
    //                     "point": 15,
    //                     "order": 8,
    //                     "options": null,
    //                     "allow_file_upload": 0,
    //                     "allow_code_submission": 0
    //                 }
    //             ]
    //         },
    //         "answers": [
    //             {
    //                 "question_id": 1,
    //                 "option_id": null,
    //                 "answer_text": "False",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 2,
    //                 "option_id": null,
    //                 "answer_text": "True",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 3,
    //                 "option_id": null,
    //                 "answer_text": "Fugiat qui qui volup",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 4,
    //                 "option_id": null,
    //                 "answer_text": "Odio consectetur sa",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 5,
    //                 "option_id": 13,
    //                 "answer_text": "Quibusdam ipsam cum",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 5,
    //                 "option_id": 14,
    //                 "answer_text": "Ex explicabo Eum vo",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 5,
    //                 "option_id": 15,
    //                 "answer_text": "Iste ut aut qui repu",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 5,
    //                 "option_id": 16,
    //                 "answer_text": "Inventore ea sunt is",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 5,
    //                 "option_id": 17,
    //                 "answer_text": "Veritatis quia provi",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 6,
    //                 "option_id": 18,
    //                 "answer_text": "Sed consequat Id do",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 6,
    //                 "option_id": 19,
    //                 "answer_text": "Dolore provident qu",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 6,
    //                 "option_id": 20,
    //                 "answer_text": "Officia debitis dolo",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 6,
    //                 "option_id": 21,
    //                 "answer_text": "Pariatur Dolorem id",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 6,
    //                 "option_id": 22,
    //                 "answer_text": "Quis sed vitae dolor",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 7,
    //                 "option_id": null,
    //                 "answer_text": "Obcaecati dignissimo",
    //                 "points_earned": null
    //             },
    //             {
    //                 "question_id": 8,
    //                 "option_id": null,
    //                 "answer_text": "Sapiente consectetur",
    //                 "points_earned": null
    //             }
    //         ]
    //     }
    // }
    
    

    console.log(studentAssessmentAttempt)
// {
//     "id": 19,
//     "student_assesment_id": 3,
//     "status": "submitted",
//     "started_at": "2025-12-03T10:59:09.000000Z",
//     "completed_at": null,
//     "sub_score": 0,
//     "created_at": "2025-12-03T10:59:09.000000Z",
//     "updated_at": "2025-12-03T10:59:32.000000Z",
//     "student_assessment": {
//         "id": 3,
//         "user_id": 3,
//         "assessment_id": 1,
//         "status": null,
//         "score": 0,
//         "attempted_amount": 0,
//         "created_at": "2025-12-03T10:58:51.000000Z",
//         "updated_at": "2025-12-03T10:58:51.000000Z"
//     },
//     "assessment": {
//         "id": 1,
//         "title": "Week I Quizz",
//         "description": "Good Luck Everyone",
//         "type": "quiz",
//         "start_time": "2025-12-02 10:45:00",
//         "end_time": "2025-12-04 10:45:00",
//         "duration": null,
//         "max_attempts": 3,
//         "created_by": null,
//         "created_at": "2025-12-03T03:45:47.000000Z",
//         "updated_at": "2025-12-03T03:45:47.000000Z",
//         "laravel_through_key": 3,
//         "questions": [
//             {
//                 "id": 1,
//                 "assessment_id": 1,
//                 "question_text": "Vero fuga Exercitat",
//                 "type": "true_false",
//                 "point": "10.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 1,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:17.000000Z",
//                 "updated_at": "2025-12-03T03:47:17.000000Z"
//             },
//             {
//                 "id": 2,
//                 "assessment_id": 1,
//                 "question_text": "Facilis quasi deseru",
//                 "type": "true_false",
//                 "point": "10.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 2,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:17.000000Z",
//                 "updated_at": "2025-12-03T03:47:17.000000Z"
//             },
//             {
//                 "id": 3,
//                 "assessment_id": 1,
//                 "question_text": "Aut ab voluptatibus",
//                 "type": "multiple_choice",
//                 "point": "10.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 3,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:17.000000Z",
//                 "updated_at": "2025-12-03T03:47:17.000000Z"
//             },
//             {
//                 "id": 4,
//                 "assessment_id": 1,
//                 "question_text": "Accusamus laborum S",
//                 "type": "multiple_choice",
//                 "point": "10.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 4,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:18.000000Z",
//                 "updated_at": "2025-12-03T03:47:18.000000Z"
//             },
//             {
//                 "id": 5,
//                 "assessment_id": 1,
//                 "question_text": "Vero excepturi et ve",
//                 "type": "matching",
//                 "point": "15.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 5,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:18.000000Z",
//                 "updated_at": "2025-12-03T03:47:18.000000Z"
//             },
//             {
//                 "id": 6,
//                 "assessment_id": 1,
//                 "question_text": "Aut irure laboris pl",
//                 "type": "matching",
//                 "point": "15.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 6,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:18.000000Z",
//                 "updated_at": "2025-12-03T03:47:18.000000Z"
//             },
//             {
//                 "id": 7,
//                 "assessment_id": 1,
//                 "question_text": "Laboriosam voluptat",
//                 "type": "short_answer",
//                 "point": "15.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 7,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:18.000000Z",
//                 "updated_at": "2025-12-03T03:47:18.000000Z"
//             },
//             {
//                 "id": 8,
//                 "assessment_id": 1,
//                 "question_text": "Quaerat sit laborios",
//                 "type": "short_answer",
//                 "point": "15.00",
//                 "allow_file_upload": 0,
//                 "allow_code_submission": 0,
//                 "order": 8,
//                 "section_id": null,
//                 "created_at": "2025-12-03T03:47:18.000000Z",
//                 "updated_at": "2025-12-03T03:47:18.000000Z"
//             }
//         ]
//     },
//     "answers": [
//         {
//             "id": 17,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 1,
//             "option_id": null,
//             "selected_option_id": null,
//             "answer_text": "False",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 18,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 2,
//             "option_id": null,
//             "selected_option_id": null,
//             "answer_text": "True",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 19,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 3,
//             "option_id": null,
//             "selected_option_id": null,
//             "answer_text": "Fugiat qui qui volup",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 20,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 4,
//             "option_id": null,
//             "selected_option_id": null,
//             "answer_text": "Odio consectetur sa",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 21,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 5,
//             "option_id": 13,
//             "selected_option_id": null,
//             "answer_text": "Quibusdam ipsam cum",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 22,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 5,
//             "option_id": 14,
//             "selected_option_id": null,
//             "answer_text": "Ex explicabo Eum vo",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 23,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 5,
//             "option_id": 15,
//             "selected_option_id": null,
//             "answer_text": "Iste ut aut qui repu",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 24,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 5,
//             "option_id": 16,
//             "selected_option_id": null,
//             "answer_text": "Inventore ea sunt is",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 25,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 5,
//             "option_id": 17,
//             "selected_option_id": null,
//             "answer_text": "Veritatis quia provi",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 26,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 6,
//             "option_id": 18,
//             "selected_option_id": null,
//             "answer_text": "Sed consequat Id do",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 27,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 6,
//             "option_id": 19,
//             "selected_option_id": null,
//             "answer_text": "Dolore provident qu",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 28,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 6,
//             "option_id": 20,
//             "selected_option_id": null,
//             "answer_text": "Officia debitis dolo",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 29,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 6,
//             "option_id": 21,
//             "selected_option_id": null,
//             "answer_text": "Pariatur Dolorem id",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 30,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 6,
//             "option_id": 22,
//             "selected_option_id": null,
//             "answer_text": "Quis sed vitae dolor",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 31,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 7,
//             "option_id": null,
//             "selected_option_id": null,
//             "answer_text": "Obcaecati dignissimo",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         },
//         {
//             "id": 32,
//             "student_assessment_attempt_id": 19,
//             "attempt_id": null,
//             "question_id": 8,
//             "option_id": null,
//             "selected_option_id": null,
//             "answer_text": "Sapiente consectetur",
//             "code_language": null,
//             "points_earned": null,
//             "created_at": "2025-12-03T10:59:32.000000Z",
//             "updated_at": "2025-12-03T10:59:32.000000Z"
//         }
//     ]
// }

    // Use the potentially augmented data from the hook
    const { assessment, answers = [] } = studentAssessmentAttempt;

    // ------------------------------------------------------
    // Group answers by question ID
    // ------------------------------------------------------
    const groupedAnswers = useMemo(() => {
        return answers.reduce<Record<number, Answer[]>>((acc, ans) => {
            const qid = ans.question_id;
            if (!acc[qid]) acc[qid] = [];
            acc[qid].push(ans);
            return acc;
        }, {});
    }, [answers]);

    // ------------------------------------------------------
    // Calculate total points
    // ------------------------------------------------------
    const totalPoints = useMemo(() => {
        return (
            assessment?.questions?.reduce(
                (sum, q) => sum + Number(q.point ?? 0),
                0,
            ) ?? 0
        );
    }, [assessment]);

    // ------------------------------------------------------
    // Score and Time Taken
    // ------------------------------------------------------
    const scoreEarned = studentAssessmentAttempt.score ?? studentAssessmentAttempt.sub_score ?? 'Not Graded';
    const submittedAt = studentAssessmentAttempt.submitted_at || studentAssessmentAttempt.completed_at;

    const timeTaken = useMemo(() => {
        if (!studentAssessmentAttempt.started_at || !submittedAt) {
            return '-';
        }
        return dayjs
            .duration(
                dayjs(submittedAt).diff(
                    dayjs(studentAssessmentAttempt.started_at),
                ),
            )
            .format('H[h] m[m] s[s]');
    }, [studentAssessmentAttempt.started_at, submittedAt]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review: ${assessment.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto rounded-xl p-8">
                {/* Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             Reviewing: {assessment.title} 📝
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {/* Score */}
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                                Score
                            </div>
                            <div className="text-2xl font-bold">
                                {scoreEarned} / {totalPoints}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                                Status
                            </div>
                            <Badge
                                variant={
                                    studentAssessmentAttempt.status ===
                                    'submitted'
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="mt-1 capitalize"
                            >
                                {studentAssessmentAttempt.status}
                            </Badge>
                        </div>

                        {/* Time Taken */}
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                                Time Taken
                            </div>
                            <div className="text-xl font-semibold">
                                {timeTaken}
                            </div>
                        </div>

                        {/* Total Questions */}
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                                Questions
                            </div>
                            <div className="text-xl font-semibold">
                                {assessment.questions?.length ?? 0}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <hr className="my-2" />

                {/* Question List */}
                <div className="space-y-4">
                    {assessment.questions?.map((question, index) => {
                        const qAnswers = groupedAnswers[question.id] ?? [];
                        const { status, icon, pointsDisplay, pointsColor } = getQuestionStatus(question, qAnswers);

                        return (
                            <Card key={question.id} className="gap-2 shadow-md">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold flex gap-2 items-center">
                                            <span>Q{index + 1}.</span> 
                                            <span className="font-normal">{question.question_text}</span>
                                        </CardTitle>
                                        <div className="flex  items-end gap-2 shrink-0">
                                            <Badge variant={status === 'Not Answered' ? 'secondary' : status === 'Correct' ? 'default' : status === 'Incorrect' ? 'destructive' : 'default'} className="capitalize flex items-center gap-1">
                                                {icon}
                                                {status}
                                            </Badge>
                                            <div className={`text-sm font-bold ${pointsColor}`}>
                                                {pointsDisplay}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="text-sm text-muted-foreground pt-1">
                                        Type: <Badge variant="outline" className="capitalize">{question.type.replace('_', ' ')}</Badge>
                                    </div> */}
                                </CardHeader>

                                <CardContent >
                                    {/* <h4 className="font-semibold mb-2">Your Answer{qAnswers.length > 1 ? 's' : ''}:</h4> */}
                                    <div className="space-y-2">
                                        {qAnswers.length === 0 ? (
                                            <div className="text-muted-foreground italic p-2 rounded-md border">
                                                No Answer Provided
                                            </div>
                                        ) : (
                                            qAnswers.map((ans) => (
                                                <div
                                                    key={ans.id}
                                                    className="rounded-md border p-3 bg-card-foreground/5"
                                                >
                                                    {/* Display option_id/option_text for matching/multi-select if available */}
                                                    {/* {ans.option_id && (
                                                        <div className="text-xs text-muted-foreground mb-1">
                                                            (Option ID: {ans.option_id})
                                                        </div>
                                                    )} */}
                                                    <div className="text-sm">
                                                        {ans.answer_text}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}

// Keep the console.log line in the original file, or remove it in the final file.
// The data structure is clear from the comment block now.