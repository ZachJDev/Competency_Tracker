// use Chevron to display and hide skills
(function chevronDisplay() {
  try {
    const compAndSkill = document.querySelectorAll(".competency-and-skill");
    compAndSkill.forEach(el => {
      let skill = el.querySelector(".skill-list");
      el.querySelector(".competency .show-more").addEventListener(
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
    const skill = document.querySelectorAll(".skill");
    skill.forEach(el => {
      let skillEdit = el.querySelector(".skill-edit");
      let skillDelete = el.querySelector(".skill-delete");
      el.addEventListener("mouseover", () => {
        skillEdit.classList.toggle("invisible");
        skillDelete.classList.toggle("invisible");
      });
      el.addEventListener("mouseout", () => {
        skillEdit.classList.toggle("invisible");
        skillDelete.classList.toggle("invisible");
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
      el.addEventListener("mouseover", () => {
        subskillEdit.classList.toggle("invisible");
        subskillDelete.classList.toggle("invisible");
      });
      el.addEventListener("mouseout", () => {
        subskillEdit.classList.toggle("invisible");
        subskillDelete.classList.toggle("invisible");
      });
    });
  } catch (e) {
    console.log("error: ", e);
  }
})();

//Search function
(function search() {
  try {
    const search = document.querySelector("input");
    search.addEventListener("input", () => {
      compAndSkill.forEach(el => {
        let competency = el.querySelector(".comp-heading");
        if (
          !competency.textContent
            .toLowerCase()
            .includes(search.value.toLowerCase())
        ) {
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

