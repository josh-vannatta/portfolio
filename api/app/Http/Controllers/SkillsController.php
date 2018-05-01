<?php

namespace App\Http\Controllers;

use App\Skill;
use Illuminate\Http\Request;

class SkillsController extends Controller
{

    public function __construct()
    {
      $this->middleware('auth:api', ['except' => ['index']]);
    }


    public function index()
    {
        return response()->json(Skill::all());
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
          'name' => 'required|unique:skills',
          'years' => 'required|numeric',
          'description' => 'required|min:80',
          'icon' => 'required'
        ]);

        $skill = Skill::create([
          'name' => $request['name'],
          'years' => $request['years'],
          'description' => $request['description']
        ]);

        $file = $request->file('icon');
        $path = $file->storeAs(
          'public/skills',
          $skill->id.'.'.$file->getClientOriginalExtension()
        );

        return response()->json(Skill::all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Skill  $skill
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
      $request->validate([
        'id' => 'required',
        'name' => 'required',
        'years' => 'required|numeric',
        'description' => 'required|min:80'
      ]);

      $skill = Skill::find($request['id']);
      $skill->name = $request['name'];
      $skill->years = $request['years'];
      $skill->description = $request['description'];
      $skill->save();

      $file = $request->file('icon');
      if ($file) $path = $file->storeAs(
        'public/skills',
        $skill->id.'.'.$file->getClientOriginalExtension()
      );

      return response()->json(Skill::all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Skill  $skill
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
      $request->validate([
        'id' => 'required'
      ]);

      Skill::destroy($request['id']);
      return response()->json(Skill::all());
    }
}
