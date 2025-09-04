<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('geocodes', function (Blueprint $table) {
            $table->decimal('north', 10, 7)->nullable()->after('language');
            $table->decimal('south', 10, 7)->nullable()->after('north');
            $table->decimal('east', 10, 7)->nullable()->after('south');
            $table->decimal('west', 10, 7)->nullable()->after('east');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geocodes', function (Blueprint $table) {
            $table->dropColumn(['north', 'south', 'east', 'west']);
        });
    }
};
