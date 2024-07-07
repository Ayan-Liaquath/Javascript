// Removes the Show Logged out message data from the local storage if refreshed.
window.onbeforeunload = function () {
  if (!localStorage) {
    return;
  }
  localStorage.removeItem("shouldShowLoggedOutMessage");
};

// Checks and shows the logged out message if required.
window.onload = function () {
  if (!fetchGivenIdDataFromLocalStorage("shouldShowLoggedOutMessage", true)) {
    return;
  }

  const loggedOutMessageElement = document.getElementById("loggedOutMessage");
  if (!loggedOutMessageElement) {
    return;
  }

  loggedOutMessageElement.textContent = "You have been logged out";
};
