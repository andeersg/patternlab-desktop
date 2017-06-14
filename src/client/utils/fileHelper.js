import fs from 'fs';
import commandExists from 'command-exists';
import shortid from 'shortid';

const { dialog } = require('electron').remote;

export function checkEmptyness(path) {
  const files = fs.readdirSync(path);

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
    return projectType;
  }

  return false;
}

/**
 * Returns a promise that throws an error if command is not found.
 */
export function packageManagerIsInstalled() {
  return commandExists('npm');
}

function promptUser() {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, (folder) => {
      if (Array.isArray(folder)) {
        resolve(folder[0]);
      } else {
        reject('No folder selected');
      }
    });
  });
}

export function addProject(path = false) {
  return new Promise((resolve) => {
    if (path) {
      // Check path.
      return resolve(path);
    }

    return resolve(false);
  })
  .then((folder = false) => {
    if (!folder) {
      return promptUser();
    }
    return folder;
  })
  .then((folder) => {
    const projectObject = {};
    const empty = checkEmptyness(folder);
    projectObject.status = empty;
    projectObject.id = shortid.generate();

    if (!empty) {
      const validProject = validateProject(folder);
      if (validProject) {
        projectObject.type = validProject;
      } else {
        throw new Error('Invalid project');
      }
    }

    projectObject.path = folder;
    projectObject.name = folder.substr(folder.lastIndexOf('/') + 1);
    projectObject.added = Date.now();

    return projectObject;
  });
}
