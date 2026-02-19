<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manifestation_of_intents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('setup_customer_id')
                ->constrained('setup_customers')
                ->cascadeOnDelete();
            $table->foreignId('setup_customer_business_id')
                ->constrained('setup_customer_businesses')
                ->cascadeOnDelete();

            // Status workflow: pending_upload → uploaded → acknowledged
            $table->enum('status', ['pending_upload', 'uploaded', 'acknowledged'])
                ->default('pending_upload');

            // Intervention checkboxes (stored as JSON array of string keys)
            $table->json('interventions')->nullable();
            $table->string('other_intervention')->nullable();
            $table->string('training_specify')->nullable();

            // Proponent details filled when uploading
            $table->string('proponent_name')->nullable();
            $table->date('proponent_date')->nullable();
            $table->string('proponent_address')->nullable();
            $table->string('proponent_contact')->nullable();

            // Uploaded signed form
            $table->string('signed_file_path')->nullable();
            $table->string('original_filename')->nullable();
            $table->timestamp('uploaded_at')->nullable();

            // Staff acknowledgement
            $table->foreignId('acknowledged_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('acknowledged_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manifestation_of_intents');
    }
};
