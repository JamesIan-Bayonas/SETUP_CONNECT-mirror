<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tna_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manifestation_of_intent_id')
                ->constrained('manifestation_of_intents')
                ->cascadeOnDelete();
            $table->foreignId('setup_customer_id')
                ->constrained('setup_customers')
                ->cascadeOnDelete();

            $table->dateTime('scheduled_date');
            $table->string('location');

            // Staff member who will conduct the TNA
            $table->foreignId('conducted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->enum('status', ['scheduled', 'completed', 'cancelled'])
                ->default('scheduled');
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tna_schedules');
    }
};
