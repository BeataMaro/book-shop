import { getHeader } from "../catalog/main";

getHeader();

const deliveryForm = document.forms['delivery-form']; //document.forms[0] or document.forms.deliveryForm
const dateInput = deliveryForm['delivery-date'];

console.log(dateInput.form)

deliveryForm.onsubmit = (e) => {
  e.preventDefault();

  console.log(deliveryForm.surname.value);//deliveryForm.elements.lastname.value
  console.log()
};
