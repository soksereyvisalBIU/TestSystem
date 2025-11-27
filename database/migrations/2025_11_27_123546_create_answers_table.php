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
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->integer('attempt_id')->nullable();
            $table->integer('question_id')->nullable();
            $table->integer('option_id')->nullable();
            $table->integer('selected_option_id')->nullable();
            $table->text('answer_text')->nullable();
            $table->string('code_language')->nullable();
            $table->decimal('points_earned', 8, 2)->nullable();

            $table->timestamps();
        });

        Schema::create('answer_files', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('answer_id')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->bigInteger('file_size')->nullable();
            $table->timestamp('uploaded_at')->useCurrent();
        });

        // ASSESSMENT ANSWER HISTORY
        Schema::create('answer_history', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('attempt_id')->nullable();
            $table->integer('question_id')->nullable();
            $table->integer('option_id')->nullable()->nullable();
            $table->text('answer_text')->nullable();
            $table->string('code_language')->nullable();
            $table->decimal('points_earned', 8, 2)->nullable();
            $table->integer('version_number')->default(1);
            $table->string('status')->default('draft'); // autosaved, draft, submitted
            $table->timestamp('saved_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
        Schema::dropIfExists('answer_files');
        Schema::dropIfExists('answer_history');
    }
};
