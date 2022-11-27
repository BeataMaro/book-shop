const body = document.body;
const deliveryForm = document.forms["delivery-form"]; //document.forms[0] or document.forms.deliveryForm
const inputs = document.querySelectorAll(
  "input:not([type=checkbox], [type=radio])"
);
const submitButton = document.getElementById("button-send-form");
//form data
const firstname = deliveryForm["firstname"].value;
const surname = deliveryForm["surname"];
const dateInput = deliveryForm["delivery-date"];
const submittedData = {};

deliveryForm.onsubmit = (e) => {
  e.preventDefault();
  submittedData["Name"] = deliveryForm.firstname.value;
  submittedData["Surname"] = deliveryForm.surname.value;
  submittedData["Street"] = deliveryForm.street.value;
  submittedData["House Number"] = deliveryForm.houseNumber.value;
  submittedData["Flat Number"] = deliveryForm.flatNumber.value;
  submittedData["Delivery Date"] = deliveryForm["delivery-date"].value;
  submittedData["Payment Method"] = deliveryForm["payment-method"].value;

  showSummary();
};

const validateForm = () => {
  console.log("validate");
};

inputs.forEach((input) => input.addEventListener("blur", validateForm));

const getSubmittedData = async () => {
  const container = document.createElement("div");
  for (const data in submittedData) {
    const summaryText = document.createElement("p");
    summaryText.innerHTML = await `${data}: ${submittedData[data]}<br>`;
    container.appendChild(summaryText);
  }
  return container;
};

const lessThan = (val, num) => val.length < num;

const stringOnly = (val) => /\D/g.test(val);

const noSpaces = (val) => /\S/g.test(val);

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
