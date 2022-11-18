const body = document.body;
const header = document.createElement("header");
const main = document.createElement("main");
const section = document.createElement("section");

const pagePathname = window.location.pathname;

body.appendChild(header);
body.appendChild(main);
main.appendChild(section);

let bag = [];

export const getHeader = () => {
  const h1 = document.createElement("h1");
  h1.textContent = "Welcome to amazing Book Shop!";
  const h2 = document.createElement("h2");
  const subtitle = pagePathname.includes("catalog")
    ? "Book Catalog"
    : pagePathname.includes("order")
    ? "Order"
    : "";
  h2.textContent = subtitle;
  const heroBanner = document.createElement("div");
  heroBanner.classList.add("hero-banner");

  header.appendChild(heroBanner);
  header.appendChild(h1);
  header.appendChild(h2);
};

//FETCH BOOKS
const getBooks = async () => {
  const openModal = (bookTile) => {
    bookTile.classList.toggle("modal-open");
    body.classList.toggle("modal-open");
  };

  const closeModal = (bookTile) => {
    body.classList.remove("modal-open");
    bookTile.classList.remove("modal-open");
  };

  const addToBag = (book) => {
    bag = [...bag, book];
    console.log(bag)
  };

  let books = await fetch("../../books.json")
    .then((res) => res.json())
    .then((data) =>
      data.map((b, idx) => {
        const bookTile = document.createElement("article");
        bookTile.setAttribute(
          "id",
          `${b.title.split("").slice(0, 4).join("")}-${idx}`
        );
        const bookTileHeader = document.createElement("header");

        //Book cover image
        const bookCover = document.createElement("img");
        bookCover.setAttribute("src", b.imageLink);
        bookCover.setAttribute("alt", `${b.title}-book cover`);
        bookCover.classList.add("book-cover");

        //Author
        const author = document.createElement("h4");
        author.textContent = b.author;

        //Title
        const title = document.createElement("h3");
        title.textContent = b.title.toUpperCase();

        //Price
        const price = document.createElement("h5");
        price.textContent = `Price: $${b.price}`;

        //Add to bag button
        const addToBagBtn = document.createElement("button");
        addToBagBtn.setAttribute("type", "button");
        addToBagBtn.innerText = "Add to bag";
        addToBagBtn.classList.add("add-to-bag-btn");
        addToBagBtn.addEventListener("click", () => addToBag(b));

        //Show more button
        const showMore = document.createElement("button");
        showMore.setAttribute("type", "button");
        showMore.classList.add("show-more-btn");
        showMore.innerText = "Show more";
        showMore.addEventListener("click", () => openModal(bookTile));

        const descriptionModal = document.createElement("div");
        descriptionModal.classList.add("description-modal");
        const description = document.createElement("p");
        description.textContent = b.description;
        const closeModalBtn = document.createElement("button");
        closeModalBtn.innerText = "X";
        closeModalBtn.classList.add("close-modal-btn");
        closeModalBtn.addEventListener("click", () => closeModal(bookTile));

        descriptionModal.append(closeModalBtn);
        descriptionModal.append(description);

        bookTileHeader.appendChild(author);
        bookTileHeader.appendChild(title);
        bookTileHeader.classList.add("book-tile-header");
        bookTile.appendChild(bookTileHeader);
        bookTile.append(bookCover);
        bookTile.append(price);
        bookTile.append(showMore);
        bookTile.append(addToBagBtn);
        bookTile.append(descriptionModal);
        bookTile.classList.add("book-tile");
        section.appendChild(bookTile);
      })
    );
};

getHeader();

if (pagePathname.includes("catalog")) getBooks();
