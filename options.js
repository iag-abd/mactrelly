const optionsInputs = ["jiraUrl", "jiraFieldDefaults", "jiraEpics", "apiKey", "apiToken"];

async function loadInputs() {
  const values = await browser.storage.local.get(optionsInputs);

  optionsInputs.forEach(id => {
    const input = document.getElementById(id);

    if (values[id]) {
      input.value = values[id];
    }

    input.addEventListener("input", event => {
      if (id === "jiraFieldDefaults") {
        try {
          JSON.parse(input.value);
          input.dataset.invalid = false;
        } catch(e) {
          input.dataset.invalid = true;
        }
      }
      save(id, event.target.value);
    });
  }); // end for each
}

function save(optionName, value) {
  browser.storage.local.set({
    [optionName]: value
  });
}

loadInputs();
