// Validates the credentials, logs in and updates the store with the logged-in user data.
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!localStorage) {
    alert("Internal error!!!");
    return false;
  }

  const users = localStorage.getItem("users");

  if (!users) {
    alert("User does not exist!!!");
    return false;
  }

  const usersObj = JSON.parse(users);
  const providedUserData = usersObj.filter((user) => user.email === email);

  if (
    !providedUserData ||
    providedUserData.length != 1 ||
    !providedUserData[0]
  ) {
    alert("User does not exist!!!");
    return false;
  }

  if (providedUserData[0].password === password) {
    const loggedInUserData = {
      id: providedUserData[0].id,
      name: providedUserData[0].fullName,
      email: providedUserData[0].email,
    };

    localStorage.setItem("loggedInUserData", JSON.stringify(loggedInUserData));

    return true;
  }

  alert("Incorrect password!!!");
  return false;
}
