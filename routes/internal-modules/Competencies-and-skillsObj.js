/* eslint-disable no-restricted-syntax */
const Competency = require('../../models/Competency.js');

function objectKeysToNumbers(object) {
  return Object.keys(object).map((key) => Number(key));
}

async function findCompetencyIdsAndSkillNumbers(skillsObj, institution) {
  const competencyIdsAndSkillNumbers = {};
  const competencyNumbers = objectKeysToNumbers(skillsObj);
  const promises = [];
  for (const number of competencyNumbers) {
    promises.push(Competency.findOne({ number, institution }, { number: 1 }));
  }
  const result = await Promise.all(promises);
  for (const el of result) {
    if (el !== null) competencyIdsAndSkillNumbers[el._id] = skillsObj[el.number];
  }

  return competencyIdsAndSkillNumbers;
}

async function findSkillIds(competenciesAndSkills) {
  const justCompetencyIds = Object.keys(competenciesAndSkills);
  const newCompetenciesObject = {};
  const promises = [];
  for (const id of justCompetencyIds) {
    promises.push(Competency.findById(id).populate('skills'));
  }
  const comps = await Promise.all(promises);
  for (const id of justCompetencyIds) {
    const comp = comps.filter((el) => el._id == id)[0];
    for (const skillNumber of competenciesAndSkills[id]) {
      let skill;
      if (skillNumber === 0) {
        skill = comp.skills.map((el) => el._id);
      } else {
        skill = comp.skills.filter((el) => el.number === skillNumber);
      }
      if (!newCompetenciesObject[id]) newCompetenciesObject[id] = [];
      newCompetenciesObject[id].push(...skill);
    }
  }
  return newCompetenciesObject;
}

function makeArrayForModel(competenciesAndSkills) {
  const keys = Object.keys(competenciesAndSkills);
  const newArray = [];
  keys.forEach((key) => {
    const compsObject = { competency: key, skills: competenciesAndSkills[key] };
    newArray.push(compsObject);
  });
  return newArray;
}

module.exports = class CompetenciesAndSkills {
  constructor(skills, institution, oldSkills = []) {
    this.institution = institution;
    this.skillsSet = new Set(oldSkills);
    this.unparsedSkills = skills;
    // IIFE below. outputs: {compNum: [skills], compNum: [skills],...}
    this.skillsMap = (() => {
      const competenciesAndSkills = {};
      const skillsArray = [];
      const s = this.unparsedSkills;

      s.forEach((skill) => {
        this.skillsSet.add(skill);
      });

      Array.from(this.skillsSet).forEach((skill) => {
        const splitSkills = skill.split('.'); // this extra array makes sure that two or three digit competencies/skills will work too. those caused errors last time.
        skillsArray.push(splitSkills);
      });
      // skillsArray: [[compNum, skillNum], [compNum, skillNum]...]

      for (const skill of skillsArray) {
        if (isNaN(skill[0])) {
          throw new TypeError(`'${skill[0]}' is not a valid competency`);
        }
        if (!competenciesAndSkills[skill[0]]) { competenciesAndSkills[skill[0]] = []; }
        // zero to keep NaNs out of my code. this will end up just pushing every skill.
        if (skill[1] === undefined) competenciesAndSkills[skill[0]].push(0);

        /** Only pushes skills if it isn't pushing 0 (i.e. all skills).
        When writing this, I'm assuming that the whole competency will
        be at index 0 if it's present at all. This is how the multi-select works,
        but if that changes, I need to fix it here too.* */
        else if (competenciesAndSkills[skill[0]][0] !== 0) {
          competenciesAndSkills[skill[0]].push(Number(skill[1]));
          competenciesAndSkills[skill[0]].sort((a, b) => a - b);
        }
      }
      return competenciesAndSkills;
    })();
  }

  async init() {
    this.compIdAndSkills = await findCompetencyIdsAndSkillNumbers(this.skillsMap, this.institution);
    this.compIdsAndSkillIds = await findSkillIds(this.compIdAndSkills, this.institution);
    this.skillIdsArray = makeArrayForModel(this.compIdsAndSkillIds);
  }

  static fromIterator(array, oldArray = []) {
    return new CompetenciesAndSkills(array.join(), oldArray);
  }
};
