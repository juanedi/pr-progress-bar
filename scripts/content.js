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

function styledDiv(styles, className) {
  const node = document.createElement("div");
  for (property in styles) {
    node.style[property] = styles[property];
  }

  if (className) {
    node.classList.add(className);
  }

  return node;
}

function renderProgressBar(currentCommitIndex, commitCount) {
  const panelAbove = document.querySelector(".commit .commit-title");

  const progressBarContainer = styledDiv(
    {
      width: "100%",
      display: "flex",
      "justify-content": "space-between",
      padding: "14px 0 4px",
      position: "relative",
    },
    "pr-review-progress-bar"
  );
  panelAbove.insertAdjacentElement("afterend", progressBarContainer);

  const progressBar = styledDiv(
    {
      height: "1px",
      width: "100%",
      background: GRAY,
      position: "absolute",
      top: "16px",
    },
    "pr-review-progress-bar--done"
  );
  progressBarContainer.appendChild(progressBar);

  const progressBarInner = styledDiv(
    {
      height: "100%",
      width: `${percentage(currentCommitIndex, commitCount)}%`,
      background: GREEN,
    },
    "pr-review-progress-bar--done"
  );
  progressBar.appendChild(progressBarInner);

  for (i = 0; i < commitCount; i++) {
    const commit = styledDiv(
      {
        height: "6px",
        width: "6px",
        "border-radius": "3px",
      },
      "pr--review-progress-bar--commit"
    );

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
