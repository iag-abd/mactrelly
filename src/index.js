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

  var select = select + '</select>]';

  actionsList2.innerHTML = select + actionsList2.innerHTML;
}

router.listen(async (path) => {
  const settings = await browser.storage.local.get();
  try {

    if (!settings.jiraUrl) {
      console.warn("Jira not configured")
      throw new Error("You must specify a url to your Jira instance");
    }

    var epics;

    if (settings.jiraEpics) {
      epics = JSON.parse(settings.jiraEpics);
    }

    switch (true) {
      case path.startsWith("/c/"): {
        console.log(path)

        if (!(typeof epics === 'undefined' || epics === null)) prependEpicSelect(epics);

        prependActionButton(
          TicketButton({ text: "Send To Jira" }, async () => {
            const title = document.querySelector(".card-detail-title-assist")
              .textContent;

            const description = document.querySelector(
              ".js-card-desc.current.markeddown"
            ).innerHTML;

            console.log("title")
            try{
              const issue = await jira.createIssue(title, description);
              window.open(`${settings.jiraUrl}/browse/${issue.key}`, "_blank");
            }
            catch(error) {
              console.warn(err.message);
            }
          })
        );

        //if (!(typeof epics === 'undefined' || epics === null)) prependEpicSelect(epics);

        break;
      }
      default:
        console.info("No route matched");
    }
  }
  catch(err) {
    console.warn(err.message);
  }
});
