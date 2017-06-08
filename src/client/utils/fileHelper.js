import fs from 'fs';

export function checkEmptyness(path) {
  console.log('Checking', path, 'for emptiness');
  const files = fs.readdirSync(path);
  console.log(files);
  if (files.length === 0) {
    return true;
  }
  return false;
}

export function validateProject(path) {
  const files = fs.readdirSync(path);
  let projectType = false;
  const requiredFiles = [
    'patternlab-config.json',
    'package.json',
  ];

  let requiredFilesPresent = true;

  requiredFiles.forEach((fileName) => {
    if (files.indexOf(fileName) === -1) {
      requiredFilesPresent = false;
    }
  });

  if (files.indexOf('gulpfile.js') !== -1) {
    projectType = 'gulp';
  } else if (files.indexOf('Gruntfile.js') !== -1) {
    projectType = 'grunt';
  }

  if (requiredFilesPresent && projectType) {
    console.log('All good, this looks like a patternlab project.');
    return projectType;
  }

  console.log('Hm, dis does not look like a PL Project.');
  return false;
}
