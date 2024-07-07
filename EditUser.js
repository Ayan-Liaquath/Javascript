// Loads the data for the user to be edited from the local storage.
window.onload = () => {
  if (!localStorage) {
    alert("Internal error!!!");
    return;
  }

  const userList = localStorage.getItem("users");
  const loggedInUserData = localStorage.getItem("loggedInUserData");
  const editUserId = localStorage.getItem("editUserId");

  if (!userList || !loggedInUserData || !editUserId) {
    alert("Internal error!!!");
    return;
  }

  const fullNameElement = document.getElementById("fullName");
  const emailElement = document.getElementById("email");

  if (!fullNameElement || !emailElement) {
    alert("Internal error!!!");
    return;
  }

  const userListObj = JSON.parse(userList);
  const providedUserData = userListObj.filter((user) => user.id === editUserId);

  if (
    !providedUserData ||
    providedUserData.length != 1 ||
    !providedUserData[0]
  ) {
    alert("Internal error!!!");
    return;
  }

  fullNameElement.value = providedUserData[0].fullName;
  emailElement.value = providedUserData[0].email;

  const loggedInUserDataObj = JSON.parse(loggedInUserData);

  if (loggedInUserDataObj.id === editUserId) {
    emailElement.setAttribute("disabled", "true");
  }
};

// Saves the edited user data into local storage. If the edited user is the logged-in user then it updates the data for logged-in as well.
function saveUserData() {
  const email = document.getElementById("email").value;
  const fullName = document.getElementById("fullName").value;

  if (!localStorage) {
    alert("Internal error!!!");
    return false;
  }

  let userList = localStorage.getItem("users");
  let loggedInUserData = localStorage.getItem("loggedInUserData");
  const editUserId = localStorage.getItem("editUserId");

  if (!userList || !editUserId || !loggedInUserData) {
    alert("Internal error!!!");
    return false;
  }

  const usersObj = JSON.parse(userList);
  const providedUserDataIndex = usersObj.findIndex(
    (user) => user.id === editUserId
  );

  if (!providedUserDataIndex == -1) {
    alert("Internal error!!!");
    return;
  }

  usersObj[providedUserDataIndex].fullName = fullName;
  usersObj[providedUserDataIndex].email = email;

  const loggedInUserDataObj = JSON.parse(loggedInUserData);
  if (loggedInUserDataObj.id === editUserId) {
    loggedInUserDataObj.name = fullName;
    loggedInUserData = JSON.stringify(loggedInUserDataObj);
    localStorage.setItem("loggedInUserData", loggedInUserData);
  }

  userList = JSON.stringify(usersObj);
  localStorage.setItem("users", userList);

  localStorage.removeItem("editUserId");

  return true;
}
