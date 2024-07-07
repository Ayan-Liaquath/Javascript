// Validates and adds the user into the local storage.
function register() {
  const email = document.getElementById("email").value;
  const fullName = document.getElementById("fullName").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!!!");
    return false;
  }

  if (!localStorage) {
    alert("Internal error!!!");
    return false;
  }

  let users = localStorage.getItem("users");

  if (!users) {
    users = [];
    addUser(users, fullName, email, password);
    return true;
  }

  const usersObj = JSON.parse(users);
  const doesProvidedUserExist = usersObj.find((user) => user.email === email);

  if (doesProvidedUserExist) {
    alert("User already exists!!!");
    return false;
  }

  addUser(usersObj, fullName, email, password);
  return true;
}

// Adds the new user to the local storage.
function addUser(users, fullName, email, password) {
  let uniqueId = crypto.randomUUID();

  while (users.find((user) => user.id === uniqueId)) {
    uniqueId = crypto.randomUUID();
  }

  const user = {
    id: uniqueId,
    fullName: fullName,
    email: email,
    password: password,
  };

  users.push(user);

  const usersObj = JSON.stringify(users);
  localStorage.setItem("users", usersObj);
}
