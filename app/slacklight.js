module.exports = {
  indexPairs(collection, currentIndex) {
    let lastIndex = collection.length-1;
    let prev, next;

    if (currentIndex === 0) {
      prev = parseFloat(lastIndex)
      next = parseFloat(currentIndex)+1
    } else if (currentIndex === lastIndex ) {
      prev = parseFloat(currentIndex)-1
      next = 0
    } else {
      next = parseFloat(currentIndex)+1
      prev = parseFloat(currentIndex)-1
    }

    return {
      prev: prev,
      next: next,
    }
  }
}
