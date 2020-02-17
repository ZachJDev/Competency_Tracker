// use Chevron to display and hide skills 
(function chevronDisplayCompetencies() {
  try {
    const compAndSkill = document.querySelectorAll(".competency-and-skill");
    compAndSkill.forEach(el => {
      let skill = el.querySelector(".skill-list");
      el.querySelector(".competency .show-more, .role .show-more").addEventListener(
        "click",
        () => {
          skill.classList.toggle("hidden");
        }
      );
    });
  } catch (e) {
    console.log("error: ", e);
  }
})();

//show the skill edit and delete buttons
(function showSkillUtilities() {
  try {
    const skill = document.querySelectorAll(".catch");
    skill.forEach(el => {
      let skillEdit = el.querySelector(".skill-edit");
      let skillDelete = el.querySelector(".skill-delete");
      el.addEventListener("mouseover", () => {
        skillDelete.classList.toggle("invisible");
        if (!!skillEdit) skillEdit.classList.toggle("invisible"); //all of the places I want to use this have a skill-delete class, but not all have a skill-edit.
      });
      el.addEventListener("mouseout", () => {
        skillDelete.classList.toggle("invisible");
        if (!!skillEdit) skillEdit.classList.toggle("invisible");
      });
    });
  } catch (e) {
    console.log("error: ", e);
  }
})();

// show the subskill edit and delete buttons
(function showSubskillUtilities() {
  const subskill = document.querySelectorAll(".subskill");
  try {
    subskill.forEach(el => {
      let subskillDelete = el.querySelector(".subskill-delete");
      let subskillEdit = el.querySelector(".subskill-edit");
      if(!!subskillDelete){ //to stop errors from appearing when on role pages.
      el.addEventListener("mouseover", () => {
        subskillEdit.classList.toggle("invisible");
        subskillDelete.classList.toggle("invisible");
      });
    }
    if(!!subskillEdit){
      el.addEventListener("mouseout", () => {
        subskillEdit.classList.toggle("invisible");
        subskillDelete.classList.toggle("invisible");
      });
    }
    });
  } catch (e) {
    console.log("error: ", e);
  }
})();

//Search function for Competencies...
//I should do some refactoring to make this code work with competencies and roles.
(function search() {
  try {
    const compAndSkill = document.querySelectorAll(".competency-and-skill");
    const search = document.querySelector("input");
    search.addEventListener("input", () => {
      let expression = createRegex(search.value);
      console.log(expression);
      compAndSkill.forEach(el => {
        let competency = el.querySelector(".comp-heading");
        if (!expression.test(competency.textContent)) {
          el.classList.add("hidden");
        } else {
          el.classList.remove("hidden");
        }
        if (search.value === "") {
          el.classList.remove("hidden");
        }
      });
    });
  } catch (e) {
    console.log("error: ", e);
  }
})();

//autohide/show navmenu when resizing window
(function resize() {
  try {
    const navbuttons = document.querySelector("#navigation")
    window.addEventListener("resize", () => {
      if(window.innerWidth < 701){
        navbuttons.classList.add("hidden")}
      else navbuttons.classList.remove("hidden")
    })
  } catch (e) {}
})();

//expand navmenu for responsiveness
(function navmenuToggle() {
  try {
    const navmenu = document.querySelector(".navmenu");
    const  navbuttons = document.querySelector("#navigation")
    navmenu.addEventListener("click", () => {
      navbuttons.classList.toggle("hidden")
    });
  } catch (e) {}
})();

//creates the regular expression for the search function
const createRegex = function(string) {
  let words = string.split(" ");
  let expression = "";
  words.forEach((word, index, array) => {
    if (word == "") {
      expression = expression;
    } else if (index == 0) {
      expression += "(" + word + ")";
    } else expression += "|(" + word + ")";
  });
  return new RegExp(expression, "i");
};
