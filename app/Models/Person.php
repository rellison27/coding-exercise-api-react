<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $fillable = [
        'id',
        'first_name',
        'last_name',
        'email_address',
        'status',
        'group_name',
    ];

    protected $attributes = [
        'group_name' => 'Members',
    ];
}
