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

// ****
function handleDrop(ev) {
  addToBag(ev.dataTransfer.getData("text"));
}

function handleDragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.effectAllowed = "copy";
  const image = ev.target.querySelector("img").cloneNode();
  image.style.width = "100px";
  image.style.height = "150px";
  image.style.transform = "translateX(-2000px)";
  image.id = "temp";
  document.body.appendChild(image);
  ev.dataTransfer.setDragImage(image, -10, -10);
}
function handleDragEnd() {
  document.body.removeChild(document.getElementById("temp"));
}
function handleAdd() {
  addToBag(this.parentNode.parentNode.parentNode.id);
}
// *******
const dragstart_handler = (ev) => {
  console.log("nap");
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
  const image = ev.target.querySelector("img").cloneNode();
  image.style.width = "100px";
  image.style.height = "150px";
  image.style.transform = "translateX(-2000px)";
  image.id = "temp";
  document.body.appendChild(image);
  ev.dataTransfer.setDragImage(image, -10, -10);
};

function dragover_handler(ev) {
  ev.preventDefault();
  console.log("Drag over");
}
function drop_handler(ev) {
  const draggedBook = ev.dataTransfer.getData("text");
  console.log(draggedBook);
  // addToBag(ev.dataTransfer.getData("text"));
  // Get the id of the target and add the moved element to the target's DOM
}

const createEmptyBag = () => {
  bagSection.classList.add("bag");
  bagSection.setAttribute("id", "bag");
  bagSection.addEventListener("drop", (event) => drop_handler(event));
  bagSection.addEventListener("dragover", (event) => dragover_handler(event));
  const bagTitle = document.createElement("h3");
  bagTitle.textContent = "Bag";
  bagSection.appendChild(bagTitle);
  const emptyBag = document.createElement("span");
  emptyBag.textContent = "Your bag is empty";
  bagSection.appendChild(emptyBag);
  main.appendChild(bagSection);
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
    bagSection.append(bagTitle);

    //Total
    const getTotal = () => {
      const getTotalPrice = bag.reduce((acc, obj) => {
        return acc + obj.price;
      }, 0);
      return getTotalPrice;
    };

    const total = document.createElement("p");
    const totalPrice = bag.length === 1 ? `${bag[0].price}` : getTotal();

    total.textContent = `Total: $${totalPrice}`;
    bagSection.appendChild(total);

    //Pieces

    const amount = 1;
    const pieces = document.createElement("span");
    pieces.textContent = `Pieces: ${amount}`;

    //Confirm button
    const linkToDeliveryForm = document.createElement("a");
    linkToDeliveryForm.setAttribute("href", "../order-page");
    const confirmOrderBtn = document.createElement("button");
    confirmOrderBtn.setAttribute("type", "button");
    confirmOrderBtn.innerText = "Confirm order";
    linkToDeliveryForm.appendChild(confirmOrderBtn);

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

      bagSection.appendChild(bookImg);
      bagSection.appendChild(bookTitle);
      bagSection.appendChild(bookAuthor);
      bagSection.appendChild(bookPrice);
      bagSection.appendChild(pieces);
      bagSection.appendChild(removeBookFromBagBtn);
      bagSection.appendChild(linkToDeliveryForm);
      main.prepend(bagSection);
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
        bookTile.addEventListener("dragstart", (event) =>
          dragstart_handler(event)
        );

        const bookTileHeader = document.createElement("header");

        //Book cover image
        const bookCover = document.createElement("img");
        bookCover.setAttribute("src", b.imageLink);
        bookCover.setAttribute("alt", `${b.title}-book cover`);
        bookCover.draggable = false;
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
        bookTile.appendChild(bookCover);
        bookTile.appendChild(price);
        bookTile.appendChild(showMore);
        bookTile.appendChild(addToBagBtn);
        bookTile.appendChild(descriptionModal);
        bookTile.classList.add("book-tile");
        catalogSection.appendChild(bookTile);
        main.append(catalogSection);
      })
    );
};

getHeader();
if (pagePathname.includes("catalog")) getBooks();

fragment.appendChild(header);
fragment.appendChild(main);
body.appendChild(fragment);
