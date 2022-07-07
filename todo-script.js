
let dates = document.querySelectorAll(".date");
const day = new Date().getDate();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
let pageNum = 1;
let notesOnPage = 5;
let straightSortDate = true;

dates.forEach((date) => {
  date.innerHTML = day + "/" + month + "/" + year;
});

let filterValue = "All";
let TASKS = [];

const taskInput = document.querySelector(".create_new_task_body");
const addnewtask = document.querySelector(".add_new_task_btn");
const taskList = document.querySelector(".tasks");

let noTasks = () => {
  if (TASKS.length === 0) {
    taskList.innerHTML = "There are no tasks for today!";
  }
};

let allDone = (element) => element.isDone === true;

noTasks();

const filters = document.querySelectorAll(".filters_by_state");

filters.forEach(function (filter) {
  filter.addEventListener("click", function () {
    let thisfilter = filter;
    filterValue = filter.innerHTML;
    if (filterValue === "Done") {
      const tasks = TASKS.filter((item) => item.isDone);
      renderTasks(tasks);
      renderBtn(tasks);
    }
    if (filterValue === "Undone") {
      const tasks = TASKS.filter((item) => !item.isDone);
      renderTasks(tasks);
      renderBtn(tasks);
      addnewtask.onclick = createTask;
    }
    if (filterValue === "All") {
      renderTasks(TASKS);
      renderBtn(TASKS);
      addnewtask.onclick = createTask;
    }
    filters.forEach(function (filter) {
      filter.classList.remove("active_filter");
      thisfilter.classList.add("active_filter");
    });
    deleteTask();
    noTasks();
  });
});

const arrows = document.querySelectorAll(".arrow");

arrows.forEach(function (arrow) {
  arrow.addEventListener("click", function () {
    straightSortDate = !straightSortDate;

    arrows.forEach(function (arrow) {
      arrow.classList.toggle("active_arrow");
    });
    renderTasks(TASKS);
    deleteTask();
    noTasks();
  });
});

addnewtask.onclick = createTask;
taskInput.addEventListener("keydown", function (key) {
  if (key.keyCode === 13) {
    createTask();
  }
});

const renderTasks = (array) => {
  noTasks();

  let dateSortedTasks = straightSortDate ? array : array.slice().reverse();
  let toRender = dateSortedTasks;
  if (filterValue === "Done") {
    toRender = dateSortedTasks.filter((item) => item.isDone);
  }

  if (filterValue === "Undone") {
    toRender = dateSortedTasks.filter((item) => !item.isDone);
  }

  let start = (pageNum - 1) * notesOnPage;
  let end = start + notesOnPage;
  let notes = toRender.slice(start, end);

  if (pageNum != 1 && !notes.length) {
    pageNum = (pageNum - 1)
    start = (pageNum - 1) * notesOnPage;

    end = start + notesOnPage;
    notes = toRender.slice(start, end);
  }

  taskList.innerHTML = "";
  notes.map((item) => {
    taskList.innerHTML += item.main;
    if (item.isDone === true) {
      document.querySelectorAll(".donebtn").forEach((btn) => {
        if (btn.id == item.id) {
          btn.classList.add("done");
        }
      });
    }
  });

  const checkStatus = document.querySelectorAll(".donebtn").forEach((item) => {
    item.addEventListener("click", (event) => {
      item.classList.toggle("done");
      TASKS.forEach((task) => {
        if (item.id == task.id) {
          task.isDone = !task.isDone;
        }
      });
      renderTasks(TASKS);
      deleteTask();
      setTimeout(congrats, 300);
    });
  });
};

const pageBox = document.getElementById("pagination");

let howManyPages = Math.ceil(TASKS.length / notesOnPage) || 1;

renderBtn(TASKS);

function renderBtn(arr) {
  howManyPages = Math.ceil(arr.length / notesOnPage) || 1;
  pageBox.innerHTML = "";

  for (let i = 1; i <= howManyPages; i++) {
    let li = document.createElement("li");
    li.innerHTML = i;
    pageBox.appendChild(li);
  }

  howManyPages = Math.ceil(arr.length / notesOnPage);

  let pages = pageBox.getElementsByTagName("li");

  pages = Array.from(pages);

  pages.forEach(function (page) {
    page.addEventListener("click", function foo() {
      pageNum = +this.innerHTML;
      let active = document.querySelector("#pagination li.active_page");
      if (active) {
        active.classList.remove("active_page");
      }
      this.classList.add("active_page");
      renderTasks(TASKS);
      deleteTask();
    });
    if (pageNum == page.innerHTML) {
      page.classList.add("active_page");
    }
  });
}

function emptyTaskAlert() {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'You can\'t add empty task',
  })
}

function tasksLimit() {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'You archive tasks\' limit.Delete some tasks to add new one',
  })
}

function createTask() {
  const id = new Date().getTime();
  const newTask = {
    isDone: false,
    id: id,
    main: `
        <li class="task_body" id=${id}>
        <div class="right_side side">
            <button id=${id} class='donebtn'}><svg width="16" height="12" viewBox="0 0 16 12" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0661 1.06319L15.0661 1.06322L15.0709 1.068C15.2697 1.26177 15.2697 1.56824 15.0709 1.762L15.0709 1.76197L15.0664 1.76645L5.87645 10.9564C5.68171 11.1512 5.36829 11.1512 5.17355 10.9564L0.933553 6.71645C0.8874 6.67029 0.85079 6.6155 0.825812 6.5552C0.800835 6.4949 0.787979 6.43027 0.787979 6.365C0.787979 6.23318 0.840344 6.10676 0.933553 6.01355C1.02676 5.92034 1.15318 5.86798 1.285 5.86798C1.41682 5.86798 1.54324 5.92034 1.63645 6.01355L5.17645 9.55355L5.53021 9.90732L5.88376 9.55335L14.3638 1.06335L14.3639 1.06319C14.41 1.01703 14.4647 0.9804 14.525 0.95541C14.5852 0.93042 14.6498 0.917557 14.715 0.917557C14.7802 0.917557 14.8448 0.93042 14.905 0.95541C14.9653 0.9804 15.02 1.01703 15.0661 1.06319Z" stroke="black"/>
                </svg>
                </button>
        <p class="tasktxt">${taskInput.value}</p>
        </div>
        <div class="left_side side">
            <p class="date">${day + "/" + month + "/" + year}</p>
        <button class="delete_task"><svg width="16" height="17" viewBox="0 0 15 15" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.125 1.40625H1.875C1.35723 1.40625 0.9375 1.82598 0.9375 2.34375V2.8125C0.9375 3.33027 1.35723 3.75 1.875 3.75H13.125C13.6428 3.75 14.0625 3.33027 14.0625 2.8125V2.34375C14.0625 1.82598 13.6428 1.40625 13.125 1.40625Z"/>
        <path d="M2.18115 4.6875C2.14822 4.68732 2.11561 4.69409 2.08547 4.70736C2.05532 4.72063 2.02831 4.7401 2.0062 4.76451C1.98408 4.78892 1.96736 4.81771 1.95712 4.84902C1.94688 4.88032 1.94336 4.91343 1.94678 4.94619L2.71758 12.3454C2.71742 12.3476 2.71742 12.3497 2.71758 12.3519C2.75785 12.6941 2.92238 13.0096 3.17994 13.2386C3.4375 13.4675 3.77015 13.5939 4.11474 13.5937H10.885C11.2295 13.5937 11.562 13.4673 11.8194 13.2384C12.0768 13.0094 12.2413 12.694 12.2815 12.3519V12.3457L13.0512 4.94619C13.0546 4.91343 13.0511 4.88032 13.0408 4.84902C13.0306 4.81771 13.0139 4.78892 12.9918 4.76451C12.9696 4.7401 12.9426 4.72063 12.9125 4.70736C12.8823 4.69409 12.8497 4.68732 12.8168 4.6875H2.18115ZM9.47197 9.98115C9.51653 10.0245 9.55204 10.0762 9.57644 10.1333C9.60083 10.1905 9.61362 10.2519 9.61406 10.314C9.6145 10.3762 9.60258 10.4378 9.579 10.4952C9.55542 10.5527 9.52065 10.6049 9.4767 10.6489C9.43276 10.6928 9.38052 10.7276 9.32302 10.7511C9.26553 10.7747 9.20392 10.7865 9.14179 10.7861C9.07966 10.7856 9.01824 10.7728 8.96111 10.7484C8.90397 10.724 8.85226 10.6884 8.80898 10.6438L7.5 9.33486L6.19072 10.6438C6.10241 10.7297 5.98388 10.7773 5.86075 10.7764C5.73762 10.7755 5.61977 10.7262 5.53269 10.6392C5.4456 10.5521 5.39626 10.4343 5.39533 10.3112C5.39441 10.1881 5.44197 10.0695 5.52773 9.98115L6.83701 8.67187L5.52773 7.3626C5.44197 7.27425 5.39441 7.1557 5.39533 7.03257C5.39626 6.90944 5.4456 6.79161 5.53269 6.70456C5.61977 6.61752 5.73762 6.56823 5.86075 6.56736C5.98388 6.56648 6.10241 6.6141 6.19072 6.6999L7.5 8.00889L8.80898 6.6999C8.8973 6.6141 9.01583 6.56648 9.13896 6.56736C9.26209 6.56823 9.37993 6.61752 9.46702 6.70456C9.55411 6.79161 9.60344 6.90944 9.60437 7.03257C9.6053 7.1557 9.55774 7.27425 9.47197 7.3626L8.16269 8.67187L9.47197 9.98115Z"/>
        </svg>
        </button>
        </div>  
    </li>
        `,
  };

  if (taskInput.value === "" || taskInput.value.match(/^[ ]+$/)) {
    // alert("You can't add empty task");
    setTimeout(emptyTaskAlert, 300)
    return TASKS;
  }
  TASKS.push(newTask);

  taskInput.value = "";
  if (TASKS.length > 25) {
    // alert("You archive tasks' limit. Delete some tasks to add new one");
    setTimeout(tasksLimit, 250)
    return TASKS;
  }

  renderBtn(TASKS);
  renderTasks(TASKS);
  deleteTask();
  return TASKS;
}

function deleteTask() {
  const close = document.getElementsByClassName("delete_task");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let task = close[i].parentElement.parentElement;
      task.remove();
      TASKS = TASKS.filter(item => item.id !== +task.id)
      renderTasks(TASKS);
      renderBtn(TASKS);
      noTasks();
      deleteTask();
    };
  }
}

const clearBtn = document.getElementById("clean");

clearBtn.addEventListener("click", () => {
  TASKS = [];
  noTasks();
  pageNum = 1;
  renderBtn(TASKS);
});

let congrats = () => {
  if (TASKS.every(allDone)) {
    // alert("Congrats! You've done all your tasks!");
    Swal.fire({
      icon: 'success',
      title: 'Congrats!',
      text: 'You\'ve done all your tasks!',
    })
  }
};

