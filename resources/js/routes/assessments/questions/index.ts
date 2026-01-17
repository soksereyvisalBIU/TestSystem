import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
export const index = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/assessments/{assessment}/questions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
index.url = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assessment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    assessment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assessment: args.assessment,
                }

    return index.definition.url
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
index.get = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
index.head = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
    const indexForm = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
        indexForm.get = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::index
 * @see app/Http/Controllers/Api/V1/QuestionController.php:21
 * @route '/api/v1/assessments/{assessment}/questions'
 */
        indexForm.head = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::store
 * @see app/Http/Controllers/Api/V1/QuestionController.php:42
 * @route '/api/v1/assessments/{assessment}/questions'
 */
export const store = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/assessments/{assessment}/questions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::store
 * @see app/Http/Controllers/Api/V1/QuestionController.php:42
 * @route '/api/v1/assessments/{assessment}/questions'
 */
store.url = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assessment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    assessment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assessment: args.assessment,
                }

    return store.definition.url
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::store
 * @see app/Http/Controllers/Api/V1/QuestionController.php:42
 * @route '/api/v1/assessments/{assessment}/questions'
 */
store.post = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\QuestionController::store
 * @see app/Http/Controllers/Api/V1/QuestionController.php:42
 * @route '/api/v1/assessments/{assessment}/questions'
 */
    const storeForm = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::store
 * @see app/Http/Controllers/Api/V1/QuestionController.php:42
 * @route '/api/v1/assessments/{assessment}/questions'
 */
        storeForm.post = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
export const show = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/assessments/{assessment}/questions/{question}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
show.url = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    assessment: args[0],
                    question: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assessment: args.assessment,
                                question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return show.definition.url
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
show.get = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
show.head = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
    const showForm = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
        showForm.get = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::show
 * @see app/Http/Controllers/Api/V1/QuestionController.php:163
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
        showForm.head = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
export const update = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/assessments/{assessment}/questions/{question}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
update.url = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    assessment: args[0],
                    question: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assessment: args.assessment,
                                question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return update.definition.url
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
update.put = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
update.patch = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
    const updateForm = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
        updateForm.put = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::update
 * @see app/Http/Controllers/Api/V1/QuestionController.php:168
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
        updateForm.patch = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\QuestionController::destroy
 * @see app/Http/Controllers/Api/V1/QuestionController.php:302
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
export const destroy = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/assessments/{assessment}/questions/{question}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::destroy
 * @see app/Http/Controllers/Api/V1/QuestionController.php:302
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
destroy.url = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    assessment: args[0],
                    question: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assessment: args.assessment,
                                question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return destroy.definition.url
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\QuestionController::destroy
 * @see app/Http/Controllers/Api/V1/QuestionController.php:302
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
destroy.delete = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\QuestionController::destroy
 * @see app/Http/Controllers/Api/V1/QuestionController.php:302
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
    const destroyForm = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\QuestionController::destroy
 * @see app/Http/Controllers/Api/V1/QuestionController.php:302
 * @route '/api/v1/assessments/{assessment}/questions/{question}'
 */
        destroyForm.delete = (args: { assessment: string | number, question: number | { id: number } } | [assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const questions = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default questions