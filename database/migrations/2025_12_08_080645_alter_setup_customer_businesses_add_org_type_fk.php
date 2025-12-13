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
        Schema::table('setup_customer_businesses', function (Blueprint $table) {
            $table->dropColumn('type_of_organization');

            $table->foreignId('business_organization_type_id')
                  ->constrained('business_organization_types')
                  ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('setup_customer_businesses', function (Blueprint $table) {
            $table->dropForeign(['business_organization_type_id']);
            $table->dropColumn('business_organization_type_id');
            $table->string('type_of_organization');
        });
    }
};
