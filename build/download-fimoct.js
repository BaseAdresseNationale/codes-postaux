const request = require('superagent')
const {sortBy, last} = require('lodash')
const decompress = require('decompress')

const DATAGOUV_API_URL = 'https://www.data.gouv.fr/api/1'
const DATASET_ID = '5a3cc6b588ee3858d95178fc'

async function getDatasetResources() {
  const result = await request.get(DATAGOUV_API_URL + '/datasets/' + DATASET_ID + '/')
  if (!result.body && !result.body.resources) {
    throw new Error('Unexpected response')
  }
  return result.body.resources
}

function isFIMOCTArchive(resource) {
  return resource.title.toLowerCase().includes('fimoct') && resource.format === 'zip'
}

function getMostRecent(resources) {
  return last(sortBy(resources, resource => new Date(resource.published)))
}

async function getLatestFIMOCTArchiveURL() {
  const resources = await getDatasetResources()
  const archives = resources.filter(isFIMOCTArchive)
  if (archives.length === 0) {
    throw new Error('No FIMOCT archive found')
  }
  const latestArchive = getMostRecent(archives)
  if (!latestArchive) {
    throw new Error('Unable to find the most recent FIMOCT archive')
  }
  return latestArchive.url
}

async function fetchAndExtractFIMOCT(url) {
  const response = await request.get(url)
    .buffer(true)
    .parse(request.parse['application/octet-stream'])
  const decompressedFiles = await decompress(response.body)
  const candidateFile = decompressedFiles.find(f => f.path.startsWith('FIMOCT'))
  if (!candidateFile) {
    throw new Error('Archive does not contain a FIMOCT file')
  }
  return candidateFile.data
}

async function getLatestFIMOCTFileBuffer() {
  const url = await getLatestFIMOCTArchiveURL()
  return fetchAndExtractFIMOCT(url)
}

async function getCurrentFIMOCTFileBuffer() {
  const url = 'https://static.data.gouv.fr/resources/fichiers-fimoca-et-fimoct-relatifs-aux-structures-de-la-dgfip/20180817-134116/FIMOCTT8Z00061.zip'
  return fetchAndExtractFIMOCT(url)
}

module.exports = {getLatestFIMOCTFileBuffer, getCurrentFIMOCTFileBuffer}
