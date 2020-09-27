const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const Institution = require('../models/Institution');

exports.getLogin = (req, res, next) => {
  // console.log(req.flash('error'));
  res.render('auth/login', {
    errorMessage: req.flash('error'),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  let user;
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) throw new Error('No User Exists');
      user = foundUser;
      return bcrypt.compare(password, user.hashedPassword);
    })
    .then((isMatch) => {
      if (!isMatch) throw new Error('No user Found');
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save();
    })
    .then((err) => {
      res.redirect('/');
    })
    .catch((err) => {
      req.flash('error', 'invalid login');
      res.redirect('/login');
    });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: req.flash('error'),
  });
};

// I really dislike how long this is....
exports.postSignup = (req, res, next) => {
  let foundInstitution;
  let promise;
  let institution = null;
  const defaultPermissions = {};
  const {
    email,
    password,
    confirmPassword,
    institutionPassword,
    newInstitution,
    confirmInstitutionPassword,
    name,
    institutionName,
  } = req.body;

  // Transform the checkbox into a boolean
  const isNewInstitution = newInstitution === 'on';

  try {
    // Basic form handling
    if (!(password === confirmPassword)) { throw new Error("'Password' and 'Confirm Password' fields much match"); }
    if (
      !(institutionPassword === confirmInstitutionPassword)
      && isNewInstitution
    ) {
      throw new Error(
        "'Institution Password' and 'Confirm Institution Password' fields much match",
      );
    }
    if (name === undefined) throw new Error('Please enter a name');
    if (isNewInstitution && institutionName === undefined) { throw new Error('Please enter an institution name'); }

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
    promise
      .then(() => Institution.findOne({ institutionPassword }))
      .then((i) => {
        foundInstitution = i;
        if (!foundInstitution) throw new Error('No institution found');
        Object.assign(defaultPermissions, {
          readOnly: foundInstitution.defaultReadOnly,
          commentOnly: foundInstitution.defaultCommentOnly,
          admin: isNewInstitution,
        });
        return User.findOne({ email });
      })
      .then((user) => {
        if (user) {
          throw new Error('Invalid email or password');
        }
        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        const newUser = new User({
          name,
          email,
          hashedPassword,
          institution: foundInstitution._id,
          permissions: defaultPermissions,
          institutionName: foundInstitution.institutionName,
        });
        return newUser.save();
      })
      .then((result) => {
        // Is it bad to send the plain text password back to login to make it easier to
        // Actually log in? I can probably work out a way to log the user in here automatically.
        res.redirect('/login');
      })
      .catch((err) => {
        req.flash('error', err.message);
        res.redirect('/signup');
      });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
};
