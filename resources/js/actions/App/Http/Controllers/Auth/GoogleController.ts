import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/auth/google',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
    const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
        redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GoogleController::redirect
 * @see app/Http/Controllers/Auth/GoogleController.php:17
 * @route '/auth/google'
 */
        redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/auth/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GoogleController::callback
 * @see app/Http/Controllers/Auth/GoogleController.php:22
 * @route '/auth/google/callback'
 */
        callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
/**
* @see \App\Http\Controllers\Auth\GoogleController::handleCredential
 * @see app/Http/Controllers/Auth/GoogleController.php:68
 * @route '/auth/google/callback'
 */
export const handleCredential = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleCredential.url(options),
    method: 'post',
})

handleCredential.definition = {
    methods: ["post"],
    url: '/auth/google/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::handleCredential
 * @see app/Http/Controllers/Auth/GoogleController.php:68
 * @route '/auth/google/callback'
 */
handleCredential.url = (options?: RouteQueryOptions) => {
    return handleCredential.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::handleCredential
 * @see app/Http/Controllers/Auth/GoogleController.php:68
 * @route '/auth/google/callback'
 */
handleCredential.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleCredential.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::handleCredential
 * @see app/Http/Controllers/Auth/GoogleController.php:68
 * @route '/auth/google/callback'
 */
    const handleCredentialForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleCredential.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::handleCredential
 * @see app/Http/Controllers/Auth/GoogleController.php:68
 * @route '/auth/google/callback'
 */
        handleCredentialForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleCredential.url(options),
            method: 'post',
        })
    
    handleCredential.form = handleCredentialForm
/**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
export const showForcePassword = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showForcePassword.url(options),
    method: 'get',
})

showForcePassword.definition = {
    methods: ["get","head"],
    url: '/force-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
showForcePassword.url = (options?: RouteQueryOptions) => {
    return showForcePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
showForcePassword.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showForcePassword.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
showForcePassword.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showForcePassword.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
    const showForcePasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showForcePassword.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
        showForcePasswordForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showForcePassword.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GoogleController::showForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:94
 * @route '/force-password'
 */
        showForcePasswordForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showForcePassword.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showForcePassword.form = showForcePasswordForm
/**
* @see \App\Http\Controllers\Auth\GoogleController::storeForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:99
 * @route '/force-password'
 */
export const storeForcePassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForcePassword.url(options),
    method: 'post',
})

storeForcePassword.definition = {
    methods: ["post"],
    url: '/force-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\GoogleController::storeForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:99
 * @route '/force-password'
 */
storeForcePassword.url = (options?: RouteQueryOptions) => {
    return storeForcePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleController::storeForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:99
 * @route '/force-password'
 */
storeForcePassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForcePassword.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleController::storeForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:99
 * @route '/force-password'
 */
    const storeForcePasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeForcePassword.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleController::storeForcePassword
 * @see app/Http/Controllers/Auth/GoogleController.php:99
 * @route '/force-password'
 */
        storeForcePasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeForcePassword.url(options),
            method: 'post',
        })
    
    storeForcePassword.form = storeForcePasswordForm
const GoogleController = { redirect, callback, handleCredential, showForcePassword, storeForcePassword }

export default GoogleController