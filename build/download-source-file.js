const got = require('got')
const {sortBy, last} = require('lodash')
const decompress = require('decompress')
const fs = require('fs');

const DATAGOUV_API_URL = '...'
const DATASET_ID = '...'

async function getDatasetResources() {
  const result = await got(DATAGOUV_API_URL + '/datasets/' + DATASET_ID + '/', {responseType: 'json'})
  if (!result.body && !result.body.resources) {
    throw new Error('Unexpected response')
  }

  return result.body.resources
}

function isAcheminementArchive(resource) {
  return resource.title.toLowerCase().includes('acheminement') && resource.format === 'zip'
}

function getMostRecent(resources) {
  return last(sortBy(resources, resource => new Date(resource.published)))
}

async function getLatestArchiveURL() {

  // const resources = await getDatasetResources()
  // const archives = resources.filter(resource => isAcheminementArchive(resource))
  // if (archives.length === 0) {
  //   throw new Error('No ACHEMINEMENT archive found')
  // }

  // const latestArchive = getMostRecent(archives)
  // if (!latestArchive) {
  //   throw new Error('Unable to find the most recent ACHEMINEMENT archive')
  // }

  // return latestArchive.url

  return
}

async function fetchAndExtractFromURL(url) {

  // const response = await got(url, {responseType: 'buffer'})
  // const decompressedFiles = await decompress(response.body)
  // const candidateFile = decompressedFiles.find(f => f.path.startsWith('ACHEMINEMENT'))
  // if (!candidateFile) {
  //   throw new Error('Archive does not contain a ACHEMINEMENT file')
  // }
  // return candidateFile.data

  const response = fs.readFileSync('./data/Example_nouveau_fichier_ACHEMINEMENT.txt', "utf8");
  return response
}

async function getLatestSourceFileBuffer() {
  const url = await getLatestArchiveURL()
  return fetchAndExtractFromURL(url)
}

module.exports = {getLatestSourceFileBuffer}
