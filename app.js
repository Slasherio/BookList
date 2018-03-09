/**
 * Class for creating book object
 */
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
/**
 * Class UI for manipulating DOM content
 * Include methods for:
 * 1. Adding book to list
 * 2. Clear inputs after adding
 * 3. Show alert if you forgot input some data 
 * or when book successfull added
 * 4. Delete book form list
 */
class UI {
    addToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='delete'>X</a></td>
        `;
        list.appendChild(row);
    }
    clearInputs() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
    showAlert(msg, className) {
        const container = document.querySelector('.container');
        const errorDiv = document.createElement('div');
        errorDiv.className = `alert ${className}`;
        errorDiv.appendChild(document.createTextNode(`${msg}`));
        container.insertBefore(errorDiv, container.children[1]);
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 2000);
    }
    deleteBook(target) {
        const ui = new UI();
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
}

/**
 * Class Store for interaction with Local Storage
 * Include methods for:
 * 1. Getting books array from LS
 * 2. Add book to LS @param {*book name} book
 * 3. Delete book from LS @param {*isbn number for comparison(if you want delete book from LS and document) } isbn
 * 4. Display/Remember books when you refresh page
 */
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(element => {
            const ui = new UI;
            ui.addToList(element);
        });
    };

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((element, index) => {
            if (element.isbn === isbn) {
                books.splice(index, 1);
            };
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', Store.displayBooks());

/**
 * Read data from inputs and called appropriate methods
 */
document.getElementById('book-form').addEventListener('submit', function(e) {
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn); // create book object
    const ui = new UI();
    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill in all inputs', 'error');
    } else {
        ui.showAlert('Book successfull added', 'success');
        ui.addToList(book);
        Store.addBook(book);
        ui.clearInputs();
    }
    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(e) {
    const ui = new UI();
    ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.parentElement.children[2].textContent); //get isbn number
    e.preventDefault();
});