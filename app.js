const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);


const app = express();
const port = process.env.PORT || 5500;
const database = process.env.COMP_DATABASEURL;
const secret = JSON.parse(process.env.SECRET);

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true })); // This has to be BEFORE the routes.

// routes
const competencyRoutes = require('./routes/Competencies');
const skillRoutes = require('./routes/Skills');
const roleRoutes = require('./routes/Roles');
const indexRoutes = require('./routes/index');
const subSkillRoutes = require('./routes/subSkills');
const middleware = require('./routes/internal-modules/middleware');

// Session and sessionStore setup.

const store = new MongoDbStore({
  uri: process.env.DATABASEURL,
  collection: 'sessions',
});


app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

// express setup

app.use('/', middleware.findUserSession);
app.use('/', indexRoutes);
app.use('/roles', roleRoutes);
app.use('/competencies', competencyRoutes);
app.use('/competencies/:id/skills', skillRoutes);
app.use('/competencies/:id/skills/:skill_id/subskills', subSkillRoutes);
app.use(express.static('public'));

mongoose.connect(database,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
  // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`server up on port ${port}`));
  });
