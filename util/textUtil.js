const capitalizeWord = (word) => {
  return word.substring(0,1).toUpperCase() + word.substring(1);
}

module.exports = { capitalizeWord }
