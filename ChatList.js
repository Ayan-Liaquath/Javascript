// Fetches the chat list from the local storage and updates the HTML.
window.onload = () => {
  const loggedInUserData = fetchGivenIdDataFromLocalStorage("loggedInUserData");
  if (!loggedInUserData) {
    return;
  }

  const userNameElement = document.getElementById("fullName");
  if (!userNameElement) {
    alert("Internal error!!!");
    return;
  }

  const loggedInUserDataObj = JSON.parse(loggedInUserData);

  userNameElement.textContent = loggedInUserDataObj.name;

  const chatListElement = document.getElementById("chatList");
  if (!chatListElement) {
    alert("Internal error!!!");
    return;
  }

  const groupChat = fetchGivenIdDataFromLocalStorage("groupChat", true);
  if (!groupChat) {
    return;
  }

  const groupChatObj = JSON.parse(groupChat);

  for (let chat of groupChatObj) {
    chatListElement.innerHTML += chat + "<br>";
  }
};

// Updates the chat list and local storage with the new message.
function updateChatList() {
  const loggedInUserData = fetchGivenIdDataFromLocalStorage("loggedInUserData");
  if (!loggedInUserData) {
    return;
  }

  const chatListElement = document.getElementById("chatList");
  const chatInputElement = document.getElementById("chatInput");
  if (!chatListElement || !chatInputElement) {
    alert("Internal error!!!");
    return;
  }

  const dateTimeSplit = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Asia/Calcutta",
  })
    .format(new Date())
    .split(",");

  const date = dateTimeSplit[0].split("/").reverse().join("-");
  const time = dateTimeSplit[1].trim();

  const loggedInUserDataObj = JSON.parse(loggedInUserData);

  const chat = `[${date} ${time}] ${loggedInUserDataObj.name} : ${chatInputElement.value}`;
  chatInputElement.value = "";

  let groupChat = fetchGivenIdDataFromLocalStorage("groupChat", true);
  if (!groupChat) {
    groupChat = [];
    groupChat.push(chat);
    const groupChatObj = JSON.stringify(groupChat);
    localStorage.setItem("groupChat", groupChatObj);
    chatListElement.innerHTML += chat + "<br>";
    return;
  }

  const groupChatObj = JSON.parse(groupChat);
  groupChatObj.push(chat);
  groupChat = JSON.stringify(groupChatObj);
  setValueForGivenIdInLocalStorage("groupChat", groupChat);
  chatListElement.innerHTML += chat + "<br>";
}

// Refresh the chat list from the local storage.
function refreshChatList() {
  const chatListElement = document.getElementById("chatList");
  if (!chatListElement) {
    alert("Internal error!!!");
    return;
  }

  const groupChat = fetchGivenIdDataFromLocalStorage("groupChat", true);
  if (!groupChat) {
    chatListElement.innerHTML = "";
    return;
  }

  const groupChatObj = JSON.parse(groupChat);
  chatListElement.innerHTML = "";

  for (let chat of groupChatObj) {
    chatListElement.innerHTML += chat + "<br>";
  }
}
