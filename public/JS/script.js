// use Chevron to display and hide skills
(function chevronDisplayCompetencies() {
  try {
    const compAndSkill = document.querySelectorAll('.competency-and-skill');
    compAndSkill.forEach((el) => {
      const skill = el.querySelector('.skill-list');
      el.querySelector('.competency .show-more, .role .show-more').addEventListener(
        'click',
        () => {
          skill.classList.toggle('hidden');
        },
      );
    });
  } catch (e) {
    console.log('error: ', e);
  }
}());

// show the skill edit and delete buttons
(function showSkillUtilities() {
  try {
    const skill = document.querySelectorAll('.catch');
    skill.forEach((el) => {
      const skillEdit = el.querySelector('.skill-edit');
      const skillDelete = el.querySelector('.skill-delete');
      el.addEventListener('mouseover', () => {
        skillDelete.classList.toggle('invisible');
        if (skillEdit) skillEdit.classList.toggle('invisible'); // all of the places I want to use this have a skill-delete class, but not all have a skill-edit.
      });
      el.addEventListener('mouseout', () => {
        skillDelete.classList.toggle('invisible');
        if (skillEdit) skillEdit.classList.toggle('invisible');
      });
    });
  } catch (e) {
    console.log('error: ', e);
  }
}());

// show the subskill edit and delete buttons
(function showSubskillUtilities() {
  const subskill = document.querySelectorAll('.subskill');
  try {
    subskill.forEach((el) => {
      const subskillDelete = el.querySelector('.subskill-delete');
      const subskillEdit = el.querySelector('.subskill-edit');
      if (subskillDelete) { // to stop errors from appearing when on role pages.
        el.addEventListener('mouseover', () => {
          subskillEdit.classList.toggle('invisible');
          subskillDelete.classList.toggle('invisible');
        });
      }
      if (subskillEdit) {
        el.addEventListener('mouseout', () => {
          subskillEdit.classList.toggle('invisible');
          subskillDelete.classList.toggle('invisible');
        });
      }
    });
  } catch (e) {
    console.log('error: ', e);
  }
}());

// Search function for Competencies...
// I should do some refactoring to make this code work with competencies and roles.
(function search() {
  try {
    const compAndSkill = document.querySelectorAll('.competency-and-skill');
    const search = document.querySelector('input');
    search.addEventListener('input', () => {
      const expression = createRegex(search.value);
      console.log(expression);
      compAndSkill.forEach((el) => {
        const competency = el.querySelector('.comp-heading');
        if (!expression.test(competency.textContent)) {
          el.classList.add('hidden');
        } else {
          el.classList.remove('hidden');
        }
        if (search.value === '') {
          el.classList.remove('hidden');
        }
      });
    });
  } catch (e) {
    console.log('error: ', e);
  }
}());

// autohide/show navmenu when resizing window
(function resize() {
  try {
    const navbuttons = document.querySelector('#navigation');
    window.addEventListener('resize', () => {
      if (window.innerWidth < 701) {
        navbuttons.classList.add('nav-hidden');
      } else navbuttons.classList.remove('nav-hidden');
    });
  } catch (e) {}
}());

// expand navmenu for responsiveness, collapse on outside click
(function navmenuToggle() {
  try {
    const body = document.querySelector('.body-content');
    const navmenu = document.querySelector('.navmenu');
    const navbuttons = document.querySelector('#navigation');
    navmenu.addEventListener('click', () => {
      navbuttons.classList.toggle('nav-hidden');
    });
    body.addEventListener('click', () => {
      if (!navbuttons.classList.contains('nav-hidden')) navbuttons.classList.add('nav-hidden');
    });
  } catch (e) {}
}());

// creates the regular expression for the search function
const createRegex = function (string) {
  const words = string.split(' ');
  let expression = '';
  words.forEach((word, index, array) => {
    if (word == '') {
      expression = expression;
    } else if (index == 0) {
      expression += `(${word})`;
    } else expression += `|(${word})`;
  });
  return new RegExp(expression, 'i');
};

// Show/Hide options for new institutions
(function institutionNameToggle() {
  try {
    const input = document.getElementById('newInstitutionName');
    const password = document.getElementById('confirmNewPassword');
    const checkbox = document.getElementById('newInstitution');
    checkbox.addEventListener('change', () => {
      input.classList.toggle('hidden');
      password.classList.toggle('hidden');
    });
  } catch (e) {

  }
}());
