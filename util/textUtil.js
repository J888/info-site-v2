const capitalizeWord = (word) => {
  return word.substring(0,1).toUpperCase() + word.substring(1);
}

const firstWords = (string, numFirstWords) => {
  return string.split(' ').splice(0, numFirstWords).join(' ')
}

module.exports = { capitalizeWord, firstWords }
