import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
export const review = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(args, options),
    method: 'get',
})

review.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
review.url = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class_id: args[0],
                    subject_id: args[1],
                    assessment_id: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class_id: args.class_id,
                                subject_id: args.subject_id,
                                assessment_id: args.assessment_id,
                }

    return review.definition.url
            .replace('{class_id}', parsedArgs.class_id.toString())
            .replace('{subject_id}', parsedArgs.subject_id.toString())
            .replace('{assessment_id}', parsedArgs.assessment_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
review.get = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
review.head = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: review.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
    const reviewForm = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: review.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
        reviewForm.get = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AttemptController::review
 * @see app/Http/Controllers/Student/AttemptController.php:174
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review'
 */
        reviewForm.head = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    review.form = reviewForm
/**
* @see \App\Http\Controllers\Student\AttemptController::store
 * @see app/Http/Controllers/Student/AttemptController.php:64
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store'
 */
export const store = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AttemptController::store
 * @see app/Http/Controllers/Student/AttemptController.php:64
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store'
 */
store.url = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class_id: args[0],
                    subject_id: args[1],
                    assessment_id: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class_id: args.class_id,
                                subject_id: args.subject_id,
                                assessment_id: args.assessment_id,
                }

    return store.definition.url
            .replace('{class_id}', parsedArgs.class_id.toString())
            .replace('{subject_id}', parsedArgs.subject_id.toString())
            .replace('{assessment_id}', parsedArgs.assessment_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttemptController::store
 * @see app/Http/Controllers/Student/AttemptController.php:64
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store'
 */
store.post = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\AttemptController::store
 * @see app/Http/Controllers/Student/AttemptController.php:64
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store'
 */
    const storeForm = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AttemptController::store
 * @see app/Http/Controllers/Student/AttemptController.php:64
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store'
 */
        storeForm.post = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Student\AttemptController::uploadChunk
 * @see app/Http/Controllers/Student/AttemptController.php:201
 * @route '/student/upload-chunk'
 */
export const uploadChunk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadChunk.url(options),
    method: 'post',
})

uploadChunk.definition = {
    methods: ["post"],
    url: '/student/upload-chunk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AttemptController::uploadChunk
 * @see app/Http/Controllers/Student/AttemptController.php:201
 * @route '/student/upload-chunk'
 */
uploadChunk.url = (options?: RouteQueryOptions) => {
    return uploadChunk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttemptController::uploadChunk
 * @see app/Http/Controllers/Student/AttemptController.php:201
 * @route '/student/upload-chunk'
 */
uploadChunk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadChunk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\AttemptController::uploadChunk
 * @see app/Http/Controllers/Student/AttemptController.php:201
 * @route '/student/upload-chunk'
 */
    const uploadChunkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadChunk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AttemptController::uploadChunk
 * @see app/Http/Controllers/Student/AttemptController.php:201
 * @route '/student/upload-chunk'
 */
        uploadChunkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadChunk.url(options),
            method: 'post',
        })
    
    uploadChunk.form = uploadChunkForm
const attempt = {
    store: Object.assign(store, store),
uploadChunk: Object.assign(uploadChunk, uploadChunk),
}

export default attempt