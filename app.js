const all = document.querySelector("#all");
const active = document.querySelector("#active");
const complete = document.querySelector("#complete");

window.addEventListener("DOMContentLoaded", () => {
  domLoaded();
});

const activeItem = (item1, item2, item3) => {
  item1.classList.add("active");
  item2.classList.remove("active");
  item3.classList.remove("active");
};

window.addEventListener("scroll", () => {
  const scroll = window.pageYOffset;
  const todoHeader = document.querySelector(".todo-header");

  if (scroll > 10) {
    todoHeader.classList.add("todo-header-scroll");
  } else {
    todoHeader.classList.remove("todo-header-scroll");
  }
});

const toggleTodo = () => {
  const circle = document.querySelector(".circle");
  const moon = document.querySelector(".moon");
  const sun = document.querySelector(".sun");
  const banner = document.querySelector(".banner");
  const new_todo = document.querySelector(".new_todo");
  if (!circle.classList.contains("circle-active-right")) {
    circle.classList.add("circle-active-right");
    circle.classList.remove("circle-active-left");
    sun.classList.add("sunactive");
    moon.classList.add("moonactive");
    banner.style.backgroundImage = "url(./images/bg-mobile-dark.jpg)";
    new_todo.classList.add("new_todo_dark");
    new_todo.classList.remove("new_todo_light");
  } else {
    circle.classList.add("circle-active-left");
    circle.classList.remove("circle-active-right");
    sun.classList.remove("sunactive");
    moon.classList.remove("moonactive");
    banner.style.backgroundImage = "url(./images/bg-mobile-light.jpg)";
    new_todo.classList.add("new_todo_light");
    new_todo.classList.remove("new_todo_dark");
  }
};

const addTodo = (e) => {
  e.preventDefault();
  let text = document.getElementById("addTodoInput");

  if (!text.value.trim() == "") {
    db.collection("todo-items").add({
      text: text.value,
      status: "active",
    });
   // notification("new item has been added", 3000);
    text.value = "";
  } else {
    alert("please enter a value");
  }
};

const domLoaded = () => {
  db.collection("todo-items").onSnapshot((snapshot) => {
    let todoItem = [];
    snapshot.docs.forEach((doc) => {
      todoItem.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    let itemLeft = document.querySelector("#items-left");
    itemLeft.innerHTML = `${todoItem.length}`;
    if (todoItem.length > 0) {
      displayTodo(todoItem);
    } else {
      notFound();
    }
  });
};



const getTodo = () => {
  db.collection("todo-items").onSnapshot((snapshot) => {
    let todoItem = [];

    snapshot.docs.forEach((doc) => {
      todoItem.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    let category = document.querySelectorAll(".category");
    let itemLeft = document.querySelector("#items-left");
    category.forEach((item) => {
      item.addEventListener("click", (e) => {
        const all = document.querySelector("#all");
        const active = document.querySelector("#active");
        const complete = document.querySelector("#complete");
        let target = e.target.dataset.id;

        if (target === "all") {
          activeItem(all, active, complete);
        } else if (target === "active") {
          activeItem(active, all, complete);
        } else if (target === "complete") {
          activeItem(complete, all, active);
        }
        let new_todo_item = todoItem.filter((item) => {
          if (item.status === target) {
            return item;
          }
        });
        if (target === "all") {
          itemLeft.innerHTML = `${todoItem.length}`;
          if (todoItem.length > 0) {
            displayTodo(todoItem);
          } else {
            notFound();
          }
        } else {
          itemLeft.innerHTML = `${new_todo_item.length}`;
          if (new_todo_item.length > 0) {
            displayTodo(new_todo_item);
          } else {
            notFound();
          }
        }
      });
    });
  });
};

getTodo();

function notFound() {
  let todoContiner = document.querySelector(".todo-continer");
  todoContiner.innerHTML = `<div class="not-found"></>
                            <p>no items found</p>
                            </div>`;
}

const displayTodo = (items) => {
  let innerTodo = "";
  let todoContiner = document.querySelector(".todo-continer");

  items.map((item) => {
    const { text, id, status } = item;
    innerTodo += `
    <div data-id=${id} class="todo-list-item">
    <div class="todo-item">
      <div class="checked-item">
        <div  data-id=${id} class="check-mark">
          <img class="${
            status === "complete" ? "check-icon-active" : "check-icon"
          }  " src="./images/icon-check.svg" />
        </div>
      </div>
      <div class="todo-text ${status === "complete" ? "underline" : ""}">
        ${text}
      </div>
    </div>
    <div class="todo-remove">
      <img  id="remove" class="add-close"
      src="./images/icon-cross.svg" alt="" />
    </div>
  </div>`;
    todoContiner.innerHTML = innerTodo;
    check();
    removeItem();
  });
};

const check = () => {
  let checkMark = document.querySelectorAll(".checked-item .check-mark");
  checkMark.forEach((item) => {
    item.addEventListener("click", () => {
      markCompleted(item.dataset.id);
    });
  });
};

const markCompleted = (id) => {
  let item = db.collection("todo-items").doc(id);
  item.get().then((doc) => {
    if (doc.exists) {
      let status = doc.data().status;
      if (status === "active") {
        item.update({
          status: "complete",
        });
       // notification("item changed status from active to complete", 4000);
        activeItem(all, active, complete);
      } else if (status === "complete") {
        item.update({
          status: "active",
        });
       // notification("item changed status from complete to active", 4000);
        activeItem(all, active, complete);
      }
    }
  });
};

const removeItem = () => {
  const removeTodo = document.querySelectorAll("#remove");
  removeTodo.forEach((item) => {
    item.addEventListener("click", (e) => {
      const id = e.target.parentElement.parentElement.dataset.id;
      db.collection("todo-items").doc(id).delete();
      //notification("item has been deleted", 3000);
    });
  });
};
