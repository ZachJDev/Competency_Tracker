# Competency Tracker

This application is an extension of a smaller one I built for my job when I was part of a training-redesign working group.

On the Heroku version linked to the side, users can login with the email 'example@example' and password 'example' to see the start of a project. A script runs to reset any changes made to that user/institution every 24 hours (or whenever the Heroku dyno wakes up), so work will not be saved.

## Known Issues

- [ ] Small CSS width problem on index pages
- [ ] 'Dumb' error handling and input validation for some pages
- [ ] Both on my localHost and on Heroku, for the first minute or so of running the application, pages are served before new changes to the database are completed. I've also had one issue with a page not being served correctly in this time frame. I'm not convinced this is a problem with my code, though I am interested in getting to the bottom of the problem.

### TODO

- [ ] Add more abilities for admin users
- [ ] Add functionality for users to make comments on in-progress work
- [ ] Add support for classes & lessons
- [ ] Refactor CSS and how the server serves stylesheets