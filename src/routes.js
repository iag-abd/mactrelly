const URL_CHANGE_POLL_INTERVAL = 200;

let last;
export function listen(callback) {
  setInterval(() => {
    if (last !== window.location.pathname) {
      last = window.location.pathname;
      callback(window.location.pathname);
    }
  }, URL_CHANGE_POLL_INTERVAL);
}
