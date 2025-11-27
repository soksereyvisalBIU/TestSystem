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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->integer('assessment_id')->nullable();
            $table->text('question_text');
            $table->string('type'); // true_false, multiple_choice, etc.
            $table->decimal('point', 8, 2)->default(0);
            $table->boolean('allow_file_upload')->default(false);
            $table->boolean('allow_code_submission')->default(false);

            $table->integer('order')->nullable();
            $table->integer('section_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
