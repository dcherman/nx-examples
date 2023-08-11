const process = require('node:process');
const {join} = require('node:path');
const { mkdir, access, readFile, writeFile } = require('node:fs/promises');
const {createCustomRunner} = require('nx-remotecache-custom');

module.exports = module.exports.default = createCustomRunner(async () => {
  const MOCK_CACHE_DIRECTORY = process.env.MOCK_CACHE_DIRECTORY || join(process.cwd(), '.mock-cache');

  await mkdir(MOCK_CACHE_DIRECTORY, {recursive: true});

  async function fileExists(filename) {
    try {
      await access(join(MOCK_CACHE_DIRECTORY, filename));
      return true;
    } catch {
      return false;
    }
  }

  return {
    // name is used for logging purposes
    name: "Mock Remote Storage",
    fileExists,
    retrieveFile: (filename) => readFile(join(MOCK_CACHE_DIRECTORY, filename)),
    storeFile: (filename, buffer) => writeFile(join(MOCK_CACHE_DIRECTORY, filename), buffer),
  };
});