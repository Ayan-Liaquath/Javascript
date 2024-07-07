// Loads the document data for the logged-in user from the local storage.
window.onload = () => {
  const loggedInUserData = fetchGivenIdDataFromLocalStorage("loggedInUserData");
  if (!loggedInUserData) {
    return;
  }

  const loggedInUserDataObj = JSON.parse(loggedInUserData);
  loggedInUserId = loggedInUserDataObj.id;

  const documentMap = localStorage.getItem("documents");
  if (!documentMap) {
    return;
  }

  const tableBodyElement = document.getElementById("tableBody");
  if (!tableBodyElement) {
    alert("Internal error!!!");
    return;
  }

  const documentMapObj = JSON.parse(documentMap, jsonParseReviver);
  if (!documentMapObj.has(loggedInUserId)) {
    return;
  }
  const userDocuments = documentMapObj.get(loggedInUserId);
  const userDocumentListLength = userDocuments.length;

  for (let index = 0; index < userDocumentListLength; index++) {
    const documentRow = document.createElement("tr");
    documentRow.setAttribute("id", userDocuments[index].id);
    const labelColumn = document.createElement("td");
    labelColumn.setAttribute("class", "td-center-aligned");
    labelColumn.textContent = userDocuments[index].label;
    const fileNameColumn = document.createElement("td");
    fileNameColumn.setAttribute("class", "td-center-aligned");
    fileNameColumn.textContent = userDocuments[index].fileName;
    const actionColumn = document.createElement("td");
    actionColumn.setAttribute("class", "td-center-aligned");
    actionColumn.innerHTML = `<a data-bs-toggle="modal" href="#editDocumentModal" onclick="idOfDocumentToBeEdited('${userDocuments[index].id}')" data-bs-backdrop="static" data-bs-keyboard="false">Edit</a> | 
    <a onclick="idOfDocumentToBeDeleted('${userDocuments[index].id}')" data-bs-toggle="modal" href="#deleteDocumentModal" data-bs-backdrop="static" data-bs-keyboard="false">Delete</a>`;

    documentRow.appendChild(labelColumn);
    documentRow.appendChild(fileNameColumn);
    documentRow.appendChild(actionColumn);
    tableBodyElement.appendChild(documentRow);
  }
};

// Validates and adds the document for the user.
function addDocument() {
  if (!localStorage || !loggedInUserId) {
    alert("Internal error!!!");
    return false;
  }

  const documentDescriptionElement = document.getElementById(
    "documentDescription"
  );
  const documentNameElement = document.getElementById("documentName");

  if (!documentDescriptionElement || !documentNameElement) {
    alert("Internal error!!!");
    return false;
  }

  let documentMap = localStorage.getItem("documents");
  if (!documentMap) {
    addDocumentToStorage(
      new Map(),
      [],
      documentDescriptionElement.value,
      documentNameElement.files[0].name
    );
    $("#addDocumentModal").modal("hide");
    return true;
  }

  const documentMapObj = JSON.parse(documentMap, jsonParseReviver);
  if (!documentMapObj.has(loggedInUserId)) {
    addDocumentToStorage(
      documentMapObj,
      [],
      documentDescriptionElement.value,
      documentNameElement.files[0].name
    );
    $("#addDocumentModal").modal("hide");
    return true;
  }

  const userDocuments = documentMapObj.get(loggedInUserId);

  if (
    userDocuments.find(
      (document) => document.label === documentDescriptionElement.value
    )
  ) {
    alert("File with same description already exists!!!");
    return false;
  }

  if (
    userDocuments.find(
      (document) => document.fileName === documentNameElement.files[0].name
    )
  ) {
    alert("File with same file name already exists!!!");
    return false;
  }

  addDocumentToStorage(
    documentMapObj,
    userDocuments,
    documentDescriptionElement.value,
    documentNameElement.files[0].name
  );

  $("#addDocumentModal").modal("hide");
  return true;
}

// Adds the document for the user in the local storage.
function addDocumentToStorage(
  documentMap,
  userDocuments,
  description,
  fileName
) {
  const tableBodyElement = document.getElementById("tableBody");
  if (!tableBodyElement) {
    alert("Internal error!!!");
    return;
  }

  let uniqueId = crypto.randomUUID();

  while (userDocuments.find((document) => document.id === uniqueId)) {
    uniqueId = crypto.randomUUID();
  }

  const newDocument = {
    id: uniqueId,
    label: description,
    fileName: fileName,
  };

  userDocuments.push(newDocument);
  documentMap.set(loggedInUserId, userDocuments);

  const documentMapObj = JSON.stringify(documentMap, jsonStringifyReplacer);
  localStorage.setItem("documents", documentMapObj);

  const documentRow = document.createElement("tr");
  documentRow.setAttribute("id", newDocument.id);
  const labelColumn = document.createElement("td");
  labelColumn.setAttribute("class", "td-center-aligned");
  labelColumn.textContent = newDocument.label;
  const fileNameColumn = document.createElement("td");
  fileNameColumn.setAttribute("class", "td-center-aligned");
  fileNameColumn.textContent = newDocument.fileName;
  const actionColumn = document.createElement("td");
  actionColumn.setAttribute("class", "td-center-aligned");
  actionColumn.innerHTML = `<a data-bs-toggle="modal" href="#editDocumentModal" onclick="idOfDocumentToBeEdited('${newDocument.id}')" data-bs-backdrop="static" data-bs-keyboard="false">Edit</a> | 
    <a onclick="idOfDocumentToBeDeleted('${newDocument.id}')" data-bs-toggle="modal" href="#deleteDocumentModal" data-bs-backdrop="static" data-bs-keyboard="false">Delete</a>`;

  documentRow.appendChild(labelColumn);
  documentRow.appendChild(fileNameColumn);
  documentRow.appendChild(actionColumn);
  tableBodyElement.appendChild(documentRow);
}

// Stores the ID of the document to be edited.
function idOfDocumentToBeEdited(documentId) {
  documentIdToBeEdited = documentId;
}

// Checks and saves the updated documents details.
function editDocument() {
  if (!localStorage || !documentIdToBeEdited || !loggedInUserId) {
    alert("Internal error!!!");
    return false;
  }

  let documentMap = localStorage.getItem("documents");
  const editDocumentDescriptionElement = document.getElementById(
    "editDocumentDescription"
  );

  if (!documentMap || !editDocumentDescriptionElement) {
    alert("Internal error!!!");
    return false;
  }

  const documentMapObj = JSON.parse(documentMap, jsonParseReviver);
  if (!documentMapObj.has(loggedInUserId)) {
    alert("Internal error!!!");
    return false;
  }

  const userDocuments = documentMapObj.get(loggedInUserId);

  if (
    userDocuments.find(
      (userDocument) =>
        userDocument.id !== documentIdToBeEdited &&
        userDocument.label === editDocumentDescriptionElement.value
    )
  ) {
    alert("Enter unique file description!!!");
    return false;
  }

  const documentIndex = userDocuments.findIndex(
    (document) => document.id === documentIdToBeEdited
  );

  if (documentIndex === -1) {
    alert("Internal error!!!");
    return false;
  }

  userDocuments[documentIndex].label = editDocumentDescriptionElement.value;

  documentMapObj.set(loggedInUserId, userDocuments);

  documentMap = JSON.stringify(documentMapObj, jsonStringifyReplacer);
  localStorage.setItem("documents", documentMap);

  document
    .getElementById(documentIdToBeEdited)
    .getElementsByTagName("td")[0].textContent =
    editDocumentDescriptionElement.value;

  $("#editDocumentModal").modal("hide");

  return true;
}

// Stores the ID of the document to be deleted.
function idOfDocumentToBeDeleted(documentId) {
  documentIdToBeDeleted = documentId;
}

// Deletes the document from the Local storage.
function deleteDocumentId() {
  if (!localStorage || !documentIdToBeDeleted || !loggedInUserId) {
    alert("Internal error!!!");
    return;
  }

  let documentMap = localStorage.getItem("documents");
  if (!documentMap) {
    alert("Internal error!!!");
    return;
  }

  const documentMapObj = JSON.parse(documentMap, jsonParseReviver);
  if (!documentMapObj.has(loggedInUserId)) {
    alert("Internal error!!!");
    return;
  }
  let userDocuments = documentMapObj.get(loggedInUserId);
  userDocuments = userDocuments.filter(
    (document) => document.id !== documentIdToBeDeleted
  );

  documentMapObj.set(loggedInUserId, userDocuments);

  documentMap = JSON.stringify(documentMapObj, jsonStringifyReplacer);
  localStorage.setItem("documents", documentMap);
  document.getElementById(documentIdToBeDeleted).remove();
}

// For converting Map to string.
function jsonStringifyReplacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

// For Map parsing.
function jsonParseReviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}
