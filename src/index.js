import { TicketButton } from "./components";
import * as router from "./routes";
import * as jira from "./jira";

function prependActionButton(button) {
  const actionsList = document.querySelector(
    ".window-module.other-actions > div"
  );
  actionsList.prepend(button);
}

function prependEpicSelect(epics) {
  const actionsList2 = document.querySelector(
    ".window-module.other-actions > div"
  );

  var select = '<select id="mactrelly-jira-selector" style="width: 154px;height: 29px;overflow: hidden; background-color: #0079bf; color: white; border-radius: 5px; padding: 2px 10px; box-shadow: 1px 1px 11px #330033; ">';
  for (var key in epics) {
    select = select + (`<option value="${epics[key]}">${epics[key]} | ${key}</option>`)
  }
  select = select + '</select>]';

  actionsList2.innerHTML = select + actionsList2.innerHTML;
}

function httpGet(theUrl) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function getCardMatches (url) {
  const regex = /\/c\/([\w]*)\/(.*)/
  const matches = url.match(regex);
  const map = {cardID: matches[1], cardFullName: matches[2]};
  return map;
}

function updateDescriptionOfCard(card, desc, apiKey, apiToken) {
  var putString = `https://api.trello.com/1/cards/${card}?desc=${encodeURI(desc)}&token=${apiToken}&key=${apiKey}`;
  console.log(putString);
  //putURL(url);
  fetch(putString, {
    cache: 'no-cache',
    method: 'PUT'
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
}

router.listen(async (path) => {
  const settings = await browser.storage.local.get();

    if (!settings.jiraUrl) {
      console.warn("Jira not configured")
      throw new Error("You must specify a url to your Jira instance");
    }

    var epics = {};

    if (settings.jiraEpics) {
      epics = JSON.parse(settings.jiraEpics);
    }

    var apiKey = settings.apiKey;
    var apiToken = settings.apiToken;

    switch (true) {
      case path.startsWith("/c/"): {

      if (epics) prependEpicSelect(epics);

      prependActionButton(
        TicketButton({ text: "Send To Jira" }, async () => {
          const matches = getCardMatches(path);
          const longPath = `https://trello.com${path}`

          const cardID = matches.cardID;
          const cardFullName = matches.cardFullName;

          const url = `https://trello.com/1/cards/${cardID}`;
          const card = JSON.parse(httpGet(url));

          var cardDesc = card.desc || card.name;

          const cardShortName = card.name;
          let jiraDescription = cardDesc;

          var epic = "";
          if (epics) {
            const e = document.getElementById("mactrelly-jira-selector");
            epic = e.options[e.selectedIndex].value;
            jiraDescription = `${jiraDescription} :: relates to ${epic}`
          }

          jiraDescription = `${jiraDescription} :: trello => ${cardShortName} :: trelloLink => ${longPath}`;

          try{
            //console.log(`do jira \ncardShortName: ${cardShortName}\njiraDescription: ${jiraDescription}\nepic: ${epic}\ncardID: ${cardID}\ncardDesc: ${cardDesc}`);
            const issue = await jira.createIssue(cardShortName, jiraDescription, epic);
            window.open(`${settings.jiraUrl}/browse/${issue.key}`, "_blank");
            const newDescription = `${cardDesc} ${settings.jiraUrl}/browse/${issue.key}`;

            if (apiKey && apiToken) {
              updateDescriptionOfCard(cardID, newDescription, apiKey, apiToken);
            }

          }
          catch(error) {
            console.warn(err.message);
          }
        })
      );

      break;
    } //end case /c/
    default:
      console.info("No route matched");
  }
});
