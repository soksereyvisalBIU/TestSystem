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
        // Schema::create('questions', function (Blueprint $table) {
        //     $table->id();
        //     $table->integer('assessment_id')->nullable();
        //     $table->text('question_text');
        //     $table->string('type'); // true_false, multiple_choice, etc.
        //     $table->decimal('point', 8, 2)->default(0);
        //     $table->boolean('allow_file_upload')->default(false);
        //     $table->boolean('allow_code_submission')->default(false);

        //     $table->integer('order')->nullable();
        //     $table->integer('section_id')->nullable();

        //     $table->text('images')->nullable(); // JSON array of image URLs
        //     $table->string('accepted_file_types')->nullable(); // Comma-separated list of accepted file types
        //     $table->integer('max_file_size')->nullable(); // in mb



        //     $table->timestamps();
        // });

        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->integer('assessment_id');

            $table->text('question_text');
            $table->string('type');
            // $table->enum('type', [
            //     'true_false',
            //     'multiple_choice',
            //     'short_answer',
            //     'matching',
            //     'essay',
            //     'file_upload',
            //     'code'
            // ]);

            $table->decimal('point', 8, 2)->default(0);

            $table->integer('order')->nullable();
            $table->integer('section_id')->nullable();

            $table->timestamps();
        });
        Schema::create('question_media', function (Blueprint $table) {
            $table->id();
            $table->integer('question_id');

            $table->string('type'); // image, video, audio
            $table->string('path');

            $table->timestamps();
        });

        Schema::create('question_submission_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('question_id');

            $table->boolean('allow_file_upload')->default(false);
            $table->boolean('allow_code_submission')->default(false);

            $table->string('accepted_file_types')->nullable();
            $table->integer('max_file_size')->nullable(); // MB

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
        Schema::dropIfExists('question_media');
        Schema::dropIfExists('question_submission_settings');
    }
};
