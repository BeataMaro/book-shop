// import { getHeader } from "../catalog/main.js";

// getHeader();


const deliveryForm = document.forms["delivery-form"]; //document.forms[0] or document.forms.deliveryForm
const dateInput = deliveryForm["delivery-date"];

console.log(dateInput.form);

deliveryForm.onsubmit = (e) => {
  e.preventDefault();

  console.log(deliveryForm.surname.value); //deliveryForm.elements.surname.value
  
};

const ValidateGiftSelection = () => {
  const checkboxes = document.getElementsByName("gift");
  let numberOfCheckedItems = 0;

  [...checkboxes].map((check) => {
    check.addEventListener("click", () => {
      if (check.checked) numberOfCheckedItems++;
      if (numberOfCheckedItems > 2) alert("Choose only 2 gifts");
    })
  });
};
ValidateGiftSelection();

