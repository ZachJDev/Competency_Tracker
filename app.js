const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const csrf = require('csurf');
const flash = require('connect-flash');


const errorController = require('./Controllers/error');

const csrfProtection = csrf();

const app = express();
const port = process.env.PORT || 5500;
const database = process.env.COMP_DATABASEURL;
console.log(database);

// Not the most secure way to store secrets, but this isn't storing any sensitive data, sooo...
const secret = JSON.parse(process.env.SECRET);

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true })); // This has to be BEFORE the routes.
// routes
const competencyRoutes = require('./routes/Competencies');
const skillRoutes = require('./routes/Skills');
const roleRoutes = require('./routes/Roles');
const indexRoutes = require('./routes/index');
const subSkillRoutes = require('./routes/subSkills');
const authRoutes = require('./routes/auth');
const middleware = require('./routes/internal-modules/middleware');

// Session and sessionStore setup.

const store = new MongoDbStore({
  uri: database,
  collection: 'sessions',
});


app.use(
  session({
    secret,
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

// Accordinging to https://stackoverflow.com/questions/23997572/error-misconfigured-csrf-express-js-4#23997918
// The next line must go after session configuration
app.use(csrfProtection);
// express setup

app.use(flash());
app.use(middleware.findUserSession, middleware.addLocals);

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/roles', middleware.isUserAuthenticated, roleRoutes);
app.use('/competencies', middleware.isUserAuthenticated, competencyRoutes);
app.use('/competencies/:id/skills', middleware.isUserAuthenticated, skillRoutes);
app.use('/competencies/:id/skills/:skill_id/subskills', middleware.isUserAuthenticated, subSkillRoutes);
app.use(express.static('public'));
app.use(errorController.get404);

mongoose.connect(database,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
  // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`server up on port ${port}`));
  });
