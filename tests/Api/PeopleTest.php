<?php

namespace Tests\Feature;

use App\Models\Person;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PeopleControllerTest extends TestCase
{
    use WithFaker;

    public function testPersonCreated()
    {
        $expected = [
            'first_name' => 'Sally',
            'last_name' => 'Ride',
            'email_address' => 'sallyride@nasa.gov',
            'status' => 'archived',
        ];
        $response = $this->json('POST', '/api/people', $expected);
        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected);

    }

    public function testPersonRetrieved()
    {
        $person = factory('App\Models\Person')->create();

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'first_name',
                    'last_name',
                    'email_address',
                    'status',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function testAllPeopleRetrieved()
    {
        $person = factory('App\Models\Person', 25)->create();

        $response = $this->json('GET', '/api/people');
        $response
            ->assertStatus(200)
            ->assertJsonCount(25, 'data');
    }

    public function testNoPersonRetrieved()
    {
        $person = factory('App\Models\Person')->create();
        Person::destroy($person->id);

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response->assertStatus(404);
    }

    public function testPersonUpdated()
    {
        $person = factory('App\Models\Person')->create();

        $updatedFirstName = $this->faker->firstName();
        $response = $this->json('PUT', '/api/people/' . $person->id, [
            'first_name' => $updatedFirstName,
        ]);
        $response->assertStatus(204);

        $updatedPerson = Person::find($person->id);
        $this->assertEquals($updatedFirstName, $updatedPerson->first_name);
    }

    public function testPersonDeleted()
    {
        $person = factory('App\Models\Person')->create();

        $deleteResponse = $this->json('DELETE', '/api/people/' . $person->id);
        $deleteResponse->assertStatus(204);

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response->assertStatus(404);

    }

    public function testPersonImportFailsWithNoName()
    {
        $expected = [
            'email_address' => 'sallyride@nasa.gov',
            'status' => 'archived',
        ];
        $response = $this->json('POST', '/api/import/people', $expected);
        $response
            ->assertStatus(422);
    }
    public function testPersonImportFailsWithNoEmail()
    {
        $expected = [
            'first_name' => 'Sally',
            'last_name' => 'Ride',
            'status' => 'archived',
        ];
        $response = $this->json('POST', '/api/import/people', $expected);
        $response
            ->assertStatus(422);
    }

    public function testPersonImportUpdatesUserInDatabaseWithSameId()
    {
        $person = factory('App\Models\Person')->create();

        $importedPerson = $this->faker->lastName;
        $response = $this->json('POST', '/api/import/people/',
            [[
                "id" => $person->id,
                "first_name" => $person->first_name,
                "last_name" => $importedPerson,
                "email_address" => $person->email_address,
                "status" => $person->status],

            ]);
        $response->assertStatus(200);

        $updatedPerson = Person::find($person->id);
        $this->assertEquals($importedPerson, $updatedPerson->last_name);
    }

    public function testPersonImportedWithIdCreatesNewUserIfNotFoundInDatabase()
    {
        $expected = [
            "id" => 1,
            "first_name" => "Doug",
            "last_name" => "Gentleman",
            "email_address" => "gentleman@gentleman.com",
            "status" => "active",
        ];
        $response = $this->json('POST', '/api/import/people/', [$expected]);
        $response->assertStatus(200)->assertJsonFragment($expected);
    }
}
