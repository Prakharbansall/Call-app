// ALL VARIABLES AND DOC SELECTIONS
let addNote = document.querySelector("#add-note");
let formContainer = document.querySelector(".form-container");
let closeForm = document.querySelector(".closeForm");

const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");

const form = document.querySelector("form");

const imageUrlInput = form.querySelector(
  "input[placeholder='https://example.com/photo.jpg']"
);
const fullNameInput = form.querySelector(
  "input[placeholder='Enter full name']"
);
const homeTownInput = form.querySelector(
  "input[placeholder='Enter home town']"
);
const purposeInput = form.querySelector(
  "input[placeholder='e.g., Quick appointment note']"
);

const categoryRadios = form.querySelectorAll("input[name='category']");
const submitButton = form.querySelector(".submit-btn");

// SAVE TO LOCAL STORAGE
function saveToLocalStorage(obj) {
  let oldTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  oldTasks.push(obj);
  localStorage.setItem("tasks", JSON.stringify(oldTasks));
}

// SHOW/HIDE FORM
addNote.addEventListener("click", function () {
  formContainer.style.display = "initial";
});
closeForm.addEventListener("click", function () {
  formContainer.style.display = "none";
});

// FORM SUBMISSION
form.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const imageUrl = imageUrlInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const homeTown = homeTownInput.value.trim();
  const purpose = purposeInput.value.trim();

  let selected = false;
  categoryRadios.forEach(function (cat) {
    if (cat.checked) {
      selected = cat.value;
    }
  });

  if (!imageUrl || !fullName || !homeTown || !purpose || !selected) {
    alert("Please fill in all fields.");
    return;
  }

  saveToLocalStorage({
    imageUrl,
    fullName,
    purpose,
    homeTown,
    selected,
  });

  form.reset();
  formContainer.style.display = "none";
  showCards();
});

// SHOW CARDS WITH OPTIONAL FILTER
function showCards(filterCategory = null) {
  stack.innerHTML = "";

  let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  allTasks.forEach(function (task) {
    if (filterCategory && task.selected !== filterCategory) return;

    const card = document.createElement("div");
    card.classList.add("card");

    const avatar = document.createElement("img");
    avatar.src = task.imageUrl;
    avatar.alt = "profile";
    avatar.classList.add("avatar");
    card.appendChild(avatar);

    const name = document.createElement("h2");
    name.textContent = task.fullName;
    card.appendChild(name);

    const hometownInfo = document.createElement("div");
    hometownInfo.classList.add("info");
    hometownInfo.innerHTML = `<span>Home town</span><span>${task.homeTown}</span>`;
    card.appendChild(hometownInfo);

    const bookingsInfo = document.createElement("div");
    bookingsInfo.classList.add("info");
    bookingsInfo.innerHTML = `<span>Purpose</span><span>${task.purpose}</span>`;
    card.appendChild(bookingsInfo);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    const callBtn = document.createElement("button");
    callBtn.classList.add("call");
    callBtn.innerHTML = '<i class="ri-phone-line"></i> Call';
    callBtn.addEventListener("click", () => alert(`Calling ${task.fullName}...`));

    const msgBtn = document.createElement("button");
    msgBtn.classList.add("msg");
    msgBtn.textContent = "Message";
    msgBtn.addEventListener("click", () => alert(`Messaging ${task.fullName}...`));

    buttonsDiv.appendChild(callBtn);
    buttonsDiv.appendChild(msgBtn);
    card.appendChild(buttonsDiv);

    stack.appendChild(card);
  });

  updateStack();
}

// STACK UPDATE
function updateStack() {
  const cards = document.querySelectorAll(".stack .card");
  cards.forEach((card, i) => {
    card.style.zIndex = cards.length - i;
    card.style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.02})`;
    card.style.opacity = `${1 - i * 0.1}`;
  });
}

// SCROLL UP/DOWN
upBtn.addEventListener("click", function () {
  let lastChild = stack.lastElementChild;
  if (lastChild) {
    stack.insertBefore(lastChild, stack.firstElementChild);
    updateStack();
  }
});
downBtn.addEventListener("click", function () {
  const firstChild = stack.firstElementChild;
  if (firstChild) {
    stack.appendChild(firstChild);
    updateStack();
  }
});

// COLOR DOT FILTERS
document.querySelectorAll('.right-colors .dot').forEach(dot => {
  dot.addEventListener('click', function () {
    if (dot.classList.contains('black')) {
      showCards("emergency");
    } else if (dot.classList.contains('purple')) {
      showCards("important");
    } else if (dot.classList.contains('orange')) {
      showCards("urgent");
    } else if (dot.classList.contains('teal')) {
      showCards("no-rush");
    } else if (dot.classList.contains('all')) {
      showCards(null); // show all
    }
  });
});

// INITIAL LOAD
showCards();
