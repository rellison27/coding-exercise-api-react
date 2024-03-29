<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Http\Resources\GroupsCollection;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

// Step 2:
// This endpoint should support
// CRUD (Create, Read, Update, Delete) operations.
//Step 2.5 Test that the endpoint works
class GroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new GroupsCollection(Group::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
            'group_name' => 'required|max:255',
        ]);

        $group = Group::create($request->all());
        return (new GroupResource($group))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new GroupResource(Group::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);
        $group->update($request->all());

        return response()->json(null, 204);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return response()->json(null, 204);
    }

    // Import bulk from CSV
    public function handleImportGroups(Request $request)
    {
        $validator = Validator::make($request->all(), [
            '*.id' => 'integer|min:1',
            '*.group_name' => 'required|max:255',
        ]);
        // on fail return error message
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->all(),
            ], 422);
        };
        $rows = $request->all();
        foreach ($rows as $row) {
            if (array_key_exists('id', $row) && Group::find($row['id']) !== null) {
                $group = Group::findOrFail($row['id']);
                $group->update([
                    'id' => $row['id'],
                    'group_name' => $row['group_name'],
                ]);
            } else {
                $group = Group::create($row);
                new GroupResource($group);
            }

        }
        return response()->json([
            'data' => $request->all(),
            'message' => "Groups successfully imported!",
        ], 200);

    }
}
