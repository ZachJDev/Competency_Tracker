const Competency = require("../../models/Competency.js");

function objectKeysToNumbers(object) {
  return Object.keys(object).map(key => Number(key));
}

async function findCompetencyIds(skillsObj) {
  let competencyIdsAndSkillNumbers = {};
  let competencyNumbers = objectKeysToNumbers(skillsObj);
  let promises = [];
  for (number of competencyNumbers) {
    promises.push(Competency.findOne({ number: number }, { number: 1 }));
  }
  const result = await Promise.all(promises);
  for (el of result) {
    if (el === null) continue;
    competencyIdsAndSkillNumbers[el._id] = skillsObj[el.number];
  }
  return competencyIdsAndSkillNumbers;
}

async function findSkillIds(competenciesAndSkills) {
  let justCompetencyIds = Object.keys(competenciesAndSkills);
  let newCompetenciesObject = {};
  let promises = [];
  for (let id of justCompetencyIds) {
    promises.push(Competency.findById(id).populate("skills"));
  }
  const comps = await Promise.all(promises);
  for (let id of justCompetencyIds) {
    let helper = comps.filter(el => el._id == id);
    let comp = helper[0];
    for (let skillNumber of competenciesAndSkills[id]) {
      if (skillNumber === 0) {
        skill = comp.skills.map(el => el._id);
      } else {
        skill = comp.skills.filter(el => el.number == skillNumber);
      }
      if (!newCompetenciesObject[id]) newCompetenciesObject[id] = [];
      newCompetenciesObject[id].push(...skill);
    }
  }
  return newCompetenciesObject;
}

function makeArrayForModel(competenciesAndSkills) {
  let keys = Object.keys(competenciesAndSkills);
  let newArray = [];
  keys.forEach(key => {
    let compsObject = { competency: key, skills: competenciesAndSkills[key] };
    newArray.push(compsObject);
  });
  return newArray;
}

module.exports = class CompetenciesAndSkills {
  constructor(skills, oldSkills = []) {
      this.skillsSet = new Set(oldSkills)
    this.unparsedSkills = skills;
    this.skillsMap = (() => {
      let competenciesAndSkills = {};
      let skillsArray = [];
      let skills = this.unparsedSkills.split(",");
      skills.forEach(skill => {
        if (!this.skillsSet.has(skill)) {
          this.skillsSet.add(skill);
          let splitSkills = skill.split("."); //this extra array makes sure that two or three digit competencies/skills will work too. those caused errors last time.
          skillsArray.push(splitSkills);
        }
      });
      for (let skill of skillsArray) {
        if (isNaN(skill[0])) continue;
        if (!competenciesAndSkills[skill[0]])
          competenciesAndSkills[skill[0]] = [];
        if (skill[1] === undefined) competenciesAndSkills[skill[0]].push(0);
        //zero to keep NaNs out of my code. this will end up just pushing every skill.
        else {
          competenciesAndSkills[skill[0]].push(Number(skill[1]));
          competenciesAndSkills[skill[0]].sort((a, b) => a - b);
        }
      }
      return competenciesAndSkills;
    })();
  }
  async init() {
    this.compIDAndSkills = await findCompetencyIds(this.skillsMap);
    this.compIdsAndSkillIds = await findSkillIds(this.compIDAndSkills);
    this.skillIdsArray = makeArrayForModel(this.compIdsAndSkillIds);
  }
  static fromIterator(array, oldArray = []) {
      return new CompetenciesAndSkills(array.join(), oldArray)
  }
};
