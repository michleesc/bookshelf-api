const { nanoid } = require('nanoid');
const books = require('./books');

const addBooks = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
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
    }

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
        }

    books.push(newBooks);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }); 
    response.code(201);
    return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooks = (request, h) => {
    const { name, reading, finished } = request.query;
    if (name !== undefined) {
        const bookName = books.filter((book) => book.name.toLowerCase().search(name.toLowerCase()) >= 0);
        return {
            status: 'success',
            data: {
                books: bookName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }
    if(reading !== undefined) {
        if (reading == 0) {
            const bookReading = books.filter((book) => book.reading === false);
            return {
                status: 'success',
                data: {
                    books: bookReading.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
    } else if (reading == 1) {
        const bookReading = books.filter((book) => book.reading === true);
        return {
            status: 'success',
            data: {
                books: bookReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Nilai reading harus mempunyai nilai 0 atau 1',
        });
        response.code(400);
        return response;
    }
}
    if (finished !== undefined){
        if (finished == 0) {
            const bookfinished = books.filter((book) => book.finished === false);
            return {
                status: 'success',
                data: {
                    books: bookfinished.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
        } else if (finished == 1){
            const bookfinished = books.filter((book) => book.finished === true);
            return {
                status: 'success',
                data: {
                    books: bookfinished.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Nilai finished harus mempunyai nilai 0 atau 1',
            });
            response.code(400);
            return response;
        }
    }
    return {
        status: 'success',
        data: {
            books: books.map((book)=> ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((book) => book.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getDetailBooks = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((n) => n.id === bookId)[0];

    if (book === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    };
    const response = h.response({
        status: 'success',
        message: 'Buku telah ditemukan',
        data: {
            book
        },
    });
    response.code(200);
    return response;
};

const editIdBooks = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    if (index !== -1) {
        books[index] = {
            ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

const deleteIdBooks = (request,h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = { addBooks, getAllBooks, getDetailBooks, editIdBooks, deleteIdBooks };