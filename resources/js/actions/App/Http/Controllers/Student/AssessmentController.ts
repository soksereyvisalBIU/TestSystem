import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
export const index = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class}/subjects/{subject}/assessment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
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
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
index.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
index.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
    const indexForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
        indexForm.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AssessmentController::index
 * @see app/Http/Controllers/Student/AssessmentController.php:18
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
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
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
 */
export const create = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class}/subjects/{subject}/assessment/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
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
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
 */
create.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
 */
create.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
 */
    const createForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
 */
        createForm.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AssessmentController::create
 * @see app/Http/Controllers/Student/AssessmentController.php:119
 * @route '/student/classes/{class}/subjects/{subject}/assessment/create'
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
* @see \App\Http\Controllers\Student\AssessmentController::store
 * @see app/Http/Controllers/Student/AssessmentController.php:120
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
export const store = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/student/classes/{class}/subjects/{subject}/assessment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::store
 * @see app/Http/Controllers/Student/AssessmentController.php:120
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
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
* @see \App\Http\Controllers\Student\AssessmentController::store
 * @see app/Http/Controllers/Student/AssessmentController.php:120
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
store.post = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::store
 * @see app/Http/Controllers/Student/AssessmentController.php:120
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
    const storeForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AssessmentController::store
 * @see app/Http/Controllers/Student/AssessmentController.php:120
 * @route '/student/classes/{class}/subjects/{subject}/assessment'
 */
        storeForm.post = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
export const show = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class}/subjects/{subject}/assessment/{assessment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
show.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
show.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
    const showForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
        showForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AssessmentController::show
 * @see app/Http/Controllers/Student/AssessmentController.php:86
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
export const edit = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
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
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
edit.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
edit.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
    const editForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
 */
        editForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AssessmentController::edit
 * @see app/Http/Controllers/Student/AssessmentController.php:121
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}/edit'
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
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
export const update = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/student/classes/{class}/subjects/{subject}/assessment/{assessment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
update.put = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
update.patch = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::update
 * @see app/Http/Controllers/Student/AssessmentController.php:122
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::destroy
 * @see app/Http/Controllers/Student/AssessmentController.php:123
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
export const destroy = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/student/classes/{class}/subjects/{subject}/assessment/{assessment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::destroy
 * @see app/Http/Controllers/Student/AssessmentController.php:123
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::destroy
 * @see app/Http/Controllers/Student/AssessmentController.php:123
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
 */
destroy.delete = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::destroy
 * @see app/Http/Controllers/Student/AssessmentController.php:123
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::destroy
 * @see app/Http/Controllers/Student/AssessmentController.php:123
 * @route '/student/classes/{class}/subjects/{subject}/assessment/{assessment}'
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
* @see \App\Http\Controllers\Student\AssessmentController::request
 * @see app/Http/Controllers/Student/AssessmentController.php:26
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request'
 */
export const request = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(args, options),
    method: 'post',
})

request.definition = {
    methods: ["post"],
    url: '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::request
 * @see app/Http/Controllers/Student/AssessmentController.php:26
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request'
 */
request.url = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions) => {
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

    return request.definition.url
            .replace('{class_id}', parsedArgs.class_id.toString())
            .replace('{subject_id}', parsedArgs.subject_id.toString())
            .replace('{assessment_id}', parsedArgs.assessment_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AssessmentController::request
 * @see app/Http/Controllers/Student/AssessmentController.php:26
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request'
 */
request.post = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\AssessmentController::request
 * @see app/Http/Controllers/Student/AssessmentController.php:26
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request'
 */
    const requestForm = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: request.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AssessmentController::request
 * @see app/Http/Controllers/Student/AssessmentController.php:26
 * @route '/student/classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request'
 */
        requestForm.post = (args: { class_id: string | number, subject_id: string | number, assessment_id: string | number } | [class_id: string | number, subject_id: string | number, assessment_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: request.url(args, options),
            method: 'post',
        })
    
    request.form = requestForm
const AssessmentController = { index, create, store, show, edit, update, destroy, request }

export default AssessmentController