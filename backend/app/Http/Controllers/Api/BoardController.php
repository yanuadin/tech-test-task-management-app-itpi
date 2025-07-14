<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\JsonResponse;

class BoardController extends Controller
{
    use ApiResponseTrait;

    public function index(): JsonResponse
    {
        $boards = Board::query()
            ->where('user_id', auth()->id())
            ->withCount('taskLists')
            ->get();

        return $this->success($boards, 'Boards retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $board = Board::query()
            ->create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
            ]);

        return $this->success($board, 'Board created successfully', 201);
    }

    public function show(Board $board): JsonResponse
    {
        Gate::authorize('view', $board);

        return $this->success($board, 'Board retrieved successfully');
    }

    public function update(Request $request, Board $board): JsonResponse
    {
        Gate::authorize('update', $board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $board->update($validated);

        return $this->success($board, 'Board updated successfully');
    }

    public function destroy(Board $board): JsonResponse
    {
        Gate::authorize('delete', $board);
        $board->delete();

        return $this->success([], 'Board deleted successfully');
    }
}
