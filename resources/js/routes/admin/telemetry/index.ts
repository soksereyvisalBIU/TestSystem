import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
export const system = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system.url(options),
    method: 'get',
})

system.definition = {
    methods: ["get","head"],
    url: '/admin/telemetry/system',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
system.url = (options?: RouteQueryOptions) => {
    return system.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
system.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
system.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: system.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
    const systemForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: system.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
        systemForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: system.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::system
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:65
 * @route '/admin/telemetry/system'
 */
        systemForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: system.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    system.form = systemForm
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
export const db = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: db.url(options),
    method: 'get',
})

db.definition = {
    methods: ["get","head"],
    url: '/admin/telemetry/database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
db.url = (options?: RouteQueryOptions) => {
    return db.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
db.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: db.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
db.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: db.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
    const dbForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: db.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
        dbForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: db.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::db
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/telemetry/database'
 */
        dbForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: db.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    db.form = dbForm
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
export const storage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: storage.url(options),
    method: 'get',
})

storage.definition = {
    methods: ["get","head"],
    url: '/admin/telemetry/storage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
storage.url = (options?: RouteQueryOptions) => {
    return storage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
storage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: storage.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
storage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: storage.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
    const storageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: storage.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
        storageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: storage.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/telemetry/storage'
 */
        storageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: storage.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    storage.form = storageForm
const telemetry = {
    system: Object.assign(system, system),
db: Object.assign(db, db),
storage: Object.assign(storage, storage),
}

export default telemetry