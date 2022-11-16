const body = document.body;

const getBooks = async () => {
  let books = await fetch("../../books.json")
    .then((res) => res.json())
    .then((data) =>
      data.map((b) => {
        const bookTile = document.createElement("article");
        const bookTileHeader = document.createElement("header");
        const bookCover = document.createElement("img");
        bookCover.setAttribute("src", b.imageLink);
        bookCover.setAttribute("alt", `${b.title}-book cover`);
        bookCover.classList.add("book-cover");
        const author = document.createElement("h3");
        author.textContent = b.author;
        bookTileHeader.appendChild(author);
        bookTile.appendChild(bookTileHeader);
        bookTile.append(bookCover);
        bookTile.classList.add("book-tile");
        body.appendChild(bookTile);
      })
    );
};

getBooks();
