const body = document.body;

const getBooks = async () => {
 let books = await fetch("../../books.json")
  .then((res) => res.json())
  .then((data) => data.map(b => {
    const bookTile = document.createElement('article');
    const bookTileHeader = document.createElement('header');
    const author = document.createElement('h3');
    author.textContent = b.author;
    bookTileHeader.appendChild(author); 
    bookTile.appendChild(bookTileHeader);
    bookTile.classList.add("book-tile")
    body.appendChild(bookTile)
  }));
}

getBooks();
