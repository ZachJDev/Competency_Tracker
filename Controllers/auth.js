const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const Institution = require('../models/Institution');

exports.getLogin = (req, res, next) => {
  res.render('/login');
};

exports.getSignup = (req, res, next) => {
  res.render('signup');
};

exports.postSignup = (req, res, next) => {
  const {
    email, password, confirmPassword, institutionPassword, newInstitution, newInstitutionPassword,
    confirmInstitutionPassword,
  } = req.body;


  try {
    if (!(password === confirmPassword)) throw new Error('\'Password\' and \'Confirm Password\' fields much match');
    if (!(newInstitutionPassword === confirmInstitutionPassword)) {
      throw new Error('\'Institution Password\' and \'Confirm Institution Password\' fields much match');
    }
    // let institution;
    // Institution.findOne({});
    // Though email is a unique field, I don't want to rehash the password if a duplicate is found
    // So I confirm that the user is new before doing anything with the information.
    User.findOne({ email })
      .then((user) => {
        if (user) {
          throw new Error('User already exists');
        }
        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        const newUser = new User({
          email,
          password: hashedPassword,
          admin: newInstitution,

        });
        return newUser.save();
      }).then((result) => {
        res.redirect('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
};
