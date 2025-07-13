<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\TaskListController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me'])->name('me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::prefix('/boards')->group(function () {
        Route::get('/', [BoardController::class, 'index'])->name('boards.index');
        Route::post('/', [BoardController::class, 'store'])->name('boards.store');
        Route::get('/{board}', [BoardController::class, 'show'])->name('boards.show');
        Route::put('/{board}', [BoardController::class, 'update'])->name('boards.update');
        Route::delete('/{board}', [BoardController::class, 'destroy'])->name('boards.destroy');

        Route::prefix('/{board}/lists')->group(function () {
            Route::get('/', [TaskListController::class, 'index'])->name('lists.index');
            Route::post('/', [TaskListController::class, 'store'])->name('lists.store');
            Route::get('/{taskList}', [TaskListController::class, 'show'])->name('lists.show');
            Route::put('/{taskList}', [TaskListController::class, 'update'])->name('lists.update');
            Route::delete('/{taskList}', [TaskListController::class, 'destroy'])->name('lists.destroy');
        });
    });

    Route::prefix('lists/{taskList}/tasks')->group(function () {
        Route::get('/', [TaskController::class, 'index'])->name('tasks.index');
        Route::post('/', [TaskController::class, 'store'])->name('tasks.store');
        Route::get('/{task}', [TaskController::class, 'show'])->name('tasks.show');
        Route::put('/{task}', [TaskController::class, 'update'])->name('tasks.update');
        Route::delete('/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    });
    Route::get('/task-statuses', [TaskController::class, 'taskStatuses'])->name('task.statuses');
});
