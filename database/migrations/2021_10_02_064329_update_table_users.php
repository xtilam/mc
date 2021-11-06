<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function(Blueprint $table){
            $table->smallInteger('role')->default(0);
            $table->index('email');
            $table->smallInteger('is_active')->index()->default(-10);
        });

        Schema::create('users_waiting_email_verification', function(Blueprint $table){
            $table->bigInteger('id')->primary();
            $table->string('verification_code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
