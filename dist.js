const mustache = require('mustache')
const promisify = require('promisify-node')
const fs = promisify('fs')
const path = require('path')

const OUTDIR = 'dist' + path.sep

function error(err) {
  console.log(err)
  process.exit(1)
}

function copy(from, to) {
  console.log('copying', from, 'to', to)
  fs.readFile(from)
    .then(data => fs.writeFile(to, data))
    .catch(error)
}

function readAllFilesInFolder(folder) {
  return fs.readdirSync(folder).map(file => ({
    name: file,
    data: fs.readFileSync(folder + path.sep + file).toString('utf8')
  }))
}

function mkdirp(dir) {
  let current = ''
  dir.split(path.sep).forEach(part => {
    current += part + path.sep
    try {
      fs.mkdirSync(current)
    } catch (e) {}
  })
}

function apply(template, lang) {
  const rendered = mustache.render(template.data, JSON.parse(lang.data))
  const langdir = OUTDIR + lang.name.replace('.json', path.sep)
  const dist = langdir + template.name
  mkdirp(langdir)
  console.log('writing', dist)
  fs.writeFile(dist, rendered)
}

// 1. copy index.html to dist/
mkdirp(OUTDIR)
copy('index.html', OUTDIR + 'index.html')

// 2. apply templates
readAllFilesInFolder('templates').forEach(template =>
  readAllFilesInFolder('langs').forEach(lang => apply(template, lang)))
