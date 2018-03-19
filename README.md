# MacTrelly

Create a Jira card from a Trello one.

### Settings

There are two settings that you will need configure to get this working.
After installing the addon, head over to the settings page for the addon and
set values for

1. Jira Url - The url to your jira instance. This should be in the format
`http://jira.company.com`.

2. API Key - the Trello API key if you want the Trello description updated.  Leave blank if you don't

3. API Token

4. Jira Field Defaults - This should be a JSON object that gets "spread" into
the fields object when [creating an
issue](https://docs.atlassian.com/software/jira/docs/api/REST/latest/#api/2/issue-createIssue)
in Jira.

5. Epics - JSON with issue.key: description to provide a list of top level cards to link to


### To build...

To build and install this yourself, you will need to create
[API credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/)
using a [Firefox account](https://accounts.firefox.com/signup).
https://addons.mozilla.org/en-US/developers/addon/api/key/

Then, once you have the API key and secret you will need to run

```
npm run package:sign -- --api-key <JWT issuer> --api-secret <JWT secret>
```

A .xpi file will be create in the `web-ext-artifacts` folder. You can then
install this in Firefox manually by dragging the file into an open Firefox
window.

###
