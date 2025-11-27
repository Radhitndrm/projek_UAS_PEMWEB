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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code');
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->date('order_date');
            $table->double('total_amount');
            $table->enum('status', ['pending', 'success', 'cancel']);
            $table->timestamps();
            $table->foreignId('created_by')->constrained('users');
            $table->dateTime('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->constrained('users');
            $table->softDeletes();
            $table->foreignId('deleted_by')->nullable()->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
