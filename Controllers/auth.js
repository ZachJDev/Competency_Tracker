const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const Institution = require('../models/Institution');

exports.getLogin = (req, res, next) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
  User.findById('5f051137de6c2840f8dd9356')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log('akljhsalkjhd');
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
};


// I really dislike how long this is....
exports.postSignup = (req, res, next) => {
  let foundInstitution;
  let promise;
  let institution = null;
  const {
    email, password, confirmPassword, institutionPassword, newInstitution,
    confirmInstitutionPassword, name, institutionName,
  } = req.body;

  // Transform the checkbox into a boolean
  const isNewInstitution = newInstitution === 'on';

  try {
    // Basic form handling
    if (!(password === confirmPassword)) throw new Error('\'Password\' and \'Confirm Password\' fields much match');
    if (!(institutionPassword === confirmInstitutionPassword) && isNewInstitution) {
      throw new Error('\'Institution Password\' and \'Confirm Institution Password\' fields much match');
    }
    if (name === undefined) throw new Error('Please enter a name');
    if (isNewInstitution && institutionName === undefined) throw new Error('Please enter an institution name');

    // Create a new Institution, if need be.
    if (isNewInstitution) {
      institution = new Institution({
        institutionName,
        institutionPassword,
      });

      // I'm not sure  I can get away with NOT  resolving a null promise below.
      promise = new Promise((resolve, rej) => {
        resolve(institution.save());
      });
    } else {
      promise = new Promise((resolve, rej) => {
        resolve(null);
      });
    }


    // Though email is a unique field, I don't want to rehash the password if a duplicate is
    // Found so I confirm that the user is new before doing anything with the information.
    promise.then(() => Institution.findOne({ institutionPassword })).then((i) => {
      foundInstitution = i;
      User.findOne({ email });
    })

      .then((user) => {
        if (user) {
          throw new Error('User already exists with that Email address');
        }
        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          admin: isNewInstitution,
          institution: foundInstitution._id,
          permissions: institution.defaultPermisions,
          institutionName: institution.institutionName,
        });
        return newUser.save();
      })
      .then((result) => {
        console.log(result);
        // Is it bad to send the plain text password back to login to make it easier to
        // Actually log in? I can probably work out a way to log the user in here automatically.
        res.redirect('/login');
      })
      .catch((err) => {
        console.log(err.message);
        res.redirect('/signup');
      });
  } catch (e) {
    console.log(e.message);
    res.redirect('/signup');
  }
};
