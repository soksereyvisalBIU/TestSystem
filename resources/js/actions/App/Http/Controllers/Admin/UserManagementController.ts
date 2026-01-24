import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/user-management',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:50
 * @route '/admin/user-management'
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
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/user-management/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/create'
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
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:66
 * @route '/admin/user-management'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/user-management',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:66
 * @route '/admin/user-management'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:66
 * @route '/admin/user-management'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:66
 * @route '/admin/user-management'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:66
 * @route '/admin/user-management'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
export const show = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/user-management/{user_management}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
show.url = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_management: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user_management: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user_management: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user_management: typeof args.user_management === 'object'
                ? args.user_management.id
                : args.user_management,
                }

    return show.definition.url
            .replace('{user_management}', parsedArgs.user_management.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
show.get = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
show.head = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
    const showForm = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
        showForm.get = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:86
 * @route '/admin/user-management/{user_management}'
 */
        showForm.head = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
export const edit = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/user-management/{user_management}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
edit.url = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_management: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user_management: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user_management: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user_management: typeof args.user_management === 'object'
                ? args.user_management.id
                : args.user_management,
                }

    return edit.definition.url
            .replace('{user_management}', parsedArgs.user_management.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
edit.get = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
edit.head = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
    const editForm = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
        editForm.get = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:124
 * @route '/admin/user-management/{user_management}/edit'
 */
        editForm.head = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
export const update = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/user-management/{user_management}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
update.url = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_management: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user_management: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user_management: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user_management: typeof args.user_management === 'object'
                ? args.user_management.id
                : args.user_management,
                }

    return update.definition.url
            .replace('{user_management}', parsedArgs.user_management.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
update.put = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
update.patch = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
    const updateForm = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
        updateForm.put = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:131
 * @route '/admin/user-management/{user_management}'
 */
        updateForm.patch = (args: { user_management: number | { id: number } } | [user_management: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/{user_management}'
 */
export const destroy = (args: { user_management: string | number } | [user_management: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/user-management/{user_management}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/{user_management}'
 */
destroy.url = (args: { user_management: string | number } | [user_management: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_management: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user_management: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user_management: args.user_management,
                }

    return destroy.definition.url
            .replace('{user_management}', parsedArgs.user_management.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/{user_management}'
 */
destroy.delete = (args: { user_management: string | number } | [user_management: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/{user_management}'
 */
    const destroyForm = (args: { user_management: string | number } | [user_management: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:0
 * @route '/admin/user-management/{user_management}'
 */
        destroyForm.delete = (args: { user_management: string | number } | [user_management: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::bulkDestroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:189
 * @route '/admin/users/bulk-delete'
 */
export const bulkDestroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

bulkDestroy.definition = {
    methods: ["post"],
    url: '/admin/users/bulk-delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::bulkDestroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:189
 * @route '/admin/users/bulk-delete'
 */
bulkDestroy.url = (options?: RouteQueryOptions) => {
    return bulkDestroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::bulkDestroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:189
 * @route '/admin/users/bulk-delete'
 */
bulkDestroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::bulkDestroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:189
 * @route '/admin/users/bulk-delete'
 */
    const bulkDestroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkDestroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::bulkDestroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:189
 * @route '/admin/users/bulk-delete'
 */
        bulkDestroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkDestroy.url(options),
            method: 'post',
        })
    
    bulkDestroy.form = bulkDestroyForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::updateRole
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
export const updateRole = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

updateRole.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}/role',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::updateRole
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
updateRole.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return updateRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::updateRole
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
updateRole.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::updateRole
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
    const updateRoleForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRole.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::updateRole
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
        updateRoleForm.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRole.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateRole.form = updateRoleForm
const UserManagementController = { index, create, store, show, edit, update, destroy, bulkDestroy, updateRole }

export default UserManagementController