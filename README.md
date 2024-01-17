# Job App

Here is a link to my [class notes](./notes.md).

## Specification Deliverable

### Elevator Pitch

Most of us have experienced the confusion of applying for jobs. In today's world, most job applications are submitted online - apply to several jobs and you may begin to find it difficult to keep track of where you've applied. This app is here to help you record critical information about jobs you've applied to. In Job App, you can track job titles, points of contact, job descriptions, application statuses, and more. You can also share jobs you've found with friends and other users who may want to apply. Job App is here to streamline your job finding process.

### Design

![Login Page](./spec/landing-page.png)

Here's a simple login page.

![Home Page](./spec/home-page.png)

Here's a simple mockup of the home page where users can add jobs.

![Sequence Diagram](./spec/sequence-diagram.png)

Here's a simple sequence diagram of how users will interact with the server.

### Key Features

- Login over HTTPS
- Ability to create, update, and delete job applications
- Ability to share jobs with other users and display them in their view
- Notifications when a job is shared with you
- Jobs persistently stored in database
- Sort and filter your job view

### Technologies

- **HTML** - Usage of HTML for website structure. Two HTML pages for login and homepage
- **CSS** - Usage of CSS to style application text, color, interaction with buttons, etc
- **JavaScript** - Make the application interactive by allowing users to create, edit, share, and delete jobs. Also add capabilities such as filtering job applications by fields.
- **Web Service** - Backend server with endpoints for:
    - creating a job
    - updating a job
    - sharing a job
    - deleting a job
- **Database** - Database stores fields of created jobs persistently
- **Authentication** - User credentials stored in database. Users cannot login with incorrect or nonexistent credentials
- **WebSocket** - Server sends real-time notifications of when jobs are shared with them
- **React** - Application ported using React framework. May breakdown project into components


