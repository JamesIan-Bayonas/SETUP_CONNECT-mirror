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
        Schema::create('setup_customer_businesses', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key
            $table->foreignId('setup_customer_id')->constrained('setup_customers')->onDelete('cascade');
            
            // Business Information
            $table->string('name_of_agency_firm');
            $table->string('business_of_the_firm');
            $table->string('product_line');
            $table->string('type_of_organization');
            $table->date('date_established');
            $table->string('name_of_head_of_agency_firm');
            $table->text('business_address');
            $table->string('contact_nos');
            $table->string('email_address');
            $table->string('website')->nullable();
            
            // Metadata
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->index('setup_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setup_customer_businesses');
    }
};
