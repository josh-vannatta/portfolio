<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('auth/admin', 'AdminController@attempt');

Route::prefix('skills')->group(function() {
  Route::post('store', 'SkillsController@store');
  Route::post('destroy', 'SkillsController@destroy');
  Route::post('update', 'SkillsController@update');
  Route::get('all', 'SkillsController@index');
});

Route::prefix('services')->group(function() {
  Route::post('store', 'ServicesController@store');
  Route::post('destroy', 'ServicesController@destroy');
  Route::post('update', 'ServicesController@update');
  Route::get('all', 'ServicesController@index');
});

Route::prefix('projects')->group(function() {
  Route::post('store', 'ProjectController@store');
  Route::post('destroy', 'ProjectController@destroy');
  Route::post('update', 'ProjectController@update');
  Route::post('edit', 'ProjectController@edit');
  Route::get('all', 'ProjectController@index');
  Route::get('show/{client}', 'ProjectController@show');

  Route::prefix('nodes')->group(function() {
    Route::post('store', 'ProjectNodeController@store');
    Route::post('destroy', 'ProjectNodeController@destroy');
    Route::post('update', 'ProjectNodeController@update');
    Route::get('all/{project_id}', 'ProjectNodeController@index');
  });

});

Route::post('contact', 'HomeController@contact');
