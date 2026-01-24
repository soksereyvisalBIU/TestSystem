<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class SystemAdministratorController extends Controller
{
    /**
     * --------------------------------------------------------------------------
     * Run Whitelisted Artisan Commands
     * --------------------------------------------------------------------------
     */
    public function runArtisan(string $command): JsonResponse
    {
        $whitelist = [
            'optimize'        => ['optimize'],
            'optimize-clear' => ['optimize:clear'],
            'cache-clear'    => ['cache:clear'],
            'config-cache'   => ['config:cache'],
            'route-cache'    => ['route:cache'],
            'migrate'        => ['migrate', '--force' => true],
            'queue-restart'  => ['queue:restart'],
            'queue-flush'    => ['queue:flush'],
        ];

        abort_unless(isset($whitelist[$command]), 403, 'Unauthorized command');

        Log::warning('Admin Artisan Action', [
            'user_id' => auth()->id(),
            'command' => $command,
            'ip' => request()->ip(),
        ]);

        Artisan::call(...$this->normalizeArtisanArgs($whitelist[$command]));

        return response()->json([
            'status' => 'success',
            'message' => "Command [$command] executed successfully",
        ]);
    }

    /**
     * Normalize artisan arguments
     */
    private function normalizeArtisanArgs(array $args): array
    {
        if (count($args) === 1) {
            return [$args[0]];
        }

        return [$args[0], array_slice($args, 1, null, true)];
    }

    /**
     * --------------------------------------------------------------------------
     * System Telemetry
     * --------------------------------------------------------------------------
     */
    public function getSystemInfo(): JsonResponse
    {
        return response()->json([
            'engine' => [
                'php' => PHP_VERSION,
                'opcache' => $this->opcacheEnabled(),
            ],
            'hardware' => [
                'load' => function_exists('sys_getloadavg')
                    ? sys_getloadavg()
                    : [0, 0, 0],
                'memory_usage' => $this->formatBytes(memory_get_usage(true)),
            ],
            'app' => [
                'env' => app()->environment(),
                'debug' => config('app.debug'),
                'cached' => app()->configurationIsCached(),
            ],
            'server' => [
                'os' => PHP_OS_FAMILY,
            ],
        ]);
    }

    /**
     * --------------------------------------------------------------------------
     * Database Health
     * --------------------------------------------------------------------------
     */
    public function getDatabaseHealth(): JsonResponse
    {
        $connection = DB::connection();
        $dbName = $connection->getDatabaseName();

        $size = DB::selectOne(
            'SELECT SUM(data_length + index_length) AS size 
             FROM information_schema.TABLES 
             WHERE table_schema = ?',
            [$dbName]
        );

        return response()->json([
            'size_mb' => round(($size->size ?? 0) / 1024 / 1024, 2),
            'open_connections' => $this->getDbConnections(),
            'connection' => $dbName,
            'driver' => DB::getDriverName(),
        ]);
    }

    private function getDbConnections(): int
    {
        try {
            return (int) DB::selectOne('SHOW STATUS WHERE variable_name = "Threads_connected"')->Value;
        } catch (\Throwable) {
            return 0;
        }
    }

    /**
     * --------------------------------------------------------------------------
     * Storage Health
     * --------------------------------------------------------------------------
     */
    public function getStorageHealth(): JsonResponse
    {
        $paths = [
            'storage' => storage_path(),
            'cache' => base_path('bootstrap/cache'),
            'logs' => storage_path('logs'),
            'public_storage' => public_path('storage'),
        ];

        $data = collect($paths)->map(fn ($path) => [
            'path' => $path,
            'exists' => File::exists($path),
            'writable' => File::isWritable($path),
            'size' => File::exists($path)
                ? $this->formatBytes($this->directorySize($path))
                : '0 B',
        ]);

        return response()->json($data);
    }

    /**
     * --------------------------------------------------------------------------
     * Clear Logs
     * --------------------------------------------------------------------------
     */
    public function clearLogs(): JsonResponse
    {
        $logFile = storage_path('logs/laravel.log');

        if (File::exists($logFile)) {
            File::put($logFile, '');
        }

        Log::notice('Admin cleared application logs', [
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Logs cleared',
        ]);
    }

    /**
     * --------------------------------------------------------------------------
     * Helpers
     * --------------------------------------------------------------------------
     */
    private function opcacheEnabled(): bool
    {
        return function_exists('opcache_get_status')
            ? (bool) (opcache_get_status(false)['opcache_enabled'] ?? false)
            : false;
    }

    private function directorySize(string $path): int
    {
        if (is_file($path)) {
            return filesize($path);
        }

        $size = 0;
        foreach (File::allFiles($path) as $file) {
            $size += $file->getSize();
        }

        return $size;
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        return round($bytes / (1024 ** $pow), $precision) . ' ' . $units[$pow];
    }
}
