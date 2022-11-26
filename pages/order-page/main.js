// import { getHeader } from "../catalog/main.js";

// getHeader();

const deliveryForm = document.forms["delivery-form"]; //document.forms[0] or document.forms.deliveryForm

const submitButton = document.getElementById("button-send-form");
//form data
const firstname = deliveryForm["firstname"].value;
const surname = deliveryForm["surname"];
const dateInput = deliveryForm["delivery-date"];
const submittedData = {};

// console.log(dateInput.form);

deliveryForm.onsubmit = (e) => {
  e.preventDefault();
  submittedData.name = deliveryForm.firstname.value;
  submittedData.surname = deliveryForm.surname.value;
  submittedData.street = deliveryForm.street.value;
  submittedData.houseNumber = deliveryForm.houseNumber.value;
  submittedData.flatNumber = deliveryForm.flatNumber.value;
  submittedData.deliveryDate = deliveryForm["delivery-date"].value;
  submittedData.paymentMethod = deliveryForm["payment-method"].value;
  submittedData.gifts = [...deliveryForm.gift.value];

  console.log(submittedData); //deliveryForm.elements.surname.value
};

const validateForm = () => {};

const showSummary = () => {};

const ValidateGiftSelection = () => {
  const checkboxes = document.getElementsByName("gift");
  let numberOfCheckedItems = 0;

  [...checkboxes].map((check) => {
    check.addEventListener("click", () => {
      if (check.checked) numberOfCheckedItems++;
      if (numberOfCheckedItems > 2) alert("Choose only 2 gifts");
    });
  });
};
ValidateGiftSelection();

submitButton.addEventListener("click", validateForm());
