<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('setup_customer_businesses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('setup_customer_id');
            $table->string('name_of_agency_firm');
            $table->string('business_of_the_firm');
            $table->string('product_line');
            $table->string('type_of_organization');
            $table->date('date_established');
            $table->string('name_of_head_of_agency_firm');
            $table->text('business_address');
            $table->timestamps();

            $table->foreign('setup_customer_id')
                  ->references('id')->on('setup_customers')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('setup_customer_businesses');
    }
};

