import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
export const index = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
index.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
index.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
index.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
    const indexForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
        indexForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\QuestionController::index
 * @see app/Http/Controllers/Instructor/QuestionController.php:34
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
        indexForm.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
export const create = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
create.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
create.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
create.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
    const createForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
        createForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\QuestionController::create
 * @see app/Http/Controllers/Instructor/QuestionController.php:70
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/create'
 */
        createForm.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Instructor\QuestionController::store
 * @see app/Http/Controllers/Instructor/QuestionController.php:78
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
export const store = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::store
 * @see app/Http/Controllers/Instructor/QuestionController.php:78
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
store.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::store
 * @see app/Http/Controllers/Instructor/QuestionController.php:78
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
store.post = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::store
 * @see app/Http/Controllers/Instructor/QuestionController.php:78
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
    const storeForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::store
 * @see app/Http/Controllers/Instructor/QuestionController.php:78
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question'
 */
        storeForm.post = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
export const show = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
show.url = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    question: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                question: args.question,
                }

    return show.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
show.get = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
show.head = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
    const showForm = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
        showForm.get = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\QuestionController::show
 * @see app/Http/Controllers/Instructor/QuestionController.php:0
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
        showForm.head = (args: { class: string | number, subject: string | number, assessment: string | number, question: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, question: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
export const edit = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
edit.url = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    question: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return edit.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
edit.get = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
edit.head = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
    const editForm = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
        editForm.get = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\QuestionController::edit
 * @see app/Http/Controllers/Instructor/QuestionController.php:204
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}/edit'
 */
        editForm.head = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
export const update = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
update.url = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    question: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return update.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
update.put = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
update.patch = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
    const updateForm = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
        updateForm.put = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Instructor\QuestionController::update
 * @see app/Http/Controllers/Instructor/QuestionController.php:220
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
        updateForm.patch = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Instructor\QuestionController::destroy
 * @see app/Http/Controllers/Instructor/QuestionController.php:346
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
export const destroy = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Instructor\QuestionController::destroy
 * @see app/Http/Controllers/Instructor/QuestionController.php:346
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
destroy.url = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    question: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return destroy.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\QuestionController::destroy
 * @see app/Http/Controllers/Instructor/QuestionController.php:346
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
destroy.delete = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Instructor\QuestionController::destroy
 * @see app/Http/Controllers/Instructor/QuestionController.php:346
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
    const destroyForm = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\QuestionController::destroy
 * @see app/Http/Controllers/Instructor/QuestionController.php:346
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/question/{question}'
 */
        destroyForm.delete = (args: { class: string | number, subject: string | number, assessment: string | number, question: number | { id: number } } | [classParam: string | number, subject: string | number, assessment: string | number, question: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const QuestionController = { index, create, store, show, edit, update, destroy }

export default QuestionController