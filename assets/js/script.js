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

  // Event listeners for edit and delete handlers that open the modal
  DOMCache.getElements(".bookmark-item").forEach(function (button) {
    addEventListener("click", function (event) {
      const target = event.target;

      if (target.classList.contains("bookmark-edit")) {
        editBookmark(event);
      } else if (target.classList.contains("bookmark-delete")) {
        showDeleteConfirmation(event);
      }
    });
  });

  // Event listener for confirm delete button
  DOMCache.getElement("#btn-confirm-delete").addEventListener("click", confirmDelete);

  // Event listener for cancel delete button
  DOMCache.getElement("#btn-cancel-delete").addEventListener("click", closeModal);

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
 * @namespace DOMCache
 * @description This global object stores DOM elements in a cache to minimize global variable pollution,
 *              improve code maintainability, and reduce repetitive DOM queries.
 */
const DOMCache = {
  cache: {},

  /**
   * Retrieves a single DOM element by its selector.
   * If the element is already cached, returns the cached element.
   * Otherwise, queries the DOM, caches the element, and then returns it.
   *
   * @param {string} selector - The CSS selector of the element to retrieve.
   * @returns {Element|null} The DOM element matching the selector, or null if no match is found.
   */
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

  /**
   * Retrieves a NodeList of DOM elements by their selector.
   * If the elements are already cached, returns the cached NodeList.
   * Otherwise, queries the DOM, caches the NodeList, and then returns it.
   *
   * @param {string} selector - The CSS selector of the elements to retrieve.
   * @returns {NodeList} A NodeList of DOM elements matching the selector.
   */
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

/**
 * Provides a set of demo data containing URLs and titles.
 *
 * @returns {Array<Object>} An array of objects, each containing a URL and a title.
 */
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
 * Loads bookmarks from local storage.
 * On the first run or if the "bookmarks" entry in local storage is missing,
 * it initializes the local storage with demo data. If the user deletes all
 * bookmarks manually, the demo data will not be reloaded automatically.
 *
 * @returns {Array<Object>} An array of bookmark objects. Each object contains a URL and a title.
 */

function loadBookmarks() {
  const bookmarks = localStorage.getItem("bookmarks");

  // If no bookmarks are found in local storage, initialize with demo data
  if (!bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(demoData()));
    return demoData();
  }

  // Parse and return the bookmarks from local storage
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
 * Generates the HTML markup for a bookmark item.
 *
 * @param {string} url - The URL of the bookmark.
 * @param {string} title - The title of the bookmark.
 * @returns {string} The HTML string representing the bookmark item.
 */
function bookmarkMarkup(url, title) {
  return `
    <li class="bookmark-item">
      <a class="bookmark-url" href="${url}" target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-arrow-right"></i>
        ${title}
      </a>
      <div class="btn-group">
        <button aria-label="Edit bookmark">
          <i class="bookmark-edit fa-solid fa-pencil" data-url="${url}">
          </i>
          <span class="tooltip">Edit</span>
        </button>
        <button aria-label="Delete bookmark">
          <i class="bookmark-delete fa-solid fa-trash" data-url="${url}">
          </i>
          <span class="tooltip">Delete</span>
        </button>
      </div>
    </li>
  `;
}

/**
 * Renders the bookmarks list based on the current search query.
 * It loads bookmarks, filters them based on the search query, and updates the DOM accordingly.
 */
function renderBookmarks() {
  let bookmarks = loadBookmarks();
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const bookmarksCount = DOMCache.getElement("#bookmarks-count");
  const searchQuery = DOMCache.getElement("#bookmarks-search").value.trim();
  const clearBtn = DOMCache.getElement("#btn-clear");
  const bookmarkList = [];

  // Filter bookmarks based on the search query
  bookmarks = filterBookmarks(searchQuery, bookmarks);

  if (searchQuery) {
    clearBtn.style.display = "block";
    bookmarksCount.style.display = "block";

    if (!bookmarks.length) {
      bookmarksCount.innerText = `No bookmarks found!`;
      bookmarksCount.className = "warning-color";
    } else if (bookmarks.length === 1) {
      bookmarksCount.innerText = `1 bookmark found`;
      bookmarksCount.className = "success-color";
    } else {
      bookmarksCount.innerText = `${bookmarks.length} bookmarks found`;
      bookmarksCount.className = "success-color";
    }
  } else {
    clearBtn.style.display = "none";
    bookmarksCount.style.display = "none";
  }

  // Generate the HTML markup for each bookmark
  for (let bookmark of bookmarks) {
    bookmarkList.push(bookmarkMarkup(bookmark.url, bookmark.title));
  }

  // Update the DOM with the generated bookmark list
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
    if (bookmark.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
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
  displaySuccessFeedback();
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
  const updatedBookmark = {
    url,
    title,
  };
  bookmarks[index] = updatedBookmark;

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  closeModal();
  renderBookmarks();
  displaySuccessFeedback();
}

function showDeleteConfirmation(event) {
  const bookmarkElement = event.target.closest(".bookmark-item");
  const bookmarkUrl = bookmarkElement.querySelector(".bookmark-delete").dataset.url;
  const bookmarkTitle = bookmarkElement.querySelector(".bookmark-url").textContent.trim();
  const deleteMessage = DOMCache.getElement(".delete-message");
  deleteMessage.textContent = `Are you sure you want to delete "${bookmarkTitle}"?`;

  // Attach the bookmark element to the confirm button as a dataset
  const confirmButton = DOMCache.getElement("#btn-confirm-delete");
  confirmButton.dataset.bookmarkUrl = bookmarkUrl;

  openModal(null, "delete");
}

function confirmDelete() {
  const confirmButton = DOMCache.getElement("#btn-confirm-delete");
  const bookmarkUrl = confirmButton.dataset.bookmarkUrl;
  const bookmarks = loadBookmarks();

  const indexToDelete = bookmarks.findIndex((bookmark) => bookmark.url === bookmarkUrl);
  if (indexToDelete !== -1) {
    bookmarks.splice(indexToDelete, 1);
    const bookmarkElement = document.querySelector(`.bookmark-delete[data-url="${bookmarkUrl}"]`).closest(".bookmark-item");
    bookmarkElement.remove();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  } else {
    console.warn("Bookmark with URL", bookmarkUrl, "not found");
  }

  // Clean up the dataset
  delete confirmButton.dataset.bookmarkUrl;
  closeModal();
  displaySuccessFeedback();
}

function displaySuccessFeedback() {
  const successFeedback = DOMCache.getElement(".success-feedback");
  successFeedback.style.display = "block";
  setTimeout(() => {
    successFeedback.style.display = "none";
  }, 1500);
}

// Function to show the overlay with modal
function openModal(elementToFocus, displayModalContent) {
  const modal = DOMCache.getElement("#overlay");
  modal.style.display = "flex";

  if (displayModalContent === "edit-content") {
    const editMarkup = DOMCache.getElement(".edit-content");
    editMarkup.style.display = "flex";
  }

  if (displayModalContent === "warning-content") {
    const warningMarkup = DOMCache.getElement(".warning-content");
    warningMarkup.style.display = "block";
  }

  if (displayModalContent === "delete") {
    const deleteConfirmationContent = DOMCache.getElement(".delete-confirmation-content");
    deleteConfirmationContent.style.display = "block";
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
  const deleteConfirmationContent = DOMCache.getElement(".delete-confirmation-content");

  modal.style.display = "none";
  editMarkup.style.display = "none";
  warningMarkup.style.display = "none";
  deleteConfirmationContent.style.display = "none";

  // Focus the stored element and remove it from cache
  if (modal.elementToFocus) {
    modal.elementToFocus.focus();
    delete modal.elementToFocus;
  }
}
