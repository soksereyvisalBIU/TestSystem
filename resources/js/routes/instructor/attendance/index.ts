import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/instructor/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:15
 * @route '/instructor/attendance'
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
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
export const qr = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/instructor/attendance/request',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
qr.url = (options?: RouteQueryOptions) => {
    return qr.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
qr.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
qr.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
    const qrForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: qr.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
        qrForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qr.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance/request'
 */
        qrForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qr.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    qr.form = qrForm
const attendance = {
    index: Object.assign(index, index),
qr: Object.assign(qr, qr),
}

export default attendance