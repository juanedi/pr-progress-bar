function commitShaFromGithubPath(pathname) {
  const pattern = /.*\/.*\/pull\/[0-9]+\/commits\/([a-f0-9]{40})$/;
  const match = pathname.match(pattern);
  return match ? match[1] : null;
}

function onPageLoad() {
  const currentCommit = commitShaFromGithubPath(window.location.pathname);
  if (currentCommit) {
    window.requestAnimationFrame(() => {
      const allCommits = Array.from(
        document.querySelectorAll(".js-diffbar-range-list a")
      ).map((link) => commitShaFromGithubPath(link.attributes.href.value));

      const currentCommitIndex = allCommits.findIndex(
        (c) => c == currentCommit
      );

      console.log("Total commit count:", allCommits.length);
      console.log("Current commit id:", currentCommit);
      console.log("Index of current commit", currentCommitIndex);
    });
  }
}

onPageLoad();

let lastUrl = window.location.href;
new MutationObserver(() => {
  const url = window.location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onPageLoad();
  }
}).observe(document, { subtree: true, childList: true });
