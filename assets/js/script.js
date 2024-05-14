// Functions that are executed after the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadBookmarks()
});

/**
 * This global object stores DOM elements in the cache.
 * The reason for this approach is to minimize the pollution caused 
 * by global variables and to keep the code maintainable and as short 
 * as possible by reducing repetitive code to retrieve DOM elements.
 */
const DOMCache = {
  cache: {},
  getElement: function (selector) {

    // Check if the element is already cached
    if (this.cache.hasOwnProperty(selector)) {
      return this.cache[selector];
    }

    // Query the DOM and cache the element if not already cached
    const element = document.querySelector(selector);
    this.cache[selector] = element;

    console.log("DOMCache:", this.cache)

    return element;
  }
};

// demo data
function demoData() {
  return [{
      url: "https://ioanzaharia.com/",
      title: "Ioan Zaharia personal portfolio",
    },
    {
      url: "https://caniuse.com/",
      title: "Browser compatibility",
    },
    {
      url: "https://www.google.com/",
      title: "",
    },
  ]
}

/**
 * Check and retrieve bookmarks from the local storage.
 * If no data is found, the demo data is stored in the local storage.
 */
function loadBookmarks() {
  const bookmarks = localStorage.getItem('bookmarks');

  if (!bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(demoData()));
    return demoData;
  }

  console.log(JSON.parse(bookmarks))
  return JSON.parse(bookmarks);
}