import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import subjects from './subjects'
/**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/classes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ClassroomController::index
 * @see app/Http/Controllers/Student/ClassroomController.php:52
 * @route '/student/classes'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/student/classes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ClassroomController::create
 * @see app/Http/Controllers/Student/ClassroomController.php:128
 * @route '/student/classes/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Student\ClassroomController::store
 * @see app/Http/Controllers/Student/ClassroomController.php:136
 * @route '/student/classes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/student/classes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::store
 * @see app/Http/Controllers/Student/ClassroomController.php:136
 * @route '/student/classes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::store
 * @see app/Http/Controllers/Student/ClassroomController.php:136
 * @route '/student/classes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::store
 * @see app/Http/Controllers/Student/ClassroomController.php:136
 * @route '/student/classes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::store
 * @see app/Http/Controllers/Student/ClassroomController.php:136
 * @route '/student/classes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
export const show = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
show.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
show.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
show.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
    const showForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
        showForm.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ClassroomController::show
 * @see app/Http/Controllers/Student/ClassroomController.php:149
 * @route '/student/classes/{class}'
 */
        showForm.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
export const edit = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/student/classes/{class}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
edit.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
edit.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
edit.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
    const editForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
        editForm.get = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ClassroomController::edit
 * @see app/Http/Controllers/Student/ClassroomController.php:184
 * @route '/student/classes/{class}/edit'
 */
        editForm.head = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
export const update = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/student/classes/{class}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
update.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
update.put = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
update.patch = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
    const updateForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
        updateForm.put = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Student\ClassroomController::update
 * @see app/Http/Controllers/Student/ClassroomController.php:192
 * @route '/student/classes/{class}'
 */
        updateForm.patch = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Student\ClassroomController::destroy
 * @see app/Http/Controllers/Student/ClassroomController.php:200
 * @route '/student/classes/{class}'
 */
export const destroy = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/student/classes/{class}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::destroy
 * @see app/Http/Controllers/Student/ClassroomController.php:200
 * @route '/student/classes/{class}'
 */
destroy.url = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{class}', parsedArgs.class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::destroy
 * @see app/Http/Controllers/Student/ClassroomController.php:200
 * @route '/student/classes/{class}'
 */
destroy.delete = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::destroy
 * @see app/Http/Controllers/Student/ClassroomController.php:200
 * @route '/student/classes/{class}'
 */
    const destroyForm = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::destroy
 * @see app/Http/Controllers/Student/ClassroomController.php:200
 * @route '/student/classes/{class}'
 */
        destroyForm.delete = (args: { class: string | number } | [classParam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const classes = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
subjects: Object.assign(subjects, subjects),
}

export default classes