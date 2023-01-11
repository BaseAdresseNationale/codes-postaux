const { Transform } = require("node:stream");
const split = require("split2");
const toArray = require("get-stream").array;
const { trimStart } = require("lodash");
const intoStream = require("into-stream");
const { loadIgnoreList } = require("./ignore-list");
const { loadAddList } = require("./add-list");

function eachLine(line, ignoreList, cb) {
  if (line.substr(0, 1).trim() === "") return cb();

  const codeTopographique = line.slice(0, 9).trim();

  let codeCommune = undefined;
  let codeVoie = "XXXX";

  if (codeTopographique.length === 5) {
    codeCommune = codeTopographique;
  }
  if (codeTopographique.length === 9) {
    codeCommune = codeTopographique.slice(0, 5);
    codeVoie = codeTopographique.slice(5, 9);
  }

  //Slicing the row to extract data
  let dateValiditeLimite = line.slice(9, 17).trim()
  const codeParite = line.slice(17, 18).trim();
  const numeroBorneSuperieure = line.slice(18, 22).trim();
  let repetitionBorneSuperieure = line.slice(22, 23).trim();
  const numeroBorneInferieure = line.slice(23, 27).trim();
  const repetitionBorneInferieur = line.slice(27, 28).trim();
  const dateEffet = line.slice(28, 36).trim();
  const codePostal = line.slice(36, 41).trim();
  const libelleAcheminement = line.slice(41, 73).trim();
  const indicateurPluridistribution = line.slice(73, 74).trim();
  const codeLocalite = line.slice(74, 79).trim();
  const autreLibelle = line.slice(79, 117).trim();
  const codeDistribution = line.slice(117, 118).trim();
  const codeTypeAdresse = line.slice(118, 119).trim();
  const typeCodePostal = line.slice(119, 120).trim();

  //Specific formating case
  //if validity date is '99999999', the date is unkwnown
  dateValiditeLimite =
    dateValiditeLimite === "99999999" ? '' : dateValiditeLimite;
  //if 'repetition' is '9' for 'borne supérieure', repetition is undefined
  repetitionBorneSuperieure =
    repetitionBorneSuperieure === "9" ? '' : repetitionBorneSuperieure;

  if (!/(\d{5})/.test(codePostal)) return cb();
  if (codeCommune.startsWith("B")) return cb(); // On ignore les codes postaux de pays étrangers
  if (codeCommune === "06900") return cb(); // On ignore Monaco
  if (codeCommune === "97123") return cb(); // On ignore Saint-Barthelemy
  if (codeCommune === "97127") return cb(); // On ignore Saint-Martin

  // On ignore tous les couples codeCommune/codePostal renseignés dans le fichier CSV ignore-list.csv
  if (
    codeCommune in ignoreList &&
    ignoreList[codeCommune].some((item) => item.codePostal === codePostal)
  ) {
    return cb();
  }

  const result = {
    codePostal,
    codeCommune,
    libelleAcheminement,
    codeVoie,
  };

  // if (indicateurAdressage) result.indicateurAdressage = indicateurAdressage;
  if (codeParite) {
    result.codeParite = codeParite;
  }

  if (numeroBorneInferieure) {
    result.borneInferieure = {
      numero: Number.parseInt(numeroBorneInferieure, 10),
      repetition: repetitionBorneInferieur
        ? repetitionBorneInferieur
        : undefined,
    };
  }

  if (numeroBorneSuperieure) {
    result.borneSuperieure = {
      numero: Number.parseInt(numeroBorneSuperieure, 10),
      repetition: repetitionBorneSuperieure
        ? repetitionBorneSuperieure
        : undefined,
    };
  }

  cb(null, result);
}

async function formatSourceFileContent(buffer) {
  const ignoreList = await loadIgnoreList();
  const addList = await loadAddList();

  const rows = await toArray(
    intoStream(buffer)
      .pipe(split())
      .pipe(
        new Transform({
          transform(line, enc, cb) {
            eachLine(line, ignoreList, cb);
          },
          objectMode: true,
        })
      )
  );

  return [...rows, ...addList];
}

module.exports = { formatSourceFileContent };
