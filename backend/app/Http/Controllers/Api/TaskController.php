<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskList;
use App\Traits\ApiResponseTrait;
use App\Traits\FileProcess;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    use ApiResponseTrait, FileProcess;

    public function index(TaskList $taskList): JsonResponse
    {
        Gate::authorize('view', $taskList->board);

        return $this->success($taskList->tasks, 'Tasks retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $tasks = Task::query()
            ->whereHas('taskList.board', function($query) {
                $query->where('user_id', auth()->user()->id);
            })
            ->with('taskList:id,board_id')
            ->paginate(10);

        return $this->success($tasks, 'Tasks retrieved successfully');
    }

    public function store(Request $request, TaskList $taskList): JsonResponse
    {
        Gate::authorize('update', $taskList->board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string',
            'file_path' => 'nullable|image|mimes:jpg,jpeg,png|max:3072',
        ]);

        $validated['file_path'] = $this->storeFile($validated['file_path'] ?? null, 'task/file');

        $task = $taskList->tasks()->create([
            'title' => $validated['title'],
            'description' => $validated['desc'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => $validated['status'] ?? Task::STATUS_INITIAL,
            'file_path' => $validated['file_path'],
        ]);

        return $this->success($task, 'Task created successfully', 201);
    }

    public function show(TaskList $taskList, Task $task): JsonResponse
    {
        Gate::authorize('view', $task->taskList->board);

        return $this->success($task, 'Task retrieved successfully');
    }

    public function update(Request $request, TaskList $taskList, Task $task): JsonResponse
    {
        Gate::authorize('update', $task->taskList->board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string',
            'file_path' => 'nullable|image|mimes:jpg,jpeg,png|max:3072',
        ]);

        $validated['file_path'] = $this->updateFile($validated['file_path'] ?? null, 'task/file', $task, 'file_path');
        $task->update($validated);

        return $this->success($task, 'Task updated successfully');
    }

    public function destroy(TaskList $taskList, Task $task): JsonResponse
    {
        Gate::authorize('delete', $task->taskList->board);

        $this->deleteFile($task, 'file_path');
        $task->delete();

        return $this->success([], 'Task deleted successfully', 200);
    }

    public function taskStatuses(): JsonResponse
    {
        return $this->success(Task::getStatuses(), 'Task statuses retrieved successfully');
    }
}
