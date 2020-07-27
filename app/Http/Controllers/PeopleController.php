<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeopleCollection;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PeopleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //The read to get all /api/people
        return new PeopleCollection(Person::all());
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
    // post for /api/people
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email_address' => 'required|email',
            'status' => Rule::in(['active', 'archived']),
        ]);

        $person = Person::create($request->all());

        return (new PersonResource($person))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    // Get for specified person
    public function show($id)
    {
        return new PersonResource(Person::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    // this looks like an update/PUT
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
    //PUT for specified user
    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);
        $person->update($request->all());

        return response()->json(null, 204);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    // DELETE speicified user
    public function destroy($id)
    {
        $person = Person::findOrFail($id);
        $person->delete();

        return response()->json(null, 204);
    }

    // Step 4
    // create function that creates
    // Multiple users or updates users
    // from React CSV form
    public function handleImportPeople(Request $request)
    {
        // Validate fields
        $validator = Validator::make($request->all(), [
            '*.id' => 'integer|min:1',
            '*.first_name' => 'required|max:255',
            '*.last_name' => 'required|max:255',
            '*.email_address' => 'required|email',
            '*.status' => Rule::in(['active', 'archived']),
        ]);
        // on fail return error message
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all(),
                'message' => 'all fields are required, please make sure all fields have the correct values. (id must be positive integer)',
            ], 422);
        };
        $rows = $request->all();
        foreach ($rows as $row) {
            if (array_key_exists('id', $row) && Person::find($row['id']) !== null) {
                $person = Person::findOrFail($row['id']);
                $person->update($row);
            } else {
                $person = Person::create($row);
                new PersonResource($person);
            }

        }
        return response()->json([
            'data' => $request->all(),
            'message' => "People successfully imported!",
        ], 200);

    }
}
