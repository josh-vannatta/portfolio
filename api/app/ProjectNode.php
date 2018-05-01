<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectNode extends Model
{
    protected $fillable = [
      'project_id', 'type', 'title', 'content', 'image', 'code'
    ];
}
