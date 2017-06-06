const fs = window.require('fs');

export function checkEmptyness(path) {
  console.log('Checking', path, 'for emptiness');
  const files = fs.readdirSync(path);
  console.log(files);
  if (files.length === 0) {
    return true;
  }
  return false;
}