const body = document.body;
const deliveryForm = document.forms["delivery-form"]; //document.forms[0] or document.forms.deliveryForm
const inputs = document.querySelectorAll(
  "input:not([type=checkbox], [type=radio])"
);
const submitButton = document.getElementById("button-send-form");
//form data
const firstname = deliveryForm["firstname"];
const surname = deliveryForm["surname"];
const dateInput = deliveryForm["delivery-date"];
const street = deliveryForm.street;
const houseNumber = deliveryForm.houseNumber;
const flatNumber = deliveryForm.flatNumber;
const paymentMethod = deliveryForm["payment-method"];
const submittedData = {};

//Validation rules

const longEnough = (val, num) => val >= num;

const stringOnly = (val) => /^[A-Za-z]+$/g.test(val);

const noSpaces = (val) => /\S/g.test(val);

deliveryForm.onsubmit = (e) => {
  e.preventDefault();
  submittedData["Name"] = firstname.value;
  submittedData["Surname"] = surname.value;
  submittedData["Street"] = street.value;
  submittedData["House Number"] = houseNumber.value;
  submittedData["Flat Number"] = flatNumber.value;
  submittedData["Delivery Date"] = dateInput.value;
  submittedData["Payment Method"] = paymentMethod.value;

  showSummary();
};

const validateForm = () => {
  if (longEnough(firstname.value.length, 4) && stringOnly(firstname.value)) {
    firstname.classList.remove("incorrect");
    firstname.classList.add("correct");
    submitButton.disabled = false;
  } else {
    // if (!longEnough(firstname.value.length, 4) || !stringOnly(firstname.value)) {
    firstname.classList.remove("correct");
    firstname.classList.add("incorrect");
    submitButton.disabled = true;
  }
  if (
    longEnough(surname.value.length, 5) &&
    stringOnly(surname.value) &&
    noSpaces(surname.value)
  ) {
    surname.classList.remove("incorrect");
    surname.classList.add("correct");
    submitButton.disabled = false;
  } else {
    surname.classList.remove("correct");
    surname.classList.add("incorrect");
    submitButton.disabled = true;
  }
  if (/^[\d]+-?[\d]+$/g.test(flatNumber.value)) {
    flatNumber.classList.remove("incorrect");
    flatNumber.classList.add("correct");
    submitButton.disabled = false;
  } else {
    flatNumber.classList.remove("correct");
    flatNumber.classList.add("incorrect");
    submitButton.disabled = true;
  }
};

inputs.forEach((field) => field.addEventListener("blur", validateForm));

const getSubmittedData = async () => {
  const container = document.createElement("div");
  for (const data in submittedData) {
    const summaryText = document.createElement("p");
    summaryText.innerHTML = await `${data}: ${submittedData[data]}<br>`;
    container.appendChild(summaryText);
  }
  return container;
};

const closeSummary = () => {
  let container = document.querySelector(".summary-container");
  container.style.display = "none";
};

const showSummary = async () => {
  deliveryForm.reset();

  const summaryInfo = document.createElement("div");
  summaryInfo.className = "summary-container";
  summaryInfo.style.display = "block";

  const h4 = document.createElement("h4");
  h4.textContent = "Summary";

  //Close summary
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "x";
  closeBtn.className = "close-btn";
  closeBtn.addEventListener("click", closeSummary);

  const data = await getSubmittedData();

  summaryInfo.appendChild(closeBtn);
  summaryInfo.prepend(h4);
  summaryInfo.appendChild(data);
  body.prepend(summaryInfo);
};

const ValidateGiftSelection = () => {
  const checkboxes = document.getElementsByName("gift");
  let numberOfCheckedItems = 0;

  [...checkboxes].map((check) => {
    check.addEventListener("click", () => {
      if (check.checked) numberOfCheckedItems++;
      if (numberOfCheckedItems > 2) check.checked = false;
    });
  });
};
ValidateGiftSelection();

// submitButton.addEventListener("click", validateForm())
