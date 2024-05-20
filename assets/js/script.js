// Code that is executed after the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Functions that must be loaded initially
  loadBookmarks();
  renderBookmarks();

  // Event listeners for the search functionality
  DOMCache.getElement("#btn-clear").addEventListener("click", clearSearchHandler);
  DOMCache.getElement("#bookmarks-search").addEventListener("input", renderBookmarks);

  // Event listener for bookmark creation
  DOMCache.getElement("#btn-save").addEventListener("click", createNewBookmark);

  // Event listener for edit button using event delegation
  DOMCache.getElement(".bookmark-list").addEventListener("click", function (event) {
    if (event.target && event.target.matches(".bookmark-edit")) {
      editBookmark(event);
    }
  });

  // Event listener for delete button using event delegation
  DOMCache.getElement(".bookmark-list").addEventListener("click", function (event) {
    if (event.target && event.target.matches(".bookmark-delete")) {
      deleteBookmark(event);
    }
  });

  // Add event listener to close the modal with the Escape key
  document.addEventListener("keydown", function (event) {
    const modal = document.querySelector(".modal");
    if (modal && event.key === "Escape") {
      closeModal();
    }
  });

  // Prevent the overlay from closing if the click is inside the modal
  const overlay = DOMCache.getElement("#overlay");
  overlay.addEventListener("click", function (event) {
    if (!event.target.closest(".modal")) {
      closeModal();
    }
  });
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
  },
  getElements: function (selector) {
    // Check if the element is already cached
    if (this.cache.hasOwnProperty(selector)) {
      return this.cache[selector];
    }

    // Query the DOM and cache the elements
    const elements = document.querySelectorAll(selector);
    this.cache[selector] = elements;

    return elements;
  },
};

// demo data
function demoData() {
  return [
    {
      url: "https://ioanzaharia.com/",
      title: "Ioan Zaharia personal portfolio",
    },
    {
      url: "https://caniuse.com/",
      title: "Browser compatibility",
    },
    {
      url: "https://www.google.com/",
      title: "Google",
    },
  ];
}

/**
 * Check and retrieve bookmarks from the local storage.
 * If no data is found, the demo data is stored in the local storage.
 */
function loadBookmarks() {
  const bookmarks = localStorage.getItem("bookmarks");

  if (!bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(demoData()));
    return demoData;
  }

  return JSON.parse(bookmarks);
}

/**
 * Function to handle search input clearing state and button
 */
function clearSearchHandler() {
  const searchInput = DOMCache.getElement("#bookmarks-search");
  const clearBtn = DOMCache.getElement("#btn-clear");

  searchInput.value = "";
  searchInput.focus();
  clearBtn.style.display = "none";
  renderBookmarks();
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
        ${title}
      </a>
      <div class="btn-group">
        <button>
          <i class="bookmark-edit fa-solid fa-pencil" data-url="${url}"></i>
        </button>
        <button>
          <i class="bookmark-delete fa-solid fa-trash" data-url="${url}"></i>
        </button>
      </div>
    </li>
  `;
}

function renderBookmarks() {
  let bookmarks = loadBookmarks();
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const bookmarksCount = DOMCache.getElement("#bookmarks-count");
  const searchQuery = DOMCache.getElement("#bookmarks-search").value.trim();
  const clearBtn = DOMCache.getElement("#btn-clear");
  const noBookmarksFound = DOMCache.getElement("#no-bookmarks-found");
  const bookmarkList = [];

  bookmarks = filterBookmarks(searchQuery, bookmarks);

  if (searchQuery) {
    clearBtn.style.display = "block";
    bookmarksCount.style.display = "block";

    if (!bookmarks.length) {
      bookmarksCount.innerText = `No bookmarks found`;
    } else if (bookmarks.length === 1) {
      bookmarksCount.innerText = `1 bookmark found`;
    } else {
      bookmarksCount.innerText = `${bookmarks.length} bookmarks found`;
    }
  } else {
    clearBtn.style.display = "none";
    bookmarksCount.style.display = "none";
  }

  for (let bookmark of bookmarks) {
    bookmarkList.push(bookmarkMarkup(bookmark.url, bookmark.title));
  }

  bookmarksSection.innerHTML = bookmarkList.join("");
}

/**
 * Filters the array of bookmarks based on a search query.
 */
function filterBookmarks(searchQuery, bookmarks) {
  if (!searchQuery) {
    return bookmarks;
  }

  const filteredBookmarks = [];

  for (let bookmark of bookmarks) {
    if (bookmark.title.includes(searchQuery.trim())) {
      filteredBookmarks.push(bookmark);
    }
  }

  return filteredBookmarks;
}

/**
 * Check if the URL is valid.
 */
function isValidUrl(url) {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function validateBookmark(url, title, bookmarkUrl, bookmarkTitle) {
  const modalContent = DOMCache.getElement(".warning-content");
  const createWarningMessage = (message) => `<p class='warning'>${message}</p>`;

  const warnings = {
    emptyFields: createWarningMessage("You cannot save the bookmark with an empty URL and Title!"),
    emptyUrl: createWarningMessage("You must provide a valid URL! The URL field is empty."),
    emptyTitle: createWarningMessage("You must provide a Title! The Title field is empty."),
    invalidUrl: createWarningMessage("The URL is not valid! You can copy the URL from the address bar to ensure your URL is valid and functional."),
  };

  const displayModalContent = "warning-content";

  if (!url.trim() && !title.trim()) {
    modalContent.innerHTML = warnings.emptyFields;
    openModal(bookmarkUrl, displayModalContent);
    return false;
  }

  if (!url.trim()) {
    modalContent.innerHTML = warnings.emptyUrl;
    openModal(bookmarkUrl, displayModalContent);
    return false;
  }

  if (!title.trim()) {
    modalContent.innerHTML = warnings.emptyTitle;
    openModal(bookmarkTitle, displayModalContent);
    return false;
  }

  if (!isValidUrl(url)) {
    modalContent.innerHTML = warnings.invalidUrl;
    openModal(bookmarkUrl, displayModalContent);
    return false;
  }

  return true;
}

function createNewBookmark() {
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const bookmarkUrl = DOMCache.getElement("#bookmark-url");
  const bookmarkTitle = DOMCache.getElement("#bookmark-title");

  const url = bookmarkUrl.value;
  const title = bookmarkTitle.value;

  if (!validateBookmark(url, title, bookmarkUrl, bookmarkTitle)) {
    return;
  }

  const newBookmark = {
    url,
    title,
  };

  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  bookmarks.push(newBookmark);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  bookmarksSection.innerHTML += bookmarkMarkup(bookmarkUrl.value, bookmarkTitle.value);

  bookmarkUrl.value = "";
  bookmarkTitle.value = "";
}

function editBookmark(event) {
  const bookmarkUrl = event.target.dataset.url;
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  const editUrl = DOMCache.getElement("#edit-url");
  const editTitle = DOMCache.getElement("#edit-title");

  const indexToEdit = bookmarks.findIndex((bookmark) => bookmark.url === bookmarkUrl);
  const bookmarkToUpdate = bookmarks[indexToEdit];

  editUrl.value = bookmarkToUpdate.url;
  editTitle.value = bookmarkToUpdate.title;

  DOMCache.getElement("#btn-update").addEventListener("click", function () {
    editBookmarkHandler(bookmarks, indexToEdit, editUrl.value, editTitle.value);
  });

  const displayModalContent = "edit-content";

  openModal("", displayModalContent);
}

function editBookmarkHandler(bookmarks, index, url, title) {
  console.log("update handler triggered");
  const updatedBookmark = {
    url,
    title,
  };
  bookmarks[index] = updatedBookmark;

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  closeModal();
  renderBookmarks();
}

function deleteBookmark(event) {
  const bookmarkUrl = event.target.dataset.url;
  const bookmarkElement = event.target.closest(".bookmark-item");
  const bookmarks = loadBookmarks();

  const indexToDelete = bookmarks.findIndex((bookmark) => bookmark.url === bookmarkUrl);
  if (indexToDelete !== -1) {
    bookmarks.splice(indexToDelete, 1);
    bookmarkElement.remove();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  } else {
    console.warn("Bookmark with URL", bookmarkUrl, "not found");
  }
}

// Function to show the overlay with modal
function openModal(elementToFocus, displayModalContent) {
  const modal = DOMCache.getElement("#overlay");
  const modalContent = DOMCache.getElement("#modal-content");
  modal.style.display = "flex";

  if (displayModalContent === "edit-content") {
    const editMarkup = DOMCache.getElement(".edit-content");
    editMarkup.style.display = "block";
  }

  if (displayModalContent === "warning-content") {
    const warningMarkup = DOMCache.getElement(".warning-content");
    warningMarkup.style.display = "block";
  }

  // Store the element (input field) to be focused when the modal is closed
  if (elementToFocus) {
    modal.elementToFocus = elementToFocus;
  }
}

// Function to hide the overlay with modal
function closeModal() {
  const modal = DOMCache.getElement("#overlay");
  const editMarkup = DOMCache.getElement(".edit-content");
  const warningMarkup = DOMCache.getElement(".warning-content");

  modal.style.display = "none";
  editMarkup.style.display = "none";
  warningMarkup.style.display = "none";

  // Focus the stored element and remove it from cache
  if (modal.elementToFocus) {
    modal.elementToFocus.focus();
    delete modal.elementToFocus;
  }
}
