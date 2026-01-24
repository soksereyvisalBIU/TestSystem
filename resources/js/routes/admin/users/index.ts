import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserManagementController::role
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
export const role = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: role.url(args, options),
    method: 'patch',
})

role.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}/role',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::role
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
role.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return role.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::role
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
role.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: role.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::role
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
    const roleForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: role.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::role
 * @see app/Http/Controllers/Admin/UserManagementController.php:164
 * @route '/admin/users/{user}/role'
 */
        roleForm.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: role.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    role.form = roleForm
const users = {
    role: Object.assign(role, role),
}

export default users