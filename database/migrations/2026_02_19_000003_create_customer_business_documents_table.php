<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_business_documents', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('setup_customer_business_id');
            $table->foreign('setup_customer_business_id', 'cbd_business_fk')
                ->references('id')
                ->on('setup_customer_businesses')
                ->onDelete('cascade');

            $table->unsignedBigInteger('requirement_id');
            $table->foreign('requirement_id', 'cbd_requirement_fk')
                ->references('id')
                ->on('business_organization_type_requirements')
                ->onDelete('cascade');

            $table->string('file_path')->nullable();
            $table->string('original_filename')->nullable();
            $table->enum('status', ['pending', 'submitted', 'verified', 'rejected'])->default('pending');
            $table->text('remarks')->nullable();

            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->foreign('uploaded_by', 'cbd_uploaded_by_fk')
                ->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('verified_by')->nullable();
            $table->foreign('verified_by', 'cbd_verified_by_fk')
                ->references('id')->on('users')->onDelete('set null');

            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            // One record per business per requirement
            $table->unique(
                ['setup_customer_business_id', 'requirement_id'],
                'cbd_unique_biz_req'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_business_documents');
    }
};
