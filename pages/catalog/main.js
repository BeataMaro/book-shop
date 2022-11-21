const fragment = new DocumentFragment();


const body = document.body;
const header = document.createElement("header");
const main = document.createElement("main");
const catalogSection = document.createElement("section");
catalogSection.classList.add("catalog");
const bagSection = document.createElement("section");

const pagePathname = window.location.pathname;

body.appendChild(header);
body.appendChild(main);
main.appendChild(catalogSection);
main.appendChild(bagSection);

const dragstart_handler = (ev) => {
  ev.dataTransfer.dropEffect = "move";
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
};

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text/plain");
  console.log(`data: ${data}`);
  ev.target.appendChild(fragment.getElementById(data));
}

const createEmptyBag = () => {
  bagSection.classList.add("bag");
  bagSection.setAttribute("id", "bag");
  bagSection.setAttribute("ondrop", (event) => drop_handler(event));
  bagSection.setAttribute("ondragover", (event) => dragover_handler(event));
  const bagTitle = document.createElement("h3");
  bagTitle.textContent = "Bag";
  bagSection.appendChild(bagTitle);
  const emptyBag = document.createElement("span");
  emptyBag.textContent = "Your bag is empty";
  bagSection.appendChild(emptyBag);
};
createEmptyBag();

//BAG
let bag = [];

const removeBookFromBag = (bookId) => {
  bag = bag.filter((b) => b.id !== bookId);
  reloadBag();
};

const reloadBag = () => {
  if (bag.length === 0) {
    bagSection.innerHTML = "";
    createEmptyBag();
  }
  if (bag.length > 0) {
    bagSection.innerHTML = "";
    const bagTitle = document.createElement("h3");
    bagTitle.textContent = "Order books";
    bagSection.appendChild(bagTitle);
    bag.map((book) => {
      //Book cover image
      const bookImg = document.createElement("img");
      bookImg.setAttribute("src", book.imageLink);
      bookImg.setAttribute("alt", `${book.title}-book image`);
      bookImg.classList.add("book-img");

      //Author
      const bookAuthor = document.createElement("h4");
      bookAuthor.textContent = book.author;

      //Title
      const bookTitle = document.createElement("h3");
      bookTitle.textContent = book.title.toUpperCase();

      //Price
      const bookPrice = document.createElement("h5");
      bookPrice.textContent = `Price: $${book.price}`;

      //Remove book from bag button
      const removeBookFromBagBtn = document.createElement("button");
      removeBookFromBagBtn.setAttribute("type", "button");
      removeBookFromBagBtn.innerText = "X";
      removeBookFromBagBtn.classList.add("remove-from-bag-btn");
      removeBookFromBagBtn.addEventListener("click", () =>
        removeBookFromBag(book.id)
      );

      //Confirm button
      const linkToDeliveryForm = document.createElement('a');
      linkToDeliveryForm.setAttribute("href", "../order-page");
      const confirmOrderBtn = document.createElement("button");
      confirmOrderBtn.setAttribute("type", "button");
      confirmOrderBtn.innerText = "Confirm order";
      linkToDeliveryForm.appendChild(confirmOrderBtn);

      bagSection.appendChild(bookImg);
      bagSection.appendChild(bookTitle);
      bagSection.appendChild(bookAuthor);
      bagSection.appendChild(bookPrice);
      bagSection.appendChild(removeBookFromBagBtn);
      bagSection.appendChild(linkToDeliveryForm);
    });
  }
};

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

  const addBookToBag = (book, id) => {
    const bookWithId = { ...book, id };
    bag = [...bag, bookWithId];
    reloadBag();
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
        bookTile.setAttribute("draggable", true);
        bookTile.setAttribute("ondragstart", (event) =>
          dragstart_handler(event)
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
        addToBagBtn.addEventListener("click", () =>
          addBookToBag(b, bookTile.id)
        );

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
        catalogSection.appendChild(bookTile);
      })
    );
};

getHeader();

if (pagePathname.includes("catalog")) getBooks();
