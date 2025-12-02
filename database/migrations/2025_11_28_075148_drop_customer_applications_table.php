<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('customer_applications');
    }

    public function down(): void
    {
        Schema::create('customer_applications', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('designation_position');
            $table->text('residential_address');
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
            $table->enum('status', ['Pending', 'Approved', 'Declined'])->default('Pending');
            $table->timestamp('decision_date')->nullable();
            $table->unsignedBigInteger('decided_by')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
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
};

