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

      renderProgressBar(currentCommitIndex, allCommits.length);
    });
  }
}

function percentage(commitIndex, total) {
  return ((commitIndex + 1) * 100) / total;
}

function renderProgressBar(currentCommitIndex, commitCount) {
  const titleRow = document.querySelector(".commit .commit-title");
  const descriptionRow = document.querySelector(".commit .commit-desc");

  const previousPanel = descriptionRow || titleRow;

  const ol = document.createElement("ol");
  ol.classList.add("pr-progress-bar--container");
  previousPanel.insertAdjacentElement("afterend", ol);

  for (i = 0; i < commitCount; i++) {
    const commit = document.createElement("li");
    commit.classList.add("pr-progress-bar--commit");

    if (i <= currentCommitIndex) {
      commit.classList.add("pr-progress-bar--commit-reviewed");
    } else {
      commit.classList.add("pr-progress-bar--commit-pending");
    }
    ol.appendChild(commit);

    const dot = document.createElement("svg");
    dot.classList.add("pr-progress-bar--icon");
    commit.appendChild(dot);
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

chrome.runtime.sendMessage("inject-css");
