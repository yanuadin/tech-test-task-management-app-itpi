<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = ['task_list_id', 'title', 'description', 'due_date', 'status', 'file_path'];

    public function taskList(): BelongsTo
    {
        return $this->belongsTo(TaskList::class);
    }
}
