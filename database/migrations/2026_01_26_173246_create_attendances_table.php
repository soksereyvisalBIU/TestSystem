<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // database/migrations/2026_01_26_000004_create_attendances_table.php
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->integer('student_id');
            $table->integer('schedule_id');
            $table->timestamp('check_in_time')->useCurrent();
            $table->string('status'); // Present, Late, Absent
            $table->string('method')->default('QR_SCAN'); // QR or Manual
            $table->string('ip_address')->nullable(); // Security check
            $table->timestamps();
        });

        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->integer('teacher_subject_id')->nullable();
            $table->string('qr_token', 64);
            $table->string('class_code', 3); // 2–3 digits
            $table->timestamp('qr_expires_at');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('attendance_sessions');
    }
};
