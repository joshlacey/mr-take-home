Additions
---------------
1) Added uuid/v1 which creates a unique ID by date-time. Setting the uuid in the brandstore adds the id to the file name as well as the object so that the object can be deleted from the front end by it's id.
2) I changed the default GET '/' route to send 'index.html' which is a static React frontend.
3) I reorganized the tests so that every time the test makes a new record in the store it puts the record's id in an array and then the delete test at the end cycles through and deletes all of the added records.

Maker's Row Take Home Assignment
-------------------------------------------
Welcome to the Maker's Row take home assignment!

Before getting started, make sure you have Node.js installed on your machine. If you don't, find an installer [here](https://nodejs.org/en/download/). You should download the latest version (currently, 9).

About the app:
--------------
This is a simple API that allows creating and retrieving factories. It uses the [Express framework](https://expressjs.com/) and implements the [json-fs-store](https://github.com/alexkwolfe/json-fs-store) library to store data (because setting up a db is overkill). The tests for the app, found in the /spec folder, use the [jasmine testing framework](https://github.com/jasmine/jasmine).

How to run the app
------------------
1) Clone this repo
2) Run the following commands:


    $ npm install
    $ npm start
Navigating to [http://localhost:3000](http://localhost:3000) in your browser should yield `OK`

How to run the tests
--------------------
    $ npm test


Existing Resources
------------------
**/factories**

    GET: Retrieves an array of all of the factory objects

    POST: Creates a new factory object
        Expects:
            {
                name: 'Factory Name'
            }

**/factories/{id}**

    GET: Retrieves factory object with the id {id}

**/factories/search?q={factoryName}**

    GET: Retrieves first matching factory where the factory's name equals the url parameter q




What you need to do:
--------------------
 - Extend the factories resource to include the following fields `email`, `phone_number`, `city`, and `state`
 - Implement the incomplete `/factories/search` resource. It should return the first matching (by name) factory. Don't worry about duplicates, or about being case sensitive, just return the first factory. *Note: there are currently 2 failing tests because the `/factories/search` resource is incomplete.*
 - Create a new resource for brands. This resource should have the endpoint `/brands`. The brands resource should have the same fields as the factories resource.
 - **We want to store both brands and factories in a generic `companies` table.** For this exercise, the `companies` table is represented by the json files in the `/store/companies` directories. A `company_type` property should be used to specify if the company is a brand or factory. Change the factory and brand resources to account for this.
 - Add tests to account for of these changes.
 - Push the altered application to a public repository in your GitHub account, and send a link to that repository to [dev@makersrow.com](mailto:dev@makersrow.com)

Bonus
-----
 - Implement a delete method on the brand and factory resources.
 - Improve the app in any way you see fit.

What we're looking for
----------------------
 - Clean, simple, working code.
 - Passing tests.

Do
--
 - Read all of the instructions before starting.
 - Ask questions if you're unsure.

Don't
-----
 - Not read all of the instructions before starting.
 - Not ask questions if you're unsure.
