<?php

namespace App\Enums;

enum UserType: string
{
    case ADMIN = 'admin';
    case PSTO_STAFF = 'psto_staff';
    case COOPERATOR = 'cooperator';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::PSTO_STAFF => 'PSTO Staff',
            self::COOPERATOR => 'Cooperator',
        };
    }
}