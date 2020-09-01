/**
* @swagger
*
* /admin/users:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /admin/users:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /admin/users/{id}:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /users/:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /users/{id}.{ext}:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: ext
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /admin/grades:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /admin/grades:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/draft:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/draft:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/{id}:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/{id}/submit:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/{id}/unsubmit:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/{id}/return/{userId}:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: userId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /assignments/{id}:
*   delete:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /auth/login:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /auth/password:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /auth/renewToken:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /courses/:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /courses/{id}:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /courses/{id}:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /courses/{id}/chat:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /courses/:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /courses/{id}:
*   delete:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /events/:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /events/:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /events/{id}:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /events/{id}:
*   delete:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /chats/:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /chats/{id}:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /chats/{id}:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /chats/user/{id}:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: id
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /chats/:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /devices/:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /devices/:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /devices/{token}:
*   delete:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: token
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/upload:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/download:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/serve:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/save:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/editKey:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/{path}:
*   get:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: path
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/new/{path}:
*   post:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: path
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
*
* /files/{bucket}/{itemId}/{path}:
*   delete:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
*     parameters:
*       - in: path
*         name: bucket
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: itemId
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*       - in: path
*         name: path
*         type: ToDo # integer or string
*         required: true
*         description: ToDo
*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)
*
* definitions:
*
*   Assignment:
*     type: object
*     required:
*       - id
*       - title
*       - content
*       - due
*       - course
*       - draftUser
*       - userSubmissions
*     properties:
*       id:
*         type: number
*       title:
*         type: string
*       content:
*         type: string
*       due:
*         type: string
*         format: date
*       course:
*         type:
*           $ref: '#/definitions/Course'
*       draftUser:
*         type:
*           $ref: '#/definitions/User'
*       userSubmissions:
*         type: array
*         items:
*           $ref: '#/definitions/AssignmentSubmission'
*       submissionsMissing:
*         type: array
*         items:
*           $ref: '#/definitions/User'
*       materials:
*         type: array
*         items:
*           type: object
*       worksheets:
*         type: array
*         items:
*           type: object
*       submissions:
*         type: array
*         items:
*           type: object
*       submitted:
*         type: string
*         format: date
*       returned:
*         type: string
*         format: date
*       feedback:
*         type: string
*
*
*   AssignmentSubmission:
*     type: object
*     required:
*       - id
*       - message
*       - date
*       - returned
*       - feedback
*       - user
*       - assignment
*       - files
*     properties:
*       id:
*         type: number
*       message:
*         type: string
*       date:
*         type: string
*         format: date
*       returned:
*         type: string
*         format: date
*       feedback:
*         type: string
*       user:
*         type:
*           $ref: '#/definitions/User'
*       assignment:
*         type:
*           $ref: '#/definitions/Assignment'
*       files:
*         type: array
*         items:
*           type: object
*
*
*   Chat:
*     type: object
*     required:
*       - id
*       - name
*       - messages
*       - users
*     properties:
*       id:
*         type: number
*       name:
*         type: string
*       messages:
*         type: array
*         items:
*           $ref: '#/definitions/Message'
*       users:
*         type: array
*         items:
*           $ref: '#/definitions/User'
*       info:
*         type: string
*
*
*   Course:
*     type: object
*     required:
*       - id
*       - name
*       - description
*       - students
*       - teachers
*       - assignments
*       - messages
*     properties:
*       id:
*         type: number
*       name:
*         type: string
*       description:
*         type: string
*       students:
*         type: array
*         items:
*           $ref: '#/definitions/User'
*       teachers:
*         type: array
*         items:
*           $ref: '#/definitions/User'
*       assignments:
*         type: array
*         items:
*           $ref: '#/definitions/Assignment'
*       messages:
*         type: array
*         items:
*           $ref: '#/definitions/Message'
*
*
*   Device:
*     type: object
*     required:
*       - id
*       - os
*       - software
*       - device
*       - token
*       - user
*     properties:
*       id:
*         type: number
*       os:
*         type: string
*       software:
*         type: string
*       device:
*         type: string
*       token:
*         type: string
*       user:
*         type:
*           $ref: '#/definitions/User'
*
*
*   Event:
*     type: object
*     required:
*       - Id
*       - Subject
*       - Description
*       - Location
*       - StartTime
*       - EndTime
*       - IsAllDay
*       - StartTimezone
*       - EndTimezone
*       - RecurrenceRule
*       - user
*       - Category
*     properties:
*       Id:
*         type: number
*       Subject:
*         type: string
*       Description:
*         type: string
*       Location:
*         type: string
*       StartTime:
*         type: string
*         format: date
*       EndTime:
*         type: string
*         format: date
*       IsAllDay:
*         type: boolean
*       StartTimezone:
*         type: string
*       EndTimezone:
*         type: string
*       RecurrenceRule:
*         type: string
*       user:
*         type:
*           $ref: '#/definitions/User'
*       Category:
*         type: string
*         enum: [Assignment, UserEvent, Conference, Holiday, Vacation]
*
*
*   Grade:
*     type: object
*     required:
*       - id
*       - name
*       - users
*     properties:
*       id:
*         type: number
*       name:
*         type: string
*       users:
*         type: array
*         items:
*           $ref: '#/definitions/User'
*
*
*   Message:
*     type: object
*     required:
*       - id
*       - text
*       - sender
*       - date
*       - chat
*       - course
*     properties:
*       id:
*         type: number
*       text:
*         type: string
*       sender:
*         type:
*           $ref: '#/definitions/User'
*       edited:
*         type: boolean
*       citation:
*         type: number
*       date:
*         type: string
*         format: date
*       chat:
*         type:
*           $ref: '#/definitions/Chat'
*       course:
*         type:
*           $ref: '#/definitions/Course'
*       reactions:
*         type: object
*       fromMe:
*         type: boolean
*       status:
*         type: string
*         enum: [Waiting, Sent, Delivered, Seen]
*
*
*   User:
*     type: object
*     required:
*       - id
*       - name
*       - role
*       - password
*       - passwordResetToken
*       - createdAt
*       - updatedAt
*       - grade
*       - courses
*       - coursesTeaching
*       - chats
*       - messages
*       - events
*       - submittedAssignments
*       - devices
*       - assignmentDraft
*     properties:
*       id:
*         type: number
*       name:
*         type: string
*       role:
*         type: string
*         enum: [student, teacher, admin]
*       password:
*         type: string
*       passwordResetToken:
*         type: string
*       createdAt:
*         type: string
*         format: date
*       updatedAt:
*         type: string
*         format: date
*       grade:
*         type:
*           $ref: '#/definitions/Grade'
*       courses:
*         type: array
*         items:
*           $ref: '#/definitions/Course'
*       coursesTeaching:
*         type: array
*         items:
*           $ref: '#/definitions/Course'
*       chats:
*         type: array
*         items:
*           $ref: '#/definitions/Chat'
*       messages:
*         type: array
*         items:
*           $ref: '#/definitions/Message'
*       events:
*         type: array
*         items:
*           $ref: '#/definitions/Event'
*       submittedAssignments:
*         type: array
*         items:
*           $ref: '#/definitions/AssignmentSubmission'
*       devices:
*         type: array
*         items:
*           $ref: '#/definitions/Device'
*       assignmentDraft:
*         type:
*           $ref: '#/definitions/Assignment'
*       jwtToken:
*         type: string
*/