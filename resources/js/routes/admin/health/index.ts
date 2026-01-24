import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
export const storage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: storage.url(options),
    method: 'get',
})

storage.definition = {
    methods: ["get","head"],
    url: '/admin/health/storage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
storage.url = (options?: RouteQueryOptions) => {
    return storage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
storage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: storage.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
storage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: storage.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
    const storageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: storage.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
 */
        storageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: storage.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::storage
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:128
 * @route '/admin/health/storage'
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
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
export const database = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: database.url(options),
    method: 'get',
})

database.definition = {
    methods: ["get","head"],
    url: '/admin/health/database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
database.url = (options?: RouteQueryOptions) => {
    return database.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
database.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: database.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
database.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: database.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
    const databaseForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: database.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
        databaseForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: database.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::database
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:94
 * @route '/admin/health/database'
 */
        databaseForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: database.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    database.form = databaseForm
const health = {
    storage: Object.assign(storage, storage),
database: Object.assign(database, database),
}

export default health