// main.js

const books = [];
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBooks();
  });

  loadDataFromStorage();
});

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  // Cek apakah sedang dalam mode edit
  const editingBookId = document.getElementById('bookForm').getAttribute('data-editing');
  
  if (editingBookId) {
    // Mode edit - update buku yang ada
    const bookIndex = books.findIndex(b => b.id.toString() === editingBookId);
    if (bookIndex !== -1) {
      books[bookIndex] = {
        id: parseInt(editingBookId),
        title,
        author,
        year,
        isComplete
      };
      
      // Reset form edit
      document.getElementById('bookForm').removeAttribute('data-editing');
      document.getElementById('bookFormSubmit').innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
    }
  } else {
    // Mode tambah - buat buku baru
    const id = +new Date();
    const book = {
      id,
      title,
      author,
      year,
      isComplete
    };
    books.push(book);
  }

  saveData();
  renderBooks();
  document.getElementById('bookForm').reset();
}

function renderBooks(booksToRender = books) {
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  for (const book of booksToRender) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  }
}

function createBookElement(book) {
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', book.id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', function () {
    toggleBookStatus(book.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', function () {
    editBook(book.id);
  });

  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookContainer.append(title, author, year, buttonContainer);

  return bookContainer;
}

function toggleBookStatus(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(bookId) {
  if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveData();
      renderBooks();
    }
  }
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    // Isi form dengan data buku yang akan diedit
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;
    
    // Set mode edit
    document.getElementById('bookForm').setAttribute('data-editing', book.id);
    document.getElementById('bookFormSubmit').innerHTML = 'Update Buku';
    
    // Scroll ke form
    document.getElementById('bookForm').scrollIntoView({ behavior: 'smooth' });
  }
}

function searchBooks() {
  const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
  
  if (searchTerm.trim() === '') {
    renderBooks();
    return;
  }
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) || 
    book.author.toLowerCase().includes(searchTerm)
  );
  
  renderBooks(filteredBooks);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadDataFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    books.push(...data);
    renderBooks();
  }
}

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Cek preferensi sebelumnya
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark');

    // Simpan preferensi
    if (body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
});