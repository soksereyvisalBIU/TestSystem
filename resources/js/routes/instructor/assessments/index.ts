import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Instructor\StudentController::autoScore
 * @see app/Http/Controllers/Instructor/StudentController.php:161
 * @route '/instructor/instructor/classes/{class}/subjects/{subject}/assessments/{assessment}/auto-score'
 */
export const autoScore = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoScore.url(args, options),
    method: 'post',
})

autoScore.definition = {
    methods: ["post"],
    url: '/instructor/instructor/classes/{class}/subjects/{subject}/assessments/{assessment}/auto-score',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::autoScore
 * @see app/Http/Controllers/Instructor/StudentController.php:161
 * @route '/instructor/instructor/classes/{class}/subjects/{subject}/assessments/{assessment}/auto-score'
 */
autoScore.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                }

    return autoScore.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\StudentController::autoScore
 * @see app/Http/Controllers/Instructor/StudentController.php:161
 * @route '/instructor/instructor/classes/{class}/subjects/{subject}/assessments/{assessment}/auto-score'
 */
autoScore.post = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoScore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::autoScore
 * @see app/Http/Controllers/Instructor/StudentController.php:161
 * @route '/instructor/instructor/classes/{class}/subjects/{subject}/assessments/{assessment}/auto-score'
 */
    const autoScoreForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoScore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::autoScore
 * @see app/Http/Controllers/Instructor/StudentController.php:161
 * @route '/instructor/instructor/classes/{class}/subjects/{subject}/assessments/{assessment}/auto-score'
 */
        autoScoreForm.post = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoScore.url(args, options),
            method: 'post',
        })
    
    autoScore.form = autoScoreForm
const assessments = {
    autoScore: Object.assign(autoScore, autoScore),
}

export default assessments