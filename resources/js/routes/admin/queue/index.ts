import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:207
 * @route '/admin/queue/restart'
 */
export const restart = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restart.url(options),
    method: 'post',
})

restart.definition = {
    methods: ["post"],
    url: '/admin/queue/restart',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:207
 * @route '/admin/queue/restart'
 */
restart.url = (options?: RouteQueryOptions) => {
    return restart.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:207
 * @route '/admin/queue/restart'
 */
restart.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restart.url(options),
    method: 'post',
})

    /**
 * @see routes/web.php:207
 * @route '/admin/queue/restart'
 */
    const restartForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restart.url(options),
        method: 'post',
    })

            /**
 * @see routes/web.php:207
 * @route '/admin/queue/restart'
 */
        restartForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restart.url(options),
            method: 'post',
        })
    
    restart.form = restartForm
/**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
export const failed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})

failed.definition = {
    methods: ["get","head"],
    url: '/admin/queue/failed',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
failed.url = (options?: RouteQueryOptions) => {
    return failed.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
failed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
failed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: failed.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
    const failedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: failed.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
        failedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:212
 * @route '/admin/queue/failed'
 */
        failedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    failed.form = failedForm
/**
 * @see routes/web.php:216
 * @route '/admin/queue/flush'
 */
export const flush = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flush.url(options),
    method: 'post',
})

flush.definition = {
    methods: ["post"],
    url: '/admin/queue/flush',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:216
 * @route '/admin/queue/flush'
 */
flush.url = (options?: RouteQueryOptions) => {
    return flush.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:216
 * @route '/admin/queue/flush'
 */
flush.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flush.url(options),
    method: 'post',
})

    /**
 * @see routes/web.php:216
 * @route '/admin/queue/flush'
 */
    const flushForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: flush.url(options),
        method: 'post',
    })

            /**
 * @see routes/web.php:216
 * @route '/admin/queue/flush'
 */
        flushForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: flush.url(options),
            method: 'post',
        })
    
    flush.form = flushForm
const queue = {
    restart: Object.assign(restart, restart),
failed: Object.assign(failed, failed),
flush: Object.assign(flush, flush),
}

export default queue