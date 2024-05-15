// Code that is executed after the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Functions that must be loaded initially
  loadBookmarks()
  renderBookmarks()

  // Event listeners for the search functionality
  DOMCache.getElement("#btn-clear").addEventListener("click", clearSearchHandler)
  DOMCache.getElement("#bookmarks-search").addEventListener("input", renderBookmarks)

  // Event listener for bookmark creation
  DOMCache.getElement("#btn-save").addEventListener("click", createNewBookmark)

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

  return JSON.parse(bookmarks);
}

/**
 * Function to handle search input clearing state and button
 */
function clearSearchHandler() {
  const searchInput = DOMCache.getElement("#bookmarks-search")
  const clearBtn = DOMCache.getElement("#btn-clear")

  searchInput.value = '';
  searchInput.focus();
  clearBtn.style.display = 'none';
}

/**
 * Generates the markup for a bookmark.
 * If the title is empty, the URL will be displayed as the title.
 */
function bookmarkMarkup(url, title) {
  return `
    <li class="bookmark-item">
      <a class="bookmark-url" href="${url}" target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-arrow-right"></i>
        ${title ? title : url}
      </a>
      <div class="btn-group">
        <i id="bookmark-edit" class="fa-solid fa-pencil"></i>
        <i id="bookmark-delete" class="fa-solid fa-trash"></i>
      </div>
    </li>
  `;
}

function renderBookmarks() {
  let bookmarks = loadBookmarks();
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const searchQuery = DOMCache.getElement("#bookmarks-search").value.trim()
  const clearBtn = DOMCache.getElement("#btn-clear")
  const bookmarkList = []

  if (searchQuery) {
    clearBtn.style.display = 'block';
  } else {
    clearBtn.style.display = 'none';
  }

  bookmarks = filterBookmarks(searchQuery, bookmarks)

  for (let bookmark of bookmarks) {
    bookmarkList.push(bookmarkMarkup(bookmark.url, bookmark.title));
  };

  bookmarksSection.innerHTML = bookmarkList.join('')
}

/**
 * Filters an array of bookmarks based on a search query.
 */
function filterBookmarks(searchQuery, bookmarks) {
  if (!searchQuery) {
    return bookmarks
  }

  const filteredBookmarks = []

  for (let bookmark of bookmarks) {
    if (bookmark.url.includes(searchQuery.trim()) || bookmark.title.includes(searchQuery.trim())) {
      filteredBookmarks.push(bookmark);
    }
  }

  return filteredBookmarks;
}

function createNewBookmark() {
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const bookmarkUrl = DOMCache.getElement("#bookmark-url")
  const bookmarkTitle = DOMCache.getElement("#bookmark-title")

  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

  const newBookmark = {
    url: bookmarkUrl.value,
    title: bookmarkTitle.value || "",
  }

  bookmarks.push(newBookmark);

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  bookmarksSection.innerHTML += bookmarkMarkup(bookmarkUrl.value, bookmarkTitle.value)

  bookmarkUrl.value = ''
  bookmarkTitle.value = ''
}