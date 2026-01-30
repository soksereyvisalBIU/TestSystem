import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
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
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
 * @route '/instructor/attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:20
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
 * @see app/Http/Controllers/Instructor/AttendanceController.php:56
 * @route '/instructor/attendance/request'
 */
export const qr = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: qr.url(options),
    method: 'post',
})

qr.definition = {
    methods: ["post"],
    url: '/instructor/attendance/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:56
 * @route '/instructor/attendance/request'
 */
qr.url = (options?: RouteQueryOptions) => {
    return qr.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:56
 * @route '/instructor/attendance/request'
 */
qr.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: qr.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:56
 * @route '/instructor/attendance/request'
 */
    const qrForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: qr.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::qr
 * @see app/Http/Controllers/Instructor/AttendanceController.php:56
 * @route '/instructor/attendance/request'
 */
        qrForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: qr.url(options),
            method: 'post',
        })
    
    qr.form = qrForm
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
export const requestStudent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requestStudent.url(options),
    method: 'get',
})

requestStudent.definition = {
    methods: ["get","head"],
    url: '/instructor/attendance/request-student',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
requestStudent.url = (options?: RouteQueryOptions) => {
    return requestStudent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
requestStudent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requestStudent.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
requestStudent.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requestStudent.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
    const requestStudentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: requestStudent.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
        requestStudentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requestStudent.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::requestStudent
 * @see app/Http/Controllers/Instructor/AttendanceController.php:35
 * @route '/instructor/attendance/request-student'
 */
        requestStudentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requestStudent.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    requestStudent.form = requestStudentForm
const attendance = {
    index: Object.assign(index, index),
qr: Object.assign(qr, qr),
requestStudent: Object.assign(requestStudent, requestStudent),
}

export default attendance