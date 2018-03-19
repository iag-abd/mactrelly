async function api(path, options = {}, base = "api/2") {
  const settings = await browser.storage.local.get();

  const url = `${settings.jiraUrl}/rest/${base}/${path}`;

  return fetch(
    url,
    Object.assign(options, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "User-Agent"
      }
    })
  ).then(response => (console.log(response), response.json()));
}

const get = path => api(path);
const post = (path, data) =>
  api(path, {
    body: JSON.stringify(data),
    method: "post"
  });

export function ticket(ticketId) {
  return api(`issue/${ticketId}`);
}

export function getSession() {
  return api(`session`, {}, "auth/1");
}

export async function createIssue(summary, description, epic) {
  const session = await getSession();
  const settings = await browser.storage.local.get();

  try {
    const data = {
      fields: Object.assign(
        {
          summary,
          description,
          assignee: {
            name: session.name
          }
        },
        JSON.parse(settings.jiraFieldDefaults)
      )
    };

    const issue = await post("issue", data);

    if (epic) {
      try{
        var data2 = {
              type: {
                  name: "Blocks"
              },
              inwardIssue: {
                  key: issue.key
              },
              outwardIssue: {
                  key: epic
              },
              comment: {
                  body: "Linked related issue!"
              }
          };

        await post("issueLink", data2);
      }
      catch (error) {
        console.error(error);
      }
    }

    //TODO: add comment to epic

    return issue;
  } catch (error) {
    console.error("Error creating the ticket", error);
  }
}
