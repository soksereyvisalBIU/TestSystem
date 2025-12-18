<?php

namespace App\Enum;

enum UserRole : int
{
    case STUDENT = 1;
    case INSTRUCTOR = 2;
    case ADMIN = 3;
}
