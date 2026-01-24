import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
export const index = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
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
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
index.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
index.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
    const indexForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
        indexForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\StudentController::index
 * @see app/Http/Controllers/Instructor/StudentController.php:23
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
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
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
 */
export const create = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
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
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
 */
create.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
 */
create.head = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
 */
    const createForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
 */
        createForm.get = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\StudentController::create
 * @see app/Http/Controllers/Instructor/StudentController.php:37
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/create'
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
* @see \App\Http\Controllers\Instructor\StudentController::store
 * @see app/Http/Controllers/Instructor/StudentController.php:45
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
export const store = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::store
 * @see app/Http/Controllers/Instructor/StudentController.php:45
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
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
* @see \App\Http\Controllers\Instructor\StudentController::store
 * @see app/Http/Controllers/Instructor/StudentController.php:45
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
store.post = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::store
 * @see app/Http/Controllers/Instructor/StudentController.php:45
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
    const storeForm = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::store
 * @see app/Http/Controllers/Instructor/StudentController.php:45
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student'
 */
        storeForm.post = (args: { class: string | number, subject: string | number, assessment: string | number } | [classParam: string | number, subject: string | number, assessment: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
export const show = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
show.url = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    student: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                student: args.student,
                }

    return show.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
show.get = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
show.head = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
    const showForm = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
        showForm.get = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\StudentController::show
 * @see app/Http/Controllers/Instructor/StudentController.php:101
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
        showForm.head = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
export const edit = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
edit.url = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    student: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                student: args.student,
                }

    return edit.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
edit.get = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
edit.head = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
    const editForm = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
        editForm.get = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\StudentController::edit
 * @see app/Http/Controllers/Instructor/StudentController.php:147
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}/edit'
 */
        editForm.head = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
export const update = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
update.url = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    student: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                student: args.student,
                }

    return update.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
update.put = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
update.patch = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
    const updateForm = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
        updateForm.put = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Instructor\StudentController::update
 * @see app/Http/Controllers/Instructor/StudentController.php:155
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
        updateForm.patch = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Instructor\StudentController::destroy
 * @see app/Http/Controllers/Instructor/StudentController.php:163
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
export const destroy = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::destroy
 * @see app/Http/Controllers/Instructor/StudentController.php:163
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
destroy.url = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    student: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                student: args.student,
                }

    return destroy.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\StudentController::destroy
 * @see app/Http/Controllers/Instructor/StudentController.php:163
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
destroy.delete = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::destroy
 * @see app/Http/Controllers/Instructor/StudentController.php:163
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
    const destroyForm = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::destroy
 * @see app/Http/Controllers/Instructor/StudentController.php:163
 * @route '/instructor/classes/{class}/subjects/{subject}/assessment/{assessment}/student/{student}'
 */
        destroyForm.delete = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
export const check = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})

check.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
check.url = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                    subject: args[1],
                    assessment: args[2],
                    student: args[3],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                                subject: args.subject,
                                assessment: args.assessment,
                                student: args.student,
                }

    return check.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
check.get = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
check.head = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: check.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
    const checkForm = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: check.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
        checkForm.get = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\StudentController::check
 * @see app/Http/Controllers/Instructor/StudentController.php:169
 * @route '/instructor/classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check'
 */
        checkForm.head = (args: { class: string | number, subject: string | number, assessment: string | number, student: string | number } | [classParam: string | number, subject: string | number, assessment: string | number, student: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    check.form = checkForm
const StudentController = { index, create, store, show, edit, update, destroy, check }

export default StudentController