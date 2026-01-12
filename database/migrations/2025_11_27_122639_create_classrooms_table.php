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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('visibility')->default('public');
            $table->string('code')->nullable()->unique();
            $table->text('cover')->nullable();
            $table->integer('creator_id')->nullable();

            // $table->tinyInteger('campus')->default(0)->comment('0=Main, 1=BT, 2=ToulKork, 3=TP');
            $table->tinyInteger('campus')->default(1)->comment('1=Campus1, 2=Campus2, 3=Campus3');
            $table->tinyInteger('faculty')->nullable()->comment('1=Campus1, 2=Campus2, 3=Campus3');
            $table->tinyInteger('major')->nullable()->comment('1=Campus1, 2=Campus2, 3=Campus3');
            $table->tinyInteger('batch')->nullable()->comment('1=Campus1, 2=Campus2, 3=Campus3');
            $table->tinyInteger('year')->nullable()->comment('1=Campus1, 2=Campus2, 3=Campus3');
            $table->tinyInteger('semester')->nullable()->comment('1=Campus1, 2=Campus2, 3=Campus3');
            $table->tinyInteger('shift')->nullable()->comment('1=morning, 2=afternoon, 3=evening, 4=weekend');
            $table->tinyInteger('room')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
