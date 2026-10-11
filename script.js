
const form = document.getElementById("task-form");
const taskInput = document.getElementById("task");
const subjectInput = document.getElementById("subject");
const deadlineInput = document.getElementById("deadline");
const priorityInput = document.getElementById("priority");
const filterInput = document.getElementById("filter");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

let tasks = [];

try {
  const savedTasks = JSON.parse(
    localStorage.getItem("study-planner-tasks") || "[]"
  );

  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.subject === "string" &&
      typeof task.completed === "boolean"
    );
  }
} catch {
  tasks = [];
}

document.getElementById("today").textContent =
  new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

function saveTasks() {
  localStorage.setItem("study-planner-tasks",
    JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  const filter = filterInput.value;

  const visibleTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent =
    tasks.filter(task => task.completed).length;
  document.getElementById("remaining").textContent =
    tasks.filter(task => !task.completed).length;

  emptyMessage.hidden = visibleTasks.length !== 0;

  visibleTasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "task-card";

    if (task.completed) card.classList.add("is-complete");

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const subject = document.createElement("p");
    subject.textContent = "Subject: " + task.subject;

    const deadline = document.createElement("p");
    deadline.textContent = "Deadline: " + (task.deadline || "Not set");

    const priority = document.createElement("p");
    priority.className = "priority";
    priority.textContent = "Priority: " + task.priority;

    info.append(title, subject, deadline, priority);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent =
      task.completed ? "Undo" : "Complete";

    completeButton.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.append(completeButton, deleteButton);
    card.append(info, actions);
    taskList.append(card);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const subject = subjectInput.value.trim();

  if (!title || !subject) return;

  tasks.push({
    id: crypto.randomUUID(),
    title,
    subject,
    deadline: deadlineInput.value,
    priority: priorityInput.value,
    completed: false
  });

  saveTasks();
  renderTasks();

  form.reset();
  taskInput.focus();
});

filterInput.addEventListener("change", renderTasks);

renderTasks();
