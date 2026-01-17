import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import assessments from './assessments'
/**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
export const index = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
index.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { class: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                }

    return index.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
index.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
index.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
    const indexForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
        indexForm.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\SubjectController::index
 * @see app/Http/Controllers/Instructor/SubjectController.php:19
 * @route '/instructor/classes/{class}/subjects'
 */
        indexForm.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
export const create = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
create.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { class: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                }

    return create.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
create.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
create.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
    const createForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
        createForm.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\SubjectController::create
 * @see app/Http/Controllers/Instructor/SubjectController.php:31
 * @route '/instructor/classes/{class}/subjects/create'
 */
        createForm.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\SubjectController::store
 * @see app/Http/Controllers/Instructor/SubjectController.php:39
 * @route '/instructor/classes/{class}/subjects'
 */
export const store = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/instructor/classes/{class}/subjects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::store
 * @see app/Http/Controllers/Instructor/SubjectController.php:39
 * @route '/instructor/classes/{class}/subjects'
 */
store.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { class: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class: args.class,
                }

    return store.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::store
 * @see app/Http/Controllers/Instructor/SubjectController.php:39
 * @route '/instructor/classes/{class}/subjects'
 */
store.post = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::store
 * @see app/Http/Controllers/Instructor/SubjectController.php:39
 * @route '/instructor/classes/{class}/subjects'
 */
    const storeForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::store
 * @see app/Http/Controllers/Instructor/SubjectController.php:39
 * @route '/instructor/classes/{class}/subjects'
 */
        storeForm.post = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
export const show = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
show.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
show.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
show.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
    const showForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
        showForm.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\SubjectController::show
 * @see app/Http/Controllers/Instructor/SubjectController.php:79
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
        showForm.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
export const edit = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/instructor/classes/{class}/subjects/{subject}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
edit.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
edit.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
edit.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
    const editForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
        editForm.get = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\SubjectController::edit
 * @see app/Http/Controllers/Instructor/SubjectController.php:92
 * @route '/instructor/classes/{class}/subjects/{subject}/edit'
 */
        editForm.head = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
export const update = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/instructor/classes/{class}/subjects/{subject}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
update.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
update.put = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
update.patch = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
    const updateForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
        updateForm.put = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Instructor\SubjectController::update
 * @see app/Http/Controllers/Instructor/SubjectController.php:103
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
        updateForm.patch = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Instructor\SubjectController::destroy
 * @see app/Http/Controllers/Instructor/SubjectController.php:136
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
export const destroy = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/instructor/classes/{class}/subjects/{subject}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::destroy
 * @see app/Http/Controllers/Instructor/SubjectController.php:136
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
destroy.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::destroy
 * @see app/Http/Controllers/Instructor/SubjectController.php:136
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
destroy.delete = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::destroy
 * @see app/Http/Controllers/Instructor/SubjectController.php:136
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
    const destroyForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::destroy
 * @see app/Http/Controllers/Instructor/SubjectController.php:136
 * @route '/instructor/classes/{class}/subjects/{subject}'
 */
        destroyForm.delete = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Instructor\SubjectController::copy
 * @see app/Http/Controllers/Instructor/SubjectController.php:149
 * @route '/instructor/classes/{class}/subjects/{subject}/copy'
 */
export const copy = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copy.url(args, options),
    method: 'post',
})

copy.definition = {
    methods: ["post"],
    url: '/instructor/classes/{class}/subjects/{subject}/copy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\SubjectController::copy
 * @see app/Http/Controllers/Instructor/SubjectController.php:149
 * @route '/instructor/classes/{class}/subjects/{subject}/copy'
 */
copy.url = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions) => {
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

    return copy.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\SubjectController::copy
 * @see app/Http/Controllers/Instructor/SubjectController.php:149
 * @route '/instructor/classes/{class}/subjects/{subject}/copy'
 */
copy.post = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copy.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\SubjectController::copy
 * @see app/Http/Controllers/Instructor/SubjectController.php:149
 * @route '/instructor/classes/{class}/subjects/{subject}/copy'
 */
    const copyForm = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: copy.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\SubjectController::copy
 * @see app/Http/Controllers/Instructor/SubjectController.php:149
 * @route '/instructor/classes/{class}/subjects/{subject}/copy'
 */
        copyForm.post = (args: { class: string | number, subject: string | number } | [classParam: string | number, subject: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: copy.url(args, options),
            method: 'post',
        })
    
    copy.form = copyForm
const subjects = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
copy: Object.assign(copy, copy),
assessments: Object.assign(assessments, assessments),
}

export default subjects