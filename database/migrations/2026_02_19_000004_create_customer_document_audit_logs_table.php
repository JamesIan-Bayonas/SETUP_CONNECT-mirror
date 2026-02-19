<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_document_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_business_document_id');
            $table->foreign('customer_business_document_id', 'cdal_document_fk')
                  ->references('id')->on('customer_business_documents')
                  ->cascadeOnDelete();
            $table->enum('action', ['uploaded', 're_uploaded', 'verified', 'rejected']);
            $table->string('status_before')->nullable();
            $table->string('status_after');
            $table->string('file_path')->nullable();
            $table->string('original_filename')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('performed_by')->nullable();
            $table->foreign('performed_by', 'cdal_performed_by_fk')
                  ->references('id')->on('users')
                  ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_document_audit_logs');
    }
};
