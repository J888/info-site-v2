const capitalizeWord = (word) => {
  return word.substring(0,1).toUpperCase() + word.substring(1);
}

const firstWords = (string, numFirstWords) => {
  return string.split(' ').splice(0, numFirstWords).join(' ')
}

const firstWordsWithEllipses = (string, numFirstWords) => {
  const words = string.split(' ');
  if(words.length <= numFirstWords) {
    return string;
  } else {
    return `${firstWords(string, numFirstWords)}...`
  }
}

module.exports = { capitalizeWord, firstWords, firstWordsWithEllipses }
