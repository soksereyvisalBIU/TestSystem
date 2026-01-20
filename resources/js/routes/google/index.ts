import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/auth/google',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GoogleController::login
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:55
 * @route '/auth/google/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

callback.definition = {
    methods: ["post"],
    url: '/auth/google/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:55
 * @route '/auth/google/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:55
 * @route '/auth/google/callback'
 */
callback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:55
 * @route '/auth/google/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: callback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:55
 * @route '/auth/google/callback'
 */
        callbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: callback.url(options),
            method: 'post',
        })
    
    callback.form = callbackForm
const google = {
    login: Object.assign(login, login),
callback: Object.assign(callback, callback),
}

export default google