<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('place_id')->nullable()->constrained('places')->onDelete('SET NULL');
            $table->foreignId('tag_id')->nullable()->constrained('tags')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropForeign(['place_id']);
            $table->dropForeign(['tag_id']);
            $table->dropColumn(['place_id', 'tag_id']);
        });
    }
};
