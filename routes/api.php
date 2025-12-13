<?php

use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\Api\BusinessOrganizationTypeApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('applicants',ApplicantController ::class);
Route::apiResource('org-types', BusinessOrganizationTypeApiController ::class)->names('api.org-types');