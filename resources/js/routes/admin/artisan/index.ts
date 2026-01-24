import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::run
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
export const run = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(args, options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/admin/artisan/{command}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::run
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
run.url = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return run.definition.url
            .replace('{command}', parsedArgs.command.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::run
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
run.post = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::run
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
    const runForm = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: run.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemAdministratorController::run
 * @see app/Http/Controllers/Admin/SystemAdministratorController.php:19
 * @route '/admin/artisan/{command}'
 */
        runForm.post = (args: { command: string | number } | [command: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: run.url(args, options),
            method: 'post',
        })
    
    run.form = runForm
const artisan = {
    run: Object.assign(run, run),
}

export default artisan