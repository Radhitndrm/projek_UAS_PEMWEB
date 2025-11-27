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
        Schema::create('order_receives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->string('receive_code');
            $table->date('receive_date');
            $table->enum('status', ['pending', 'success']);
            $table->timestamps();
            $table->foreignId('created_by')->constrained('users');
            $table->dateTime('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users');
            $table->softDeletes();
            $table->foreignId('deleted_by')->nullable()->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_receives');
    }
};
