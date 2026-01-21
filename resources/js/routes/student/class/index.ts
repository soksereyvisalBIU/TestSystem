import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\ClassroomController::join
 * @see app/Http/Controllers/Student/ClassroomController.php:223
 * @route '/student/join-class'
 */
export const join = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: join.url(options),
    method: 'post',
})

join.definition = {
    methods: ["post"],
    url: '/student/join-class',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ClassroomController::join
 * @see app/Http/Controllers/Student/ClassroomController.php:223
 * @route '/student/join-class'
 */
join.url = (options?: RouteQueryOptions) => {
    return join.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ClassroomController::join
 * @see app/Http/Controllers/Student/ClassroomController.php:223
 * @route '/student/join-class'
 */
join.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: join.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\ClassroomController::join
 * @see app/Http/Controllers/Student/ClassroomController.php:223
 * @route '/student/join-class'
 */
    const joinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: join.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ClassroomController::join
 * @see app/Http/Controllers/Student/ClassroomController.php:223
 * @route '/student/join-class'
 */
        joinForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: join.url(options),
            method: 'post',
        })
    
    join.form = joinForm
const classMethod = {
    join: Object.assign(join, join),
}

export default classMethod