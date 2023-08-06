const specialCharactoresSwitch = [
  [" ", "%20"],
  ["!", "%21"],
  ['"', "%22"],
  ["#", "%23"],
  ["$", "%24"],
  ["%", "%25"],
  ["&", "%26"],
  ["'", "%27"],
  ["(", "%28"],
  [")", "%29"],
  ["*", "%2A"],
  ["+", "%2B"],
  [",", "%2C"],
  ["-", "%2D"],
  [".", "%2E"],
  ["/", "%2F"],
  ['"', "%22"],
  ["@", "%40"],
  ["\\", "%5C"],
  ["~", "%7E"],
];

export const switchSpecialCharactores = (branch: string) => {
  const before = specialCharactoresSwitch.map((arr) => arr[0]);
  const after = specialCharactoresSwitch.map((arr) => arr[1]);

  for (let i = 0; i < before.length; i++) {
    if (branch.includes(before[i])) {
      branch.replace(before[i], after[i]);
    }
  }

  return Promise.resolve(branch);
};
