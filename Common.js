// Fetches the Data from the given ID from the local storage.
function fetchGivenIdDataFromLocalStorage(
  idToBeFetched,
  canBeNull = false,
  customErrorMessage = null
) {
  if (!localStorage || !idToBeFetched) {
    alert("Internal error!!!");
    return null;
  }

  const value = localStorage.getItem(idToBeFetched);

  if (!canBeNull && !value) {
    alert(
      customErrorMessage == null ? "Internal error!!!" : customErrorMessage
    );
    return null;
  }

  return value;
}

// Sets the data from the given ID into the local storage.
function setValueForGivenIdInLocalStorage(idToBeSet, valueToBeSet) {
  if (!localStorage || !idToBeSet || !valueToBeSet) {
    alert("Internal error!!!");
    return;
  }

  localStorage.setItem(idToBeSet, valueToBeSet);
}

// Removes the logged-in user data from the local storage.
function removeLoggedInUserIdFromLocalStorage() {
  if (!localStorage) {
    alert("Internal error!!!");
    return;
  }

  localStorage.removeItem("loggedInUserData");
  localStorage.setItem("shouldShowLoggedOutMessage", "yes");
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
