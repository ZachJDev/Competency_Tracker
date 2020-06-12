const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 5500;

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true })); // This has to be BEFORE the routes.
// routes
const competencyRoutes = require('./routes/Competencies');
const skillRoutes = require('./routes/Skills');
const roleRoutes = require('./routes/Roles');
const indexRoutes = require('./routes/index');
const subSkillRoutes = require('./routes/subSkills');

// Mongoose setup:
// mongodb://localhost/CompetencyTracker
// I've been having troubling keeing environmental variables straight between my computers,
// so until this is hosted anywhere, mongoose will stay connected like this.
// process.env.DATABASEURL

// seedDB();

// express setup
app.use('/', indexRoutes);
app.use('/roles', roleRoutes);
app.use('/competencies', competencyRoutes);
app.use('/competencies/:id/skills', skillRoutes);
app.use('/competencies/:id/skills/:skill_id/subskills', subSkillRoutes);
app.use(express.static('public'));

mongoose.connect(`${process.env.LOCAL_MONGODB}CompetencyTracker`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // eslint-disable-next-line no-console
  app.listen(port, () => console.log('server up'));
});
