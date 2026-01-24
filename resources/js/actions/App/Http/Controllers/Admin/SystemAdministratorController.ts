import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
const getStorageHealthb6c9c8062b63f1928cc133a12a3b066d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url(options),
    method: 'get',
})

getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.definition = {
    methods: ["get","head"],
    url: '/admin/health/storage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url = (options?: RouteQueryOptions) => {
    return getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
    const getStorageHealthb6c9c8062b63f1928cc133a12a3b066dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
        getStorageHealthb6c9c8062b63f1928cc133a12a3b066dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
        getStorageHealthb6c9c8062b63f1928cc133a12a3b066dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStorageHealthb6c9c8062b63f1928cc133a12a3b066d.form = getStorageHealthb6c9c8062b63f1928cc133a12a3b066dForm
    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
const getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url(options),
    method: 'get',
})

getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.definition = {
    methods: ["get","head"],
    url: '/admin/telemetry/storage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url = (options?: RouteQueryOptions) => {
    return getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
    const getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
        getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getStorageHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
        getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf.form = getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdfForm

export const getStorageHealth = {
    '/admin/health/storage': getStorageHealthb6c9c8062b63f1928cc133a12a3b066d,
    '/admin/telemetry/storage': getStorageHealth76a8dbc8eb63a26273fdb2bdc280bbdf,
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
const getDatabaseHealth2614af10ea349032caf244d8d556f527 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDatabaseHealth2614af10ea349032caf244d8d556f527.url(options),
    method: 'get',
})

getDatabaseHealth2614af10ea349032caf244d8d556f527.definition = {
    methods: ["get","head"],
    url: '/admin/health/database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
getDatabaseHealth2614af10ea349032caf244d8d556f527.url = (options?: RouteQueryOptions) => {
    return getDatabaseHealth2614af10ea349032caf244d8d556f527.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
getDatabaseHealth2614af10ea349032caf244d8d556f527.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDatabaseHealth2614af10ea349032caf244d8d556f527.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
getDatabaseHealth2614af10ea349032caf244d8d556f527.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDatabaseHealth2614af10ea349032caf244d8d556f527.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
    const getDatabaseHealth2614af10ea349032caf244d8d556f527Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDatabaseHealth2614af10ea349032caf244d8d556f527.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
        getDatabaseHealth2614af10ea349032caf244d8d556f527Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDatabaseHealth2614af10ea349032caf244d8d556f527.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
        getDatabaseHealth2614af10ea349032caf244d8d556f527Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDatabaseHealth2614af10ea349032caf244d8d556f527.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDatabaseHealth2614af10ea349032caf244d8d556f527.form = getDatabaseHealth2614af10ea349032caf244d8d556f527Form
    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
const getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url(options),
    method: 'get',
})

getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.definition = {
    methods: ["get","head"],
    url: '/admin/telemetry/database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url = (options?: RouteQueryOptions) => {
    return getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
    const getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3baForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
        getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3baForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getDatabaseHealth
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
        getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3baForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba.form = getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3baForm

export const getDatabaseHealth = {
    '/admin/health/database': getDatabaseHealth2614af10ea349032caf244d8d556f527,
    '/admin/telemetry/database': getDatabaseHealth9914d63b25b1c5961bcb3acf4464e3ba,
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
export const getSystemInfo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSystemInfo.url(options),
    method: 'get',
})

getSystemInfo.definition = {
    methods: ["get","head"],
    url: '/admin/telemetry/system',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
getSystemInfo.url = (options?: RouteQueryOptions) => {
    return getSystemInfo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
getSystemInfo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSystemInfo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
getSystemInfo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSystemInfo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
    const getSystemInfoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSystemInfo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
        getSystemInfoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSystemInfo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::getSystemInfo
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
        getSystemInfoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSystemInfo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSystemInfo.form = getSystemInfoForm
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clearLogs
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
export const clearLogs = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearLogs.url(options),
    method: 'post',
})

clearLogs.definition = {
    methods: ["post"],
    url: '/admin/logs/clear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clearLogs
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
clearLogs.url = (options?: RouteQueryOptions) => {
    return clearLogs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clearLogs
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
clearLogs.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearLogs.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clearLogs
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
    const clearLogsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clearLogs.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::clearLogs
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:154
 * @route '/admin/logs/clear'
 */
        clearLogsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clearLogs.url(options),
            method: 'post',
        })
    
    clearLogs.form = clearLogsForm
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::runArtisan
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
export const runArtisan = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runArtisan.url(args, options),
    method: 'post',
})

runArtisan.definition = {
    methods: ["post"],
    url: '/admin/artisan/{command}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::runArtisan
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
runArtisan.url = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { command: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    command: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        command: args.command,
                }

    return runArtisan.definition.url
            .replace('{command}', parsedArgs.command.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::runArtisan
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
runArtisan.post = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runArtisan.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::runArtisan
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
    const runArtisanForm = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: runArtisan.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::runArtisan
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
        runArtisanForm.post = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: runArtisan.url(args, options),
            method: 'post',
        })
    
    runArtisan.form = runArtisanForm
const SystemAdministratorController = { getStorageHealth, getDatabaseHealth, getSystemInfo, clearLogs, runArtisan }

export default SystemAdministratorController