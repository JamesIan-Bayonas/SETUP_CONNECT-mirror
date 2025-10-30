<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerApprovalController extends Controller
{
     public function index()
    {    
          return Inertia::render('CustomerApprovalForm');
    }
}
