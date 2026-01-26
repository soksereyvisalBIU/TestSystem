import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AttendanceController::index
 * @see app/Http/Controllers/Student/AttendanceController.php:14
 * @route '/student/attendance'
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
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/student/attendance/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AttendanceController::create
 * @see app/Http/Controllers/Student/AttendanceController.php:22
 * @route '/student/attendance/create'
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
* @see \App\Http\Controllers\Student\AttendanceController::store
 * @see app/Http/Controllers/Student/AttendanceController.php:30
 * @route '/student/attendance'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/student/attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::store
 * @see app/Http/Controllers/Student/AttendanceController.php:30
 * @route '/student/attendance'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::store
 * @see app/Http/Controllers/Student/AttendanceController.php:30
 * @route '/student/attendance'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::store
 * @see app/Http/Controllers/Student/AttendanceController.php:30
 * @route '/student/attendance'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::store
 * @see app/Http/Controllers/Student/AttendanceController.php:30
 * @route '/student/attendance'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
export const show = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/attendance/{attendance}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
show.url = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance: args.attendance,
                }

    return show.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
show.get = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
show.head = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
    const showForm = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
        showForm.get = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AttendanceController::show
 * @see app/Http/Controllers/Student/AttendanceController.php:38
 * @route '/student/attendance/{attendance}'
 */
        showForm.head = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
export const edit = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/student/attendance/{attendance}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
edit.url = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance: args.attendance,
                }

    return edit.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
edit.get = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
edit.head = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
    const editForm = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
        editForm.get = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\AttendanceController::edit
 * @see app/Http/Controllers/Student/AttendanceController.php:46
 * @route '/student/attendance/{attendance}/edit'
 */
        editForm.head = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
export const update = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/student/attendance/{attendance}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
update.url = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance: args.attendance,
                }

    return update.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
update.put = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
update.patch = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
    const updateForm = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
        updateForm.put = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Student\AttendanceController::update
 * @see app/Http/Controllers/Student/AttendanceController.php:54
 * @route '/student/attendance/{attendance}'
 */
        updateForm.patch = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Student\AttendanceController::destroy
 * @see app/Http/Controllers/Student/AttendanceController.php:62
 * @route '/student/attendance/{attendance}'
 */
export const destroy = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/student/attendance/{attendance}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Student\AttendanceController::destroy
 * @see app/Http/Controllers/Student/AttendanceController.php:62
 * @route '/student/attendance/{attendance}'
 */
destroy.url = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance: args.attendance,
                }

    return destroy.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AttendanceController::destroy
 * @see app/Http/Controllers/Student/AttendanceController.php:62
 * @route '/student/attendance/{attendance}'
 */
destroy.delete = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Student\AttendanceController::destroy
 * @see app/Http/Controllers/Student/AttendanceController.php:62
 * @route '/student/attendance/{attendance}'
 */
    const destroyForm = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\AttendanceController::destroy
 * @see app/Http/Controllers/Student/AttendanceController.php:62
 * @route '/student/attendance/{attendance}'
 */
        destroyForm.delete = (args: { attendance: string | number } | [attendance: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const attendance = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default attendance