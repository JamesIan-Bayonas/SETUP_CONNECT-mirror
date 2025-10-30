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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();

            // Basic Information
            $table->string('name');
            $table->string('designation_position')->nullable();
            $table->text('residential_address')->nullable();
            $table->string('agency_firm')->nullable();
            $table->string('business_of_firm')->nullable();
            $table->string('product_line')->nullable();
            $table->string('type_of_organization')->nullable();
            $table->date('date_established')->nullable();
            $table->string('head_of_agency_firm')->nullable();
            $table->text('business_address')->nullable();
            $table->string('contact_nos')->nullable();
            $table->string('website_email')->nullable();

            // Type of Technical Assistance Sought
            $table->boolean('project_fund_setup_gia_rd')->default(false);
            $table->boolean('consultancy_services')->default(false);
            $table->boolean('packaging')->default(false);
            $table->boolean('labeling')->default(false);
            $table->boolean('laboratory_services')->default(false);
            $table->boolean('technical_training')->default(false);
            $table->text('other_services')->nullable();

            // Processing Information
            $table->string('accomplished_by')->nullable();
            $table->date('accomplished_date')->nullable();
            $table->text('remarks_action_taken')->nullable();
            $table->string('handled_by')->nullable();
            $table->date('handled_date')->nullable();
            $table->text('remarks_by_cpstd')->nullable();
            $table->string('noted_by')->nullable();
            $table->date('noted_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
