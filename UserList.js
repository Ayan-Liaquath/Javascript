// Loads all the users from the local storage to display.
window.onload = () => {
  if (!localStorage) {
    alert("Internal error!!!");
    return;
  }

  const userList = localStorage.getItem("users");
  const loggedInUserData = localStorage.getItem("loggedInUserData");

  if (!userList || !loggedInUserData) {
    alert("Internal error!!!");
    return;
  }

  const tableBodyElement = document.getElementById("tableBody");
  if (!tableBodyElement) {
    alert("Internal error!!!");
    return;
  }

  const userListObj = JSON.parse(userList);
  const userListLength = userListObj.length;
  const loggedInUserDataObj = JSON.parse(loggedInUserData);

  for (let index = 0; index < userListLength; index++) {
    let deleteStyle = "";
    if (userListObj[index].id === loggedInUserDataObj.id) {
      deleteStyle = 'class="anchor-disabled"';
    }

    const userRow = document.createElement("tr");
    userRow.setAttribute("id", userListObj[index].id);
    const nameColumn = document.createElement("td");
    nameColumn.setAttribute("class", "td-center-aligned");
    nameColumn.textContent = userListObj[index].fullName;
    const emailColumn = document.createElement("td");
    emailColumn.setAttribute("class", "td-center-aligned");
    emailColumn.textContent = userListObj[index].email;
    const actionColumn = document.createElement("td");
    actionColumn.setAttribute("class", "td-center-aligned");
    actionColumn.innerHTML = `<a href="./EditUser.html" onclick="updateEditUserId('${userListObj[index].id}')">Edit</a> | 
    <a onclick="idOfUserToBeDeleted('${userListObj[index].id}')" data-bs-toggle="modal" href="#deleteUserModal" data-bs-backdrop="static" data-bs-keyboard="false" ${deleteStyle}>Delete</a>`;

    userRow.appendChild(nameColumn);
    userRow.appendChild(emailColumn);
    userRow.appendChild(actionColumn);
    tableBodyElement.appendChild(userRow);
  }
};

// Updates the local storage with the ID of the user to be deleted.
function updateEditUserId(userId) {
  if (!localStorage || !userId) {
    alert("Internal error!!!");
    return;
  }

  localStorage.setItem("editUserId", userId);
}

// Stores the ID of the user to be deleted.
function idOfUserToBeDeleted(userId) {
  userIdToBeDeleted = userId;
}

// Deletes the user and the documents of the user from the storage.
function deleteUserId() {
  if (!localStorage || !userIdToBeDeleted) {
    alert("Internal error!!!");
    return;
  }
  let userList = localStorage.getItem("users");
  if (!userList) {
    alert("Internal error!!!");
    return;
  }

  let documentList = localStorage.getItem("documents");
  if (documentList) {
    const documentListObj = JSON.parse(documentList, jsonParseReviver);
    if (documentListObj.has(userIdToBeDeleted)) {
      documentListObj.delete(userIdToBeDeleted);
      documentList = JSON.stringify(documentListObj, jsonStringifyReplacer);
      localStorage.setItem("documents", documentList);
    }
  }

  let userListObj = JSON.parse(userList);
  userListObj = userListObj.filter((user) => user.id !== userIdToBeDeleted);
  userList = JSON.stringify(userListObj);
  localStorage.setItem("users", userList);
  document.getElementById(userIdToBeDeleted).remove();
}
