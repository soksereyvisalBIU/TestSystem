import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
import questions from './questions'
import students from './students'
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
export const index = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
index.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                }

    return index.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
index.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
index.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
    const indexForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
        indexForm.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::index
 * @see app/Http/Controllers/Instructor/AssessmentController.php:21
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
        indexForm.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
export const create = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
create.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                }

    return create.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
create.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
create.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
    const createForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
        createForm.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::create
 * @see app/Http/Controllers/Instructor/AssessmentController.php:51
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/create'
 */
        createForm.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\AssessmentController::store
 * @see app/Http/Controllers/Instructor/AssessmentController.php:59
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
export const store = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::store
 * @see app/Http/Controllers/Instructor/AssessmentController.php:59
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
store.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                }

    return store.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::store
 * @see app/Http/Controllers/Instructor/AssessmentController.php:59
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
store.post = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::store
 * @see app/Http/Controllers/Instructor/AssessmentController.php:59
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
    const storeForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::store
 * @see app/Http/Controllers/Instructor/AssessmentController.php:59
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment'
 */
        storeForm.post = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
export const show = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
show.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
show.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
show.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
    const showForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
        showForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::show
 * @see app/Http/Controllers/Instructor/AssessmentController.php:95
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
        showForm.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
export const edit = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
edit.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
edit.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
edit.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
    const editForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
        editForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::edit
 * @see app/Http/Controllers/Instructor/AssessmentController.php:109
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
        editForm.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
export const update = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
update.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
update.put = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
update.patch = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
    const updateForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
        updateForm.put = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::update
 * @see app/Http/Controllers/Instructor/AssessmentController.php:117
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
        updateForm.patch = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Instructor\AssessmentController::destroy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:158
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
export const destroy = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::destroy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:158
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
destroy.url = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::destroy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:158
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
destroy.delete = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::destroy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:158
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
    const destroyForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::destroy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:158
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
        destroyForm.delete = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Instructor\AssessmentController::copy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:164
 * @route '/instructor/classes/subjects/assessment/{assessment}/copy'
 */
export const copy = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copy.url(args, options),
    method: 'post',
})

copy.definition = {
    methods: ["post"],
    url: '/instructor/classes/subjects/assessment/{assessment}/copy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::copy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:164
 * @route '/instructor/classes/subjects/assessment/{assessment}/copy'
 */
copy.url = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return copy.definition.url
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AssessmentController::copy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:164
 * @route '/instructor/classes/subjects/assessment/{assessment}/copy'
 */
copy.post = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copy.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\AssessmentController::copy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:164
 * @route '/instructor/classes/subjects/assessment/{assessment}/copy'
 */
    const copyForm = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: copy.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\AssessmentController::copy
 * @see app/Http/Controllers/Instructor/AssessmentController.php:164
 * @route '/instructor/classes/subjects/assessment/{assessment}/copy'
 */
        copyForm.post = (args: { assessment: string | number } | [assessment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: copy.url(args, options),
            method: 'post',
        })
    
    copy.form = copyForm
const assessments = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
copy: Object.assign(copy, copy),
questions: Object.assign(questions, questions),
students: Object.assign(students, students),
}

export default assessments