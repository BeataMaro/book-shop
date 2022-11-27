const fragment = new DocumentFragment();
const body = document.body;
const header = document.createElement("header");
const main = document.createElement("main");
const catalogSection = document.createElement("section");
catalogSection.classList.add("catalog");
const bagSection = document.createElement("section");
const bagIconContainer = document.createElement("aside");
bagIconContainer.className = "bag-icon-container";
const total = document.createElement("p");
total.className = "total";
let allBooks = [];

const pagePathname = window.location.pathname;

body.appendChild(header);
body.appendChild(main);
main.appendChild(catalogSection);
main.appendChild(bagSection);

const toggleBag = () => {
  bagSection.classList.toggle("expand");
  if (bag.length < 2) bagSection.style.overflowY = "hidden";
};

bagIconContainer.addEventListener("click", toggleBag);

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

const dragover_handler = (ev) => {
  ev.preventDefault();
  console.log("Drag over");
};
const drop_handler = (ev) => {
  const draggedBookId = ev.dataTransfer.getData("text");
  console.log(draggedBookId);

  allBooks = allBooks.map((b, idx) => ({
    ...b,
    id: `${b.title.split("").slice(0, 4).join("")}-${idx}`,
  }));
  console.log(allBooks);
  const chosenBook = allBooks.find((book) => book.id === draggedBookId);
  console.log(chosenBook);
  bag = [...bag, chosenBook];
  console.log(bag);
  reloadBag();
  total.textContent = `Total: $${getTotal()}`;
};
//BAG
let bag = [];

const createBagIcon = () => {
  const icon = document.createElement("i");
  icon.className = "material-symbols-outlined";
  icon.textContent = "shopping_bag";
  bagIconContainer.appendChild(icon);
  bagIconContainer.addEventListener("dragover", (event) =>
    dragover_handler(event)
  );
  bagIconContainer.addEventListener("drop", (event) => drop_handler(event));
  main.appendChild(bagIconContainer);
};

createBagIcon();

//Total
const getTotal = () => {
  const getTotalPrice = bag.reduce((acc, obj) => {
    return acc + obj.price * obj.amount;
  }, 0);
  return getTotalPrice;
};

const createEmptyBag = () => {
  bagSection.classList.add("bag", "empty-bag");
  bagSection.setAttribute("id", "bag");
  bagSection.addEventListener("drop", (event) => drop_handler(event));
  bagSection.addEventListener("dragover", (event) => dragover_handler(event));
  const bagTitle = document.createElement("h3");
  bagTitle.textContent = "Bag";
  bagSection.appendChild(bagTitle);
  const emptyBag = document.createElement("span");
  emptyBag.textContent = "Your bag is empty.";
  const summary = document.createElement("div");
  summary.className = "summary";
  total.textContent = `Total: $${getTotal()}`;
  summary.appendChild(total);
  bagSection.appendChild(emptyBag);
  bagSection.appendChild(summary);
  main.appendChild(bagSection);
};
createEmptyBag();

const removeBookFromBag = (bookId) => {
  bag = bag.filter((b) => b.id !== bookId);
  reloadBag();
};

//Confirm button
const linkToDeliveryForm = document.createElement("a");
linkToDeliveryForm.setAttribute("href", "../order-page");
const confirmOrderBtn = document.createElement("button");
confirmOrderBtn.setAttribute("type", "button");
confirmOrderBtn.className = "confirm-order-btn";
confirmOrderBtn.innerText = "Confirm order";
linkToDeliveryForm.appendChild(confirmOrderBtn);
const summary = document.createElement("div");
summary.className = "summary";
summary.appendChild(total);
summary.appendChild(linkToDeliveryForm);

const reloadBag = () => {
  if (bag.length === 0) {
    bagSection.innerHTML = "";
    confirmOrderBtn.disabled = true;
    createEmptyBag();
  }
  if (bag.length > 0) {
    bagSection.innerHTML = "";
    bagSection.classList.remove("empty-bag");
    confirmOrderBtn.disabled = false;
    const bagTitle = document.createElement("h3");
    bagTitle.textContent = "Order books";
    bagSection.append(bagTitle);
  }
  if (bag.length === 1) {
    const totalPrice = bag[0].price * bag[0].amount;
    total.textContent = `Total: $${totalPrice}`;
  }

  if (bag.length > 1) {
    total.textContent = `Total: $${getTotal()}`;
  }

  //books wrapper

  const booksWrapper = document.createElement("div");
  booksWrapper.className = "books-wrapper";

  bag.map((book) => {
    //Single book wrapper
    const bookWrapper = document.createElement("div");
    bookWrapper.className = "book-wrapper";

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

    //Amount

    const bookAmountContainer = document.createElement("div");
    bookAmountContainer.className = "book-amount-container";
    const bookAmount = document.createElement("span");
    bookAmount.textContent = `Pieces: ${book.amount}`;

    const changeAmount = (id, action) => {
      const book = bag.find((book) => book.id === id);
      switch (action) {
        case "plus":
          total.textContent = `Total: $${getTotal()}`;
          return (bookAmount.textContent = `Pieces: ${book.amount++}`);

        case "minus":
          total.textContent = `Total: $${getTotal()}`;
          if (book.amount > 0)
            return (bookAmount.textContent = `Pieces: ${book.amount--}`);
      }
    };

    const plusBtn = document.createElement("button");
    plusBtn.innerText = "+";
    plusBtn.addEventListener("click", () => changeAmount(book.id, "plus"));
    const minusBtn = document.createElement("button");
    minusBtn.innerText = "-";
    minusBtn.addEventListener("click", () => changeAmount(book.id, "minus"));
    bookAmountContainer.appendChild(minusBtn);
    bookAmountContainer.appendChild(bookAmount);
    bookAmountContainer.appendChild(plusBtn);

    //Remove book from bag button
    const removeBookFromBagBtn = document.createElement("i");
    removeBookFromBagBtn.innerText = "delete";
    removeBookFromBagBtn.classList.add(
      "material-symbols-outlined",
      "remove-from-bag-btn"
    );
    removeBookFromBagBtn.addEventListener("click", () =>
      removeBookFromBag(book.id)
    );

    bookWrapper.appendChild(bookImg);
    bookWrapper.appendChild(bookTitle);
    bookWrapper.appendChild(bookAuthor);
    bookWrapper.appendChild(bookPrice);
    bookWrapper.appendChild(bookAmountContainer);
    bookWrapper.appendChild(removeBookFromBagBtn);
    booksWrapper.appendChild(bookWrapper);
  });
  bagSection.appendChild(booksWrapper);
  bagSection.appendChild(summary);
  main.append(bagSection);
};

export const getHeader = () => {
  const h1 = document.createElement("h1");
  h1.textContent = "Welcome to amazing Book Shop!";
  const heroBanner = document.createElement("div");
  heroBanner.classList.add("hero-banner");

  header.appendChild(heroBanner);
  header.appendChild(h1);
};

//FETCH BOOKS

const catalogTitle = document.createElement("h2");
const subtitle = pagePathname.includes("catalog")
  ? "Book Catalog"
  : pagePathname.includes("order")
  ? "Order"
  : "";
catalogTitle.textContent = subtitle;
catalogTitle.className = "catalog-title";

catalogSection.appendChild(catalogTitle);

const getBooks = async () => {
  const openModal = (bookTile) => {
    bookTile.classList.toggle("modal-open");
    body.classList.toggle("modal-open");
  };

  const closeModal = (bookTile) => {
    body.classList.remove("modal-open");
    bookTile.classList.remove("modal-open");
  };

  const fadeBag = () => {
    const showBag = setTimeout(() => {
      bagSection.classList.add("expand");
    }, 500);
    clearTimeout(showBag);
  };
  let amount = 1;

  const addBookToBag = (book, id) => {
    const alreadyExist = bag.some((book) => book.id === id);
    if (alreadyExist) {
      const multi = bag.find((book) => book.id === id);
      multi.amount++;
      total.textContent = `Total: $${getTotal()}`;
    } else {
      const bookWithId = { ...book, id, amount };
      bag = [...bag, bookWithId];
      total.textContent = `Total: $${getTotal()}`;
    }
    reloadBag();
  };

  let booksJson = await fetch("../../books.json")
    .then((res) => res.json())
    .then((data) =>
      data.map((b, idx) => {
        allBooks.push(b);
        console.log(allBooks);
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
        addToBagBtn.addEventListener("click", fadeBag);

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
