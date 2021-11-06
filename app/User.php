<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{

    protected $table = 'users';
    protected $fillable = ['name', 'email', 'password', 'is_active', 'role'];
    protected $hidden = ['password', 'is_active', 'role'];

}
