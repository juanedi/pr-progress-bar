const GREEN = "#3fb950";
const RED = "#f85149";
const GRAY = "rgba(56,139,253,0.15)";

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
  const panelAbove = document.querySelector(".commit .commit-title");

  const progressBarContainer = document.createElement("div");
  progressBarContainer.classList.add("pr-review-progress-bar");
  panelAbove.insertAdjacentElement("afterend", progressBarContainer);

  const progressBar = document.createElement("div");
  progressBar.classList.add("pr-review-progress-bar--bar");
  progressBarContainer.appendChild(progressBar);

  const progressBarInner = document.createElement("div");
  progressBarInner.classList.add("pr-review-progress-bar--done");
  progressBar.appendChild(progressBarInner);

  progressBarContainer.style["width"] = "100%";
  progressBarContainer.style["display"] = "flex";
  progressBarContainer.style["justify-content"] = "space-between";
  progressBarContainer.style["padding"] = "14px 0 4px";
  progressBarContainer.style["position"] = "relative";

  progressBar.style["height"] = "1px";
  progressBar.style["width"] = "100%";
  progressBar.style["background"] = GRAY;
  progressBar.style["position"] = "absolute";
  progressBar.style["top"] = "16px";

  progressBarInner.style["height"] = "100%";
  progressBarInner.style["width"] = `${percentage(
    currentCommitIndex,
    commitCount
  )}%`;
  progressBarInner.style["background"] = GREEN;

  for (i = 0; i < commitCount; i++) {
    const commit = document.createElement("div");
    commit.style["height"] = "6px";
    commit.style["width"] = "6px";
    commit.style["border-radius"] = "3px";

    if (i <= currentCommitIndex) {
      commit.classList.add("pr-review-progress-bar--reviewed");
      commit.style["background"] = GREEN;
    } else {
      commit.classList.add("pr-review-progress-bar--pending");
      commit.style["background"] = GRAY;
    }
    progressBarContainer.appendChild(commit);
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
