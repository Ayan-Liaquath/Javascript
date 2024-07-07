// Fetches the logged-in user email from local storage to display.
window.onload = () => {
  const loggedInUserData = fetchGivenIdDataFromLocalStorage("loggedInUserData");
  if (!loggedInUserData) {
    return;
  }

  const loggedInUserDataObj = JSON.parse(loggedInUserData);

  const element = document.getElementById("welcomeMessage");
  element.textContent = "Welcome! " + loggedInUserDataObj.email;
};
