<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('setup_customers', function (Blueprint $table) {
            if (!Schema::hasColumn('setup_customers', 'status')) {
                $table->enum('status', ['Pending', 'Approved', 'Declined'])->default('Pending')->after('website');
            }
            if (!Schema::hasColumn('setup_customers', 'decision_date')) {
                $table->timestamp('decision_date')->nullable()->after('status');
            }
            if (!Schema::hasColumn('setup_customers', 'decided_by')) {
                $table->unsignedBigInteger('decided_by')->nullable()->after('decision_date');
                $table->foreign('decided_by')->references('id')->on('users')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('setup_customers', function (Blueprint $table) {
            if (Schema::hasColumn('setup_customers', 'decided_by')) {
                $table->dropForeign(['decided_by']);
                $table->dropColumn('decided_by');
            }
            if (Schema::hasColumn('setup_customers', 'decision_date')) {
                $table->dropColumn('decision_date');
            }
            if (Schema::hasColumn('setup_customers', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
