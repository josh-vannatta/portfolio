<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectSkill extends Model
{
  protected $fillable = [
    'project_id', 'skill_id'
  ];
}
