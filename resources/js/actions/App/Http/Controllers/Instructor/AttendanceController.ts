import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
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
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
 * @route '/instructor/attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
 * @route '/instructor/attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
 * @route '/instructor/attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
 * @route '/instructor/attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
 * @route '/instructor/attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::index
 * @see app/Http/Controllers/Instructor/AttendanceController.php:13
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
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
export const show = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/instructor/attendance/session/{session}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
show.url = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: args.session,
                }

    return show.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
show.get = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
show.head = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
    const showForm = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
        showForm.get = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Instructor\AttendanceController::show
 * @see app/Http/Controllers/Instructor/AttendanceController.php:38
 * @route '/instructor/attendance/session/{session}'
 */
        showForm.head = (args: { session: string | number } | [session: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const AttendanceController = { index, show }

export default AttendanceController