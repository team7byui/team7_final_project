# Team7 Final Project

Proposal submitted: 5/16/2023

## Application Info

### What will the API do?

This is going to be an organization API for small teams (like PTA’s, Presidencies, etc). The API will contain board member/Presidency information, member’s information, event, and volunteer sign up. This way, every member can go to one place for information.

### How will your API utilize a login system?

Require users to login in using OAuth with a username and password.

### What database will you use?

We will use a database built in MongoDB, called ClubOrganization.

### How will the data be stored in your database?

Collections will include; Presidency, Members, Users, Events, and Volunteers.

### How would a frontend be able to manage authentication state based on the data you provide?

Frontend would manage authentication by using Oauth and only those with “admin access” could make changes to the database (except the volunteer collection where everyone would be able to POST). Everyone else would login using username and password.

### What pieces of data in your app will need to be secured? How will you demonstrate web security principles in the development of this app?

The login URL for MongoDB will need to be secured along with any OAuth Secret or ID, and a callback URL. We will use a git ignore file, along with using environment variables in Render.

### What file structure and program architecture will you use for this project (how will you organize your node project)? Why?

Directories of routes, controllers, db, and middleware. Inside routes will be an index, users, presidency, events, members, and volunteer files. Controllers will have a file for each collection. Db will have a file to connect to MongoDB. Middleware will have a file for authentication and validation.

## What are potential stretch challenges that you could implement to go above and beyond?

We could implement GraphQL in order to go above and beyond and receive extra credit.

## API Endpoint Planning

For this section, you’ll plan out what API endpoints you’ll need for your project.

### administration

* [ ] POST /administration
* [ ] PUT /administration/{administrationID}
* [ ] GET /administration/findByPosition
* [ ] DELETE /administration/{administrationID}

### members

* [ ] GET /members
* [ ] PUT /members/{memberID}
* [ ] POST /members
* [ ] GET /members/{memberID}
* [ ] DELETE /members/{memberID}

### user

* [ ] POST /user
* [ ] POST /user/createWithArray
* [ ] POST /user/createWithList
* [ ] GET /user/login
* [ ] GET /user/logout
* [ ] GET /user/{username}
* [ ] PUT /user/{username}
* [ ] DELETE /user/{username}

### volunteers

* [ ] POST /volunteers
* [ ] PUT /volunteers/{username}
* [ ] GET /volunteers
* [ ] DELETE/volunteers

### events - ADMIN LOCKED

* [ ] GET/events
* [ ] GET/events/{eventName}
* [ ] POST/events
* [ ] PUT/events/{eventName}
* [ ] DELETE/members

## Project Scheduling and Delegation

Plan out what tasks will get completed with each lesson remaining in the semester (Only edit highlighted text).

### Lesson 9 Tasks | Tuesday

* [x] _Project Proposal_

### Lesson 10 Tasks - Friday

* [x] Create Git Repo
* [x] Set up MongoDB
* [x] Set up Nodejs project code
* [ ] API DOCUMENTATION is complete and available at route ‘/api-docs’
* [ ] GET, POST Requests
* [ ] Push to Render

### Lesson 11 Tasks - Tuesday

* [ ] PUT, DELETE Requests

### Lesson 12 Tasks - Friday

* [ ] OAuth
* [ ] maybe GraphQL
* [ ] Validation
* [ ] Error Handling
* [ ] Unit Testing

### Lesson 13 Tasks - Tuesday

* [ ] Video Presentation

### How will you divide up work in your team to ensure the following tasks all get completed?

| Task | Assignee |
| ---  | ---      |
| Create a git repo and share it with the group | John
| MongoDB setup | Shauntal
| Render | John
| Node.js project creation | Kelsey
| API Swagger documentation for all API routes | Tianna
| HTTP GET, GET (all, single) | Tianna
| HTTP POST | Tianna
| HTTP PUT | Kelsey
| HTTP DELETE | Kelsey
| OAuth | Sam
| Validation | John
| Error Handling | Shauntal
| Unit Testing | as a team Lesson 12 (Friday)
| Video presentation, all routes functioning, MongoDB data being modified, and API documentation | as a team Lesson 13 (Tuesday)

## Potential Risks and Risk Mitigation Techniques

### What are the risks involved with you being able to finish this project in a timely manner?

1. Working together in the same GitHub repo can cause confusion.
1. Using code in different ways and not understanding.

### How will you mitigate or overcome these risks?

1. We will work in branches, which we can merge with changes from the main branch, before pushing.
1. We will communicate who is working on which task to ensure that there is no repetition.
1. We will explain how we developed our code.
