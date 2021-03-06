import fs from 'fs';
import mv from 'mv';
import { spawnSync } from 'child_process';
import commandExists from 'command-exists';
import shortid from 'shortid';
import getGulpTasks from 'get-gulp-tasks';
import getGruntTasks from 'get-grunt-tasks';
import request from 'request';
import decompress from 'decompress';

const { dialog, app } = require('electron').remote;
const debug = require('debug')('pl');

export function checkEmptyness(path) {
  const files = fs.readdirSync(path);

  if (files.length === 0) {
    return true;
  }
  return false;
}

export function validateProject(path) {
  debug('Validating project');
  const files = fs.readdirSync(path);

  const output = {
    valid: true,
    modulesInstalled: false,
    type: '',
  };

  const requiredFiles = [
    'patternlab-config.json',
    'package.json',
  ];

  requiredFiles.forEach((fileName) => {
    if (files.indexOf(fileName) === -1) {
      output.valid = false;
    }
  });

  if (files.indexOf('gulpfile.js') !== -1) {
    output.type = 'gulp';
  } else if (files.indexOf('Gruntfile.js') !== -1) {
    output.type = 'grunt';
  } else {
    output.valid = false;
  }

  if (files.indexOf('node_modules') !== -1) {
    output.modulesInstalled = true;
  }

  return output;
}

/**
 * Returns a promise that throws an error if command is not found.
 */
export function packageManagerIsInstalled() {
  debug('Checking if NPM command is present');
  return commandExists('npm');
}

function npmInstall(project) {
  debug('Run NPM install');
  return new Promise((resolve, reject) => {
    const args = [
      'install',
      '--prefix',
      project.path,
    ];

    const npmSpawn = spawnSync('npm', args);
    if (npmSpawn.status > 0) {
      debug('Unable to install dependencies');
      return reject('Unable to install dependencies.');
    }

    debug('NPM dependencies installed');
    return resolve(project);
  });
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

function moveFilesToDestination(tempLocation, destinationFolder) {
  const files = fs.readdirSync(tempLocation);
  const filePromises = [];
  files.forEach((file) => {
    const filePromise = new Promise((resolve, reject) => {
      mv(tempLocation + file, destinationFolder + file, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });

    filePromises.push(filePromise);

    return Promise.all(filePromises);
  });
}

function downloadProject(service) {
  let serviceLink = 'https://github.com/pattern-lab/edition-node-gulp/releases/download/v1.4.0/edition-node-gulp-1.4.0.zip';
  if (service === 'grunt') {
    serviceLink = 'https://github.com/pattern-lab/edition-node-grunt/archive/v1.2.0.zip';
  }

  const ts = Date.now();
  const tempPath = `${app.getPath('temp')}patternlab-${ts}.zip`;
  return new Promise((resolve, reject) => {
    request(serviceLink)
      .pipe(fs.createWriteStream(tempPath))
      .on('close', () => {
        resolve(tempPath);
      })
      .on('error', error => reject(error));
  })
  .then(path => decompress(path, `${app.getPath('temp')}patternlab-${ts}_extracted`))
  .then(files => `${app.getPath('temp')}patternlab-${ts}_extracted/${files[0].path}`);
}

function saveProjectFiles(project) {
  return downloadProject(project.type)
  .then(downloadedPath => moveFilesToDestination(downloadedPath, `${project.path}/`))
  .then(() => project);
}


function fetchTasks(project) {
  const newProject = project;
  return new Promise((resolve) => {
    resolve(true);
  })
  .then(() => {
    if (project.type === 'gulp') {
      return getGulpTasks(project.path);
    }
    return getGruntTasks(project.path);
  })
  .then((tasks) => {
    newProject.tasks = tasks;
    return newProject;
  });
}

export function addProject(path = false, updateLoading) {
  debug('Add new project');

  updateLoading('Setting up new project');

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
    debug(`Check if "${folder}" is empty`);
    updateLoading('Check if folder is ready');

    const projectObject = {};
    const empty = checkEmptyness(folder);

    projectObject.status = empty;
    projectObject.id = shortid.generate();
    projectObject.path = folder;
    projectObject.name = folder.substr(folder.lastIndexOf('/') + 1);
    projectObject.added = Date.now();

    if (!empty) {
      debug(`Validating "${folder}"`);

      const validProject = validateProject(folder);

      updateLoading('Validating folder');

      if (validProject.valid) {
        projectObject.type = validProject.type;
        projectObject.modules = validProject.modulesInstalled;
        debug(`"${folder}" is valid.`);
      } else {
        throw new Error('Invalid project');
      }
      return projectObject;
    }

    // @TODO For v1 we just use Gulp.
    projectObject.type = 'gulp';

    updateLoading('Downloading PatternLab');

    return saveProjectFiles(projectObject);
  })
  .then((projectObject) => {
    if (projectObject.modules) {
      debug('node_modules present, skipping npm install');
      return projectObject;
    }
    updateLoading('Installing dependencies');
    return npmInstall(projectObject);
  })
  .then(projectObject => fetchTasks(projectObject));
}
