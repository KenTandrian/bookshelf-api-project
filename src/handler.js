/*
March 09, 2022
All mandatory and optional test case passed.
*/

const { nanoid } = require('nanoid');
const books = require('./books');

const addNewBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    // VALIDATION CHECK
    if (!name) {
        const resp = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        return resp.code(400);
    }
    if (readPage > pageCount) {
        const resp = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        return resp.code(400);
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    books.push(newBook);
    // console.log(newBook);

    const isInserted = books.filter((book) => book.id === id).length > 0;
    if (isInserted) {
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        return resp.code(201);
    }
    const resp = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    return resp.code(500);
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (!name && !reading && !finished) {
        const allBooks = books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
        return h.response({
            status: 'success',
            data: {
                books: allBooks,
            },
        }).code(200);
    }

    const filteredBooks = books
    .filter(
        (book) => {
            if (name) {
                return book.name.toLowerCase().includes(name.toLowerCase());
            }
            return book;
        },
    ).filter(
        (book) => {
            if (reading && (reading === '0' || reading === '1')) {
                return reading === '0' ? book.reading === false : book.reading === true;
            }
            return book;
        },
    ).filter(
        (book) => {
            if (finished && (finished === '0' || finished === '1')) {
                return finished === '0' ? book.finished === false : book.finished === true;
            }
            return book;
        },
    );
    const mappedBooks = filteredBooks.map(
        (book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }),
    );
    return h.response({
        status: 'success',
        data: {
            books: mappedBooks,
        },
    }).code(200);
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const foundBook = books.find((book) => book.id === bookId);
    if (foundBook) {
        const resp = h.response({
            status: 'success',
            data: {
                book: foundBook,
            },
        });
        return resp.code(200);
    }
    const resp = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    return resp.code(404);
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    // VALIDATION CHECKS
    if (!name) {
        const resp = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        return resp.code(400);
    }
    if (readPage > pageCount) {
        const resp = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        return resp.code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage;
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            finished,
        };
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        return resp.code(200);
    }
    const resp = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    return resp.code(404);
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const idx = books.findIndex((book) => book.id === bookId);
    if (idx !== -1) {
        books.splice(idx, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = {
    addNewBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
