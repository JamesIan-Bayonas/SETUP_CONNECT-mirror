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
            $table->enum('status', ['Pending', 'Approved', 'Declined'])
                  ->default('Pending')
                  ->after('website');
            $table->timestamp('decision_date')->nullable()->after('status');
            $table->unsignedBigInteger('decided_by')->nullable()->after('decision_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_applications', function (Blueprint $table) {
            $table->dropColumn(['status', 'decision_date', 'decided_by']);
        });
    }
};
