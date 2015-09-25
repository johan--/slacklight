module.exports = {
  indexPairs(collection, currentIndex) {
    let lastIndex = collection.length-1;
    let prev, next;

    if (currentIndex === 0) {
      prev = lastIndex
      next = currentIndex+1
    } else if (currentIndex === lastIndex ) {
      prev = currentIndex-1
      next = 0
    } else {
      next = currentIndex+1
      prev = currentIndex-1
    }

    return {
      prev: prev,
      next: next,
    }
  }
}
