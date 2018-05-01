<?php

namespace App\Http\Controllers;

use App\ProjectNode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectNodeController extends Controller
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
    public function index(Request $request)
    {
      return response()->json($this->filterNodes($request['project_id']));
    }

    public function filterNodes($id)
    {
      $nodeList = ProjectNode::where('project_id', '=', $id)->get();
      foreach ($nodeList as $node) {
        if ($node->code) {
          $node->code = Storage::get('public/projects/nodes/code/'.$node->id.'.txt');
        }
      }
      return $nodeList;
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
          'project_id'=>'required',
          'type' => 'required',
          'title' => 'required',
          'content' => 'required'
        ]);

        $imageFile = $request->file('image');
        $codeFile = $request->file('code');

        $node = ProjectNode::create([
          'project_id' => $request['project_id'],
          'type' => $request['type'],
          'title' => $request['title'],
          'content' => $request['content'],
          'image' => $imageFile !== null,
          'code'=> $codeFile !== null,
        ]);

        if ($imageFile) $imagePath = $imageFile->storeAs(
          'public/projects/nodes/image',
          $node->id.'.'.$imageFile->getClientOriginalExtension()
        );
        if ($codeFile) $codePath = $codeFile->storeAs(
          'public/projects/nodes/code',
          $node->id.'.'.$codeFile->getClientOriginalExtension()
        );

        return response()->json($this->filterNodes($request['project_id']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ProjectNode  $projectNode
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectNode $projectNode)
    {
      $request->validate([
        'id' => 'required',
        'project_id'=>'required',
        'type' => 'required',
        'title' => 'required',
        'content' => 'required'
      ]);

      $imageFile = $request->file('image');
      $codeFile = $request->file('code');

      $node = ProjectNode::find($request['id']);
      $node->project_id = $request['project_id'];
      $node->type= $request['type'];
      $node->title= $request['title'];
      $node->content= $request['content'];
      if ($node->image !== true)
        $node->image = $imageFile !== null;
      if ($node->code !== true)
        $node->code = $codeFile !== null;

      if ($imageFile) $imagePath = $imageFile->storeAs(
        'public/projects/nodes/image',
        $node->id.'.'.$imageFile->getClientOriginalExtension()
      );
      if ($codeFile) $codePath = $codeFile->storeAs(
        'public/projects/nodes/code',
        $node->id.'.'.$codeFile->getClientOriginalExtension()
      );
      $node->save();

      return response()->json($this->filterNodes($request['project_id']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ProjectNode  $projectNode
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ProjectNode $projectNode)
    {
        $node = ProjectNode::find($request['id']);
        $project_id = $node->project_id;

        ProjectNode::destroy($request['id']);
        Storage::delete('public/projects/nodes/image/'.$request['id'].'.jpg');
        Storage::delete('public/projects/nodes/code/'.$request['id'].'.txt');

        return response()->json($this->filterNodes($project_id));
    }
}
