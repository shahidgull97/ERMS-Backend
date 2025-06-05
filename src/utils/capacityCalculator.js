export const calculateAvailableCapacity = (engineer) => {
  return engineer.currentCapacity;
};

export const calculateUtilization = (engineer) => {
  return (
    ((engineer.maxCapacity - engineer.currentCapacity) / engineer.maxCapacity) *
    100
  );
};

export const findBestMatchingEngineers = (requiredSkills, engineers) => {
  return engineers
    .filter((engineer) => {
      const engineerSkills = new Set(engineer.skills);
      return requiredSkills.every((skill) => engineerSkills.has(skill));
    })
    .sort((a, b) => {
      const aScore = calculateSkillMatchScore(a.skills, requiredSkills);
      const bScore = calculateSkillMatchScore(b.skills, requiredSkills);
      return bScore - aScore;
    });
};

const calculateSkillMatchScore = (engineerSkills, requiredSkills) => {
  const matchCount = requiredSkills.filter((skill) =>
    engineerSkills.includes(skill)
  ).length;
  return (matchCount / requiredSkills.length) * 100;
};
