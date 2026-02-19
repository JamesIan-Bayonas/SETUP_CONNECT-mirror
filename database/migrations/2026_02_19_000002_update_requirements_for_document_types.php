<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Clean slate: delete all existing requirements (user confirmed)
        DB::table('business_organization_type_requirements')->delete();

        Schema::table('business_organization_type_requirements', function (Blueprint $table) {
            $table->dropColumn('description');

            $table->unsignedBigInteger('document_type_id')
                ->after('business_organization_type_id');

            $table->foreign('document_type_id', 'req_doc_type_fk')
                ->references('id')
                ->on('document_types')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('business_organization_type_requirements', function (Blueprint $table) {
            $table->dropForeign('req_doc_type_fk');
            $table->dropColumn('document_type_id');
            $table->text('description')->default('');
        });
    }
};
