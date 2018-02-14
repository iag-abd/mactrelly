import { TicketButton } from "./components";
import * as router from "./routes";
import * as jira from "./jira";

function prependActionButton(button) {
  const actionsList = document.querySelector(
    ".window-module.other-actions > div"
  );
  actionsList.prepend(button);
}

router.listen(async (path) => {
  const settings = await browser.storage.local.get();

  if (!settings.jiraUrl) throw new Error("You must specify a url to your Jira instance");

  switch (true) {
    case path.startsWith("/c/"): {
      prependActionButton(
        TicketButton({ text: "Send To Jira" }, async () => {
          const title = document.querySelector(".card-detail-title-assist")
            .textContent;

          const description = document.querySelector(
            ".js-card-desc.current.markeddown"
          ).innerHTML;

          const issue = await jira.createIssue(title, description);
          window.open(`${settings.jiraUrl}/browse/${issue.key}`, "_blank");
        })
      );
      break;
    }
    default:
      console.info("No route matched");
  }
});
