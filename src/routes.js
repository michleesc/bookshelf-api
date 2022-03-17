const {addBooks,getAllBooks,getDetailBooks,editIdBooks,deleteIdBooks} = require ('./handles');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBooks,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailBooks,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editIdBooks,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteIdBooks,
    }
]

module.exports = routes;