<?php

namespace App\Http\Controllers;

use App\Project;
use App\ProjectSkill;
use App\ProjectService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{

    public function __construct()
    {
      $this->middleware('auth:api', ['except' => ['index', 'show']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      return response()->json($this->formatProjects());
    }

    private function formatProjects($project='')
    {
      $projectList = $project != '' ? [$project] : Project::all();
      foreach ($projectList as $project) {
        $project->skills = DB::table('skills')
                ->join('project_skills', 'skills.id', '=', 'project_skills.skill_id')
                ->select('skills.*')
                ->where('project_skills.project_id', '=', $project->id)
                ->get();

        $project->services = DB::table('services')
                ->join('project_services', 'services.id', '=', 'project_services.service_id')
                ->select('services.*')
                ->where('project_services.project_id', '=', $project->id)
                ->get();
      }
      return $projectList;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request['services'] = json_decode($request['services']);
        $request['skills'] = json_decode($request['skills']);
        $request->validate([
          'client' => 'required|unique:projects',
          'title' => 'required',
          'introduction' => 'required|min:120',
          'site_url' => 'required|url',
          'services' => 'required|array|min:1',
          'skills' => 'required|array|min:1',
          'image' => 'required'
        ]);

        $project = Project::create([
          'client' => $request['client'],
          'title' => $request['title'],
          'introduction' => $request['introduction'],
          'site_url' => $request['site_url'],
        ]);

        foreach ($request['services'] as $service) {
          $projectService = ProjectService::create([
            'project_id' => $project->id,
            'service_id' => $service->id
          ]);
        }

        foreach ($request['skills'] as $skill) {
          $projectSkill = ProjectSkill::create([
            'project_id' => $project->id,
            'skill_id' => $skill->id
          ]);
        }

        $file = $request->file('image');
        $path = $file->storeAs(
          'public/projects',
          $project->id.'.'.$file->getClientOriginalExtension()
        );

        return response()->json($this->formatProjects());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show($client)
    {
        $project = Project::where('client', 'like', "%$client%")->get()->first();
        return response()->json($this->formatProjects($project)[0]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, Project $project)
    {
        $file = $request->file('icon');
        $path = $file->storeAs(
          'public/projects/icons',
          $request['id'].'.'.$file->getClientOriginalExtension()
        );
        return response()->json(true);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Project $project)
    {
      $request['services'] = json_decode($request['services']);
      $request['skills'] = json_decode($request['skills']);
      $request->validate([
        'client' => 'required',
        'title' => 'required',
        'site_url' => 'required|url',
        'introduction' => 'required|min:120',
        'services' => 'required|array|min:1',
        'skills' => 'required|array|min:1'
      ]);

      $project = Project::find($request['id']);
      $project->client = $request['client'];
      $project->title = $request['title'];
      $project->site_url = $request['site_url'];
      $project->introduction = $request['introduction'];
      $project->save();

      ProjectService::where('project_id', $request['id'])->delete();
      foreach ($request['services'] as $service) {
        $projectService = ProjectService::create([
          'project_id' => $project->id,
          'service_id' => $service->id
        ]);
      }

      ProjectSkill::where('project_id', $request['id'])->delete();
      foreach ($request['skills'] as $skill) {
        $projectSkill = ProjectSkill::create([
          'project_id' => $project->id,
          'skill_id' => $skill->id
        ]);
      }

      $file = $request->file('image');
      if ($file) $path = $file->storeAs(
        'public/projects',
        $project->id.'.'.$file->getClientOriginalExtension()
      );

      return response()->json($this->formatProjects());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        Project::destroy($request['id']);
        ProjectService::where('project_id', $request['id'])->delete();
        ProjectSkill::where('project_id', $request['id'])->delete();
        Storage::delete('public/projects/'.$request['id'].'.png');
        Storage::delete('public/projects/icons/'.$request['id'].'.svg');
        return response()->json($this->formatProjects());
    }
}
