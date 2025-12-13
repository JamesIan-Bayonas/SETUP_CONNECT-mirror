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
        Schema::create('business_organization_type_requirements', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('business_organization_type_id');
            $table->foreign(
                'business_organization_type_id',
                'business_org_type_req_fk'
            )->references('id')
            ->on('business_organization_types')
            ->onDelete('cascade');

            $table->text('description');
            $table->boolean('require_attachment')->default(false);

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_organization_type_requirements');
    }
};
