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
            // Add new email_address and website columns
            $table->string('email_address')->after('contact_nos');
            $table->string('website')->nullable()->after('email_address');
            
            // Drop the old combined field
            $table->dropColumn('website_email_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_applications', function (Blueprint $table) {
            // Restore the old combined field
            $table->string('website_email_address')->after('contact_nos');
            
            // Drop the new fields
            $table->dropColumn(['email_address', 'website']);
        });
    }
};
