<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    const STATUS_INITIAL = 'initial';
    const STATUS_PROGRESS = 'progress';
    const STATUS_COMPLETED = 'completed';
    protected $fillable = ['task_list_id', 'title', 'description', 'due_date', 'status', 'file_path'];

    public function taskList(): BelongsTo
    {
        return $this->belongsTo(TaskList::class);
    }

    public static function getStatuses(): array
    {
        return [
            self::STATUS_INITIAL,
            self::STATUS_PROGRESS,
            self::STATUS_COMPLETED,
        ];
    }
}
