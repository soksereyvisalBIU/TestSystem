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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();

            $table->integer('attendance_session_id')->nullable();
            $table->integer('student_id')->nullable();
            $table->timestamp('scanned_at');
            $table->string('ip_address');
            $table->enum('status', ['present', 'late', 'permission', 'absent'])->default('absent');
            $table->timestamps();
        });

        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->integer('teacher_subject_id')->nullable();
            $table->string('qr_token', 64);
            $table->string('class_code', 3); // 2–3 digits
            $table->timestamp('qr_expires_at');
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });


        Schema::create('attendance_logs', function ($table) {
            $table->id();
            $table->uuid('session_id');
            $table->integer('student_id');
            $table->timestamp('checked_in_at');
            $table->string('distance')->nullable();
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
        Schema::dropIfExists('attendance_logs');
    }
};
