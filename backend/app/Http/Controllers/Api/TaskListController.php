<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\TaskList;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskListController extends Controller
{
    use ApiResponseTrait;

    public function index(Board $board): JsonResponse
    {
        Gate::authorize('view', $board);

        return $this->success($board->taskLists, 'Lists retrieved successfully');
    }

    public function store(Request $request, Board $board): JsonResponse
    {
        Gate::authorize('update', $board);

        $validated = $request->validate([
            'board_id' => 'required|exists:boards,id',
            'title' => 'required|string|max:255',
        ]);

        $taskList = $board->taskLists()->create($validated);

        return $this->success($taskList, 'List created successfully', 201);
    }

    public function show(Board $board, TaskList $taskList): JsonResponse
    {
        Gate::authorize('view', $taskList->board);

        return $this->success($taskList, 'List retrieved successfully');
    }

    public function update(Request $request, Board $board, TaskList $taskList): JsonResponse
    {
        Gate::authorize('update', $taskList->board);

        $validated = $request->validate([
            'board_id' => 'required|exists:boards,id',
            'title' => 'required|string|max:255',
        ]);

        $taskList->update($validated);

        return $this->success($taskList, 'List updated successfully');
    }

    public function destroy(Board $board, TaskList $taskList): JsonResponse
    {
        Gate::authorize('delete', $taskList->board);
        $taskList->delete();

        return $this->success([], 'List deleted successfully', 200);
    }
}
