## Table of Contents

1. [Bookmark Manager](#bookmark-manager)
   - [User Story](#user-story)
   - [Acceptance Criteria](#acceptance-criteria)
   - [Additional Notes](#additional-notes)
2. [Features](#features)
3. [Usage](#usage)
4. [Technologies Used](#technologies-used)
   - [Languages](#languages)
   - [Tools](#tools)
5. [Key Functionalities](#key-functionalities)
6. [Manual Testing and Validation](#manual-testing-and-validation)
   - [Performance Testing with Lighthouse](#performance-testing-with-lighthouse)
   - [Accessibility Validation](#accessibility-validation)
   - [HTML and CSS Validation](#html-and-css-validation)
   - [JavaScript Functionality Testing](#javascript-functionality-testing)
   - [Browser Compatibility Testing](#browser-compatibility-testing)
7. [Version Control](#version-control)
8. [Deployment](#deployment)
9. [Credits](#credits)

## Bookmark Manager

The Bookmark Manager is a JavaScript application that allows users to manage their bookmarks. Users can add, edit, delete, and search bookmarks. The application stores bookmark data locally using the browser's localStorage.

## User Story

As a frequent internet user who often discovers interesting websites and resources, I want to organize and manage my bookmarks effectively, so that I can easily access them later and stay productive.

### Acceptance Criteria

- As a user, I can add new bookmarks by providing the URL and a descriptive title.
- I should be able to edit the titles or URLs of existing bookmarks if needed.
- It's essential for me to remove bookmarks that I no longer need.
- I need the ability to search through my bookmarks by title to quickly find what I'm looking for.
- The application should provide a responsive design.
- I expect the application to be intuitive and user-friendly, with clear instructions on how to use its features.

### Additional Notes

- It would be helpful to have features such as bookmark categorization or tagging to further organize my bookmarks.
- Integration with third-party bookmark syncing services like Google Chrome Sync or Firefox Sync would enhance the usability of the application.

## Features

- **Save Bookmarks**: Add new bookmarks by providing a URL and a title.
- **Edit Bookmarks**: Modify the URL and title of existing bookmarks.
- **Delete Bookmarks**: Remove unwanted bookmarks from collection.
- **Search Bookmarks**: Quickly find bookmarks by searching for keywords in their titles.
- **Bookmark Validation**: Ensures that bookmarks have valid URLs and non-empty titles.
- **Local Storage**: Bookmarks are stored locally in the browser, so the data persists across sessions.
- **Responsive Design**: The application is optimized for various screen sizes and devices.

## Usage

1. To add a new bookmark, enter the URL and title in the respective input fields, then click the "Save" button.
2. To edit a bookmark, click the pencil icon next to the bookmark you want to modify. Update the URL and title, then click "Update".
3. To delete a bookmark, click the trash icon next to the bookmark you want to remove, then confirm the deletion.
4. To search for bookmarks, start typing in the search input field. The list will dynamically update to show matching bookmarks.
5. To clear the search, click the "X" button or delete the text from the search input field.

## Technologies Used

### Languages

- **HTML**: Used for creating the structure and layout of the web application.
- **CSS**: Used for styling and design, enhancing the visual appearance of the application.
- **JavaScript**: Used to implement the core functionality of the bookmark manager application.

## Key Functionalities

- **Custom DOM Cache**:The Bookmark Manager utilizes a custom DOMCache object for caching DOM elements, improving performance by reducing repetitive code in retrieving elements from the document. This object enhances maintainability and readability while optimizing the application's efficiency.

- **Search Functionality**: The Bookmark Manager features a robust search functionality, allowing users to quickly find bookmarks by title. Search results are dynamically updated as users type their query, providing real-time feedback and enhancing usability.

- **Local Storage Integration**: Bookmark data is securely stored locally in the user's browser using the localStorage API. This integration enables data persistence across sessions, ensuring that users' bookmarks are retained even after closing and reopening the application.

- **URL Validation and Feedback**: During bookmark creation or update, the application validates the URL to ensure it is correctly formatted and functional. Users receive immediate feedback and warning messages if the URL is incorrect or if any fields are left empty, enhancing data integrity and user experience. A visual feedback icon indicate successful operations.

## Manual Testing and Validation

### Performance Testing with Lighthouse

placeholder here

### Accessibility Validation

The Bookmark Manager application prioritizes accessibility to ensure inclusivity for all users. Accessibility features were thoroughly tested and validated, meeting industry standards for web accessibility.

### HTML and CSS Validation

placeholder here

### JavaScript Validation

Each JavaScript function within the Bookmark Manager application was meticulously tested for errors and functionality using the browser console and JSHint tool. This rigorous testing process ensures the reliability and efficiency of the JavaScript codebase.

### Browser Compatibility Testing

The Bookmark Manager application underwent comprehensive browser compatibility testing across various web browsers, including:

- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

Browser testing ensures that the application functions seamlessly and maintains consistent performance across different browsers, enhancing user experience and accessibility.

## Version Control

### My Git Workflow

Throughout the development process, I utilized basic Git commands to manage version control effectively. I created a new repository on GitHub to host the application using Code Institute template for GitPod. All necessary files were included in the repository. Here are the main commands I used:

- git add <file>: Added specific files to the staging area before committing changes.
- git add.: To add all files to the staging area before committing changes.
- git commit -m "<message>": Commited the staged changes with descriptive messages to track the progress of the project.
- git push: Pushed local commits to the remote repository on GitHub, ensuring that the latest changes were synchronized with the online repository.
  By employing these commands, I maintained a structured and organized version control system.

## Deployment

### Hosting on GitHub Pages

For deploying the application, I utilized GitHub Pages. Here's how I deployed the application:

1. GitHub Pages Configuration: In the repository settings, I navigated to the "GitHub Pages" section and selected the main branch as the source for deployment.

2. Commit and Push: After ensuring that all changes were committed locally using git add and git commit, I pushed the commits to the remote repository using git push. This action triggered GitHub Pages to automatically build and deploy the application.

By following these steps, I successfully deployed the application through the GitHub Pages.

## Credits

A special thanks to my mentor, Spence, for his constructive feedback and professional expertise.

MDN Web Docs: Valuable reference for JavaScript documentation, including event handling, DOM manipulation, local storage, form validation, and error handling techniques.

CSS-Tricks: Helpful resource for CSS styling and responsive design principles.

W3Schools: Comprehensive tutorials and references for HTML, CSS, and JavaScript, providing insights into various programming concepts and techniques used in the project.

Can I Use: Essential resource for checking browser compatibility and understanding web technology support across different browsers.

The implementation of URL validation was influenced by an informative <a href="https://www.freecodecamp.org/news/how-to-validate-urls-in-javascript/" target="_blank">article</a> I found on FreeCodeCamp.org. Beyond this specific article, I didn't directly utilize code from other sources. My previous professional experience as a web developer and the learning materials from Code Institute was the main source of knowledge in building this application.

<a href="#table-of-contents">Back to Top</a>
