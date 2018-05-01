<?php

namespace App\Http\Controllers;

use App\Service;
use Illuminate\Http\Request;

class ServicesController extends Controller
{

    public function __construct()
    {
      $this->middleware('auth:api', ['except' => ['index']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Service::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $request->validate([
        'name' => 'required|unique:services',
        'description' => 'required|min:50',
        'icon' => 'required',
        'image' => 'required'
      ]);

      $service = Service::create([
        'name' => $request['name'],
        'years' => $request['years'],
        'description' => $request['description']
      ]);

      $iconFile = $request->file('icon');
      $icon = $iconFile->storeAs(
        'public/services/icons',
        $service->id.'.'.$iconFile->getClientOriginalExtension()
      );

      $imageFile = $request->file('image');
      $image = $imageFile->storeAs(
        'public/services/main',
        $service->id.'.'.$imageFile->getClientOriginalExtension()
      );

      return response()->json(Service::all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Service  $service
     * @return \Illuminate\Http\Response
     */
     public function update(Request $request)
     {
       $request->validate([
         'id' => 'required',
         'name' => 'required',
         'description' => 'required|min:50'
       ]);

       $service = Service::find($request['id']);
       $service->name = $request['name'];
       $service->description = $request['description'];
       $service->save();

       $file = $request->file('icon');
       if ($file) $path = $file->storeAs(
         'public/services',
         $service->id.'.'.$file->getClientOriginalExtension()
       );

       $iconFile = $request->file('icon');
       if ($iconFile) $icon = $iconFile->storeAs(
         'public/services/icons',
         $service->id.'.'.$iconFile->getClientOriginalExtension()
       );

       $imageFile = $request->file('image');
       if ($imageFile) $image = $imageFile->storeAs(
         'public/services/main',
         $service->id.'.'.$imageFile->getClientOriginalExtension()
       );

       return response()->json(Service::all());
     }

     /**
      * Remove the specified resource from storage.
      *
      * @param  \App\Service  $service
      * @return \Illuminate\Http\Response
      */
     public function destroy(Request $request)
     {
       $request->validate([
         'id' => 'required'
       ]);

       Service::destroy($request['id']);
       return response()->json(Service::all());
     }
}
