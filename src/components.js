function createDom(str) {
  const dom = new DOMParser();
  return dom.parseFromString(str, "text/html").firstChild.childNodes[1].firstChild;
}

export function TicketButton({ text = "" } = {}, callback) {
  const html = `
    <a id="mactrelly-jira-link" class="button-link js-jira-card" href="#">
      <span class="icon-sm icon-move"></span>&nbsp;${text}
    </a>
  `;
  const dom = createDom(html);
  dom.addEventListener("click", callback);
  return dom;
}
