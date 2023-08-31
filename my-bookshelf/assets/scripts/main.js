const bookList = [];
let filteredBooks = [];
const RENDER_EVENT = "render-bookshelf";
const RENDER_FILTERED = "render-filtered";
const STORAGE_KEY = "BOOKSHELF";

const addButton = document.getElementById("addBookButton");
const cancelBookButton = document.getElementById("cancelBookButton");
addButton.onclick = showModalAdd;
cancelBookButton.onclick = hideModalAdd;

const searchForm = document.getElementById("searchBook");
const addBookForm = document.getElementById("inputBook");
const bookDesignForm = document.getElementById("bookDesignForm");
const inputsDesignForm = document.querySelectorAll("#inputBook input");

function updateBookDesign(input, bookDesignForm) {
  if (input.type !== "checkbox") {
    const targetClass = `.book_design__${input.name}`;
    if (input.name === "inputBookColor") {
      bookDesignForm.style.backgroundColor = input.value;
    } else {
      const bookDesign = bookDesignForm.querySelector(targetClass);
      bookDesign.innerText = input.value;
    }
  }
}

inputsDesignForm.forEach((input) => {
  input.addEventListener("input", function () {
    updateBookDesign(input, bookDesignForm);
  });
});

function addBook() {
  const id = +new Date();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const bgColor = document.getElementById("inputBookColor").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const dataBook = newBookObj(id, title, author, year, bgColor, isComplete);

  bookList.push(dataBook);
  saveBookData();
  showSuccessMessage(dataBook.title);
  clearField(inputsDesignForm);
  hideModalAdd();
  dispatchEvent(new Event(RENDER_EVENT));
}

function newBookObj(id, title, author, year, bgColor, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
    bgColor,
  };
}

function createBookElement(bookObj) {
  const { id, title, author, year, bgColor, isComplete } = bookObj;

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book_item_wrapper");
  const articleContainer = document.createElement("article");
  articleContainer.classList.add("book_item", "book_design");
  articleContainer.style.backgroundColor = bgColor;
  articleContainer.innerHTML = `
  <h3 class="book_design__title">${title}</h3>
  <p class="book_design__author">${author}</p>
  <p class="book_design__year">${year}</p>
  `;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("book_action");
  buttonContainer.setAttribute("id", id);

  function createButtonElement({ className, iconClass, text, clickHandler }) {
    const button = document.createElement("button");
    button.classList.add(className);
    button.innerHTML = `<i class="${iconClass}"></i>${text}`;
    button.addEventListener("click", clickHandler);
    return button;
  }

  const btnUnRead = {
    className: "btnUnread",
    iconClass: "fa-solid fa-book-open",
    text: "Belum selesai",
    clickHandler: () => {
      Swal.fire({
        title: `Pindahkan ${title} ke belum selesai dibaca?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: bgColor,
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
      }).then((result) => {
        if (result.isConfirmed) {
          markAsUnRead(id);
          Swal.fire("Berhasil!", "Buku berhasil dipindahkan");
        }
      });
    },
  };

  const btnRead = {
    className: "btnRead",
    iconClass: "fa-solid fa-book",
    text: "Selesai",
    clickHandler: () => {
      Swal.fire({
        title: `Pindahkan ${title} ke selesai dibaca?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: bgColor,
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
      }).then((result) => {
        if (result.isConfirmed) {
          markAsRead(id);
          Swal.fire("Berhasil!", "Buku berhasil dipindahkan");
        }
      });
    },
  };

  const btnEdit = {
    className: "btnEdit",
    iconClass: "fa-regular fa-pen-to-square",
    text: "Edit",
    clickHandler: () => {
      editBook(id);
    },
  };

  const btnDelete = {
    className: "btnDelete",
    iconClass: "fa-solid fa-trash",
    text: "Delete",
    clickHandler: () => {
      Swal.fire({
        title: `Hapus ${title}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: bgColor,
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
      }).then((result) => {
        if (result.isConfirmed) {
          removeBook(id);
          Swal.fire("Berhasil!", `Buku ${title} sudah dihapus`, "success");
        }
      });
    },
  };

  if (isComplete) {
    buttonContainer.append(createButtonElement(btnUnRead));
  } else {
    buttonContainer.append(createButtonElement(btnRead));
  }

  buttonContainer.append(
    createButtonElement(btnEdit),
    createButtonElement(btnDelete)
  );
  bookContainer.append(articleContainer, buttonContainer);

  return bookContainer;
}

function findBookIndex(bookId) {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookList.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveBookData();
}

function findBook(bookId) {
  for (const bookTarget of bookList) {
    if (bookTarget.id === bookId) {
      return bookTarget;
    }
  }
  return null;
}

function markAsRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function markAsUnRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  saveBookData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  const titleInput = document.getElementById("editBookTitle");
  const authorInput = document.getElementById("editBookAuthor");
  const yearInput = document.getElementById("editBookYear");
  const bgColorInput = document.getElementById("editBookColor");
  const isCompleteInput = document.getElementById("editBookIsComplete");
  const cancelEditButton = document.getElementById("cancelEditButton");
  cancelEditButton.onclick = hideModalEdit;

  const bookDesignForm = document.getElementById("editDesignForm");
  const inputEditForm = document.querySelectorAll("#editBook input");

  inputEditForm.forEach((input) => {
    input.addEventListener("input", function () {
      updateBookDesign(input, bookDesignForm);
    });
  });

  titleInput.value = bookTarget.title;
  authorInput.value = bookTarget.author;
  yearInput.value = bookTarget.year;
  bgColorInput.value = bookTarget.bgColor;
  isCompleteInput.checked = bookTarget.isComplete;

  showModalEdit();

  const editForm = document.getElementById("editBook");

  editForm.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();

      bookTarget.title = titleInput.value;
      bookTarget.author = authorInput.value;
      bookTarget.year = yearInput.value;
      bookTarget.bgColor = bgColorInput.value;
      bookTarget.isComplete = isCompleteInput.checked;

      clearField(inputEditForm);
      hideModalEdit();
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveBookData();
    },
    { once: true }
  );
}

function showSuccessMessage(bookTitle) {
  Swal.fire({
    icon: "success",
    title: `Buku ${bookTitle} sudah ditambahkan`,
    showConfirmButton: true,
    timer: 1500,
  });
}

function clearField(inputField) {
  inputField.forEach((input) => {
    input.value = "";
  });
}

function showModalAdd() {
  document.getElementById("modalAddBook").classList.add("active");
}

function hideModalAdd() {
  document.getElementById("modalAddBook").classList.remove("active");
}

function showModalEdit() {
  document.getElementById("modalEditBook").classList.add("active");
}

function hideModalEdit() {
  document.getElementById("modalEditBook").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
  addBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function renderBookshelf(bookArray) {
  const incompleteShelf = document.getElementById("incompleteBookshelfList");
  const completeShelf = document.getElementById("completeBookshelfList");

  incompleteShelf.innerHTML = "";
  completeShelf.innerHTML = "";

  for (const book of bookArray) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeShelf.append(bookElement);
    } else {
      incompleteShelf.append(bookElement);
    }
  }
}

document.addEventListener(RENDER_EVENT, function () {
  renderBookshelf(bookList);
});

document.addEventListener(RENDER_FILTERED, function () {
  renderBookshelf(filteredBooks);
});

function isStorageExist() {
  if (typeof Storage === "undefined") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Browser tidak mendukung local storage!",
      footer: "Update / Gunakan Firefox atau Google Chrome",
    });
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  let dataBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (dataBooks !== null) {
    for (const book of dataBooks) {
      bookList.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveBookData() {
  if (isStorageExist())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const keyword = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  filteredBooks = bookList.filter((book) =>
    book.title.toLowerCase().includes(keyword)
  );

  document.dispatchEvent(new Event(RENDER_FILTERED));
});
