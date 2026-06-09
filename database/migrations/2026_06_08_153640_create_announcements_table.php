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
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Prevents auto-increment enumeration exploits
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The author
            $table->string('title');
            $table->text('content');
            $table->string('priority')->default('normal'); // critical, high, normal, low
            $table->string('target_role')->default('all'); // admin, cooperator, applicant, all
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('expires_at')->nullable(); // Self-expiring notices
            $table->timestamps();

            // Index optimized for dashboard filter streams
            $table->index(['target_role', 'is_pinned', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};