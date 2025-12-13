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
        Schema::table('customer_applications', function (Blueprint $table) {
            $table->unsignedBigInteger('business_organization_type_id')
                  ->after('product_line'); 

            $table->foreign('business_organization_type_id')
                  ->references('id')
                  ->on('business_organization_types')
                  ->onDelete('cascade');
            
            $table->dropColumn('type_of_organization');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_applications', function (Blueprint $table) {
            Schema::table('customer_applications', function (Blueprint $table) {
                $table->dropForeign(['business_organization_type_id']);
                $table->dropColumn('business_organization_type_id');

                $table->string('type_of_organization');  // or with your original definition
            });
        });
    }
};
