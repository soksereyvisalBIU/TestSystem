import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clear
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/admin/logs/clear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clear
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clear
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clear
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
    const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clear
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
        clearForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url(options),
            method: 'post',
        })
    
    clear.form = clearForm
/**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
export const size = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: size.url(options),
    method: 'get',
})

size.definition = {
    methods: ["get","head"],
    url: '/admin/logs/size',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
size.url = (options?: RouteQueryOptions) => {
    return size.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
size.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: size.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
size.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: size.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
    const sizeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: size.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
        sizeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: size.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:224
 * @route '/admin/logs/size'
 */
        sizeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: size.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    size.form = sizeForm
const logs = {
    clear: Object.assign(clear, clear),
size: Object.assign(size, size),
}

export default logs