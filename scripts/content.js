function commitShaFromHref(pathname) {
  const pattern = /.*\/.*\/pull\/[0-9]+\/commits\/([a-f0-9]{40})$/;
  const match = pathname.match(pattern);
  return match ? match[1] : null;
}

function onPageLoad() {
  const currentCommit = commitShaFromHref(window.location.pathname);
  if (currentCommit) {
    window.requestAnimationFrame(() => {
      const allCommits = Array.from(
        document.querySelectorAll(".js-diffbar-range-list a")
      ).map((link) => {
        return {
          href: link.attributes.href.value,
          sha: commitShaFromHref(link.attributes.href.value),
        };
      });

      const currentCommitIndex = allCommits.findIndex(
        (c) => c.sha == currentCommit
      );

      renderProgressBar(currentCommitIndex, allCommits);
    });
  }
}

function percentage(commitIndex, total) {
  return ((commitIndex + 1) * 100) / total;
}

function renderProgressBar(currentCommitIndex, allCommits) {
  preExisting = document.getElementById("pr-progress-bar--container");
  if (preExisting) {
    preExisting.remove();
  }

  const commitCount = allCommits.length;
  const titleRow = document.querySelector(".commit .commit-title");
  const descriptionRow = document.querySelector(".commit .commit-desc");

  const previousPanel = descriptionRow || titleRow;

  const ol = document.createElement("ol");
  ol.id = "pr-progress-bar--container";
  previousPanel.insertAdjacentElement("afterend", ol);

  allCommits.forEach((commit, i) => {
    const segment = document.createElement("li");
    segment.classList.add("pr-progress-bar--commit");

    if (i < currentCommitIndex) {
      segment.classList.add("pr-progress-bar--commit-reviewed");
    } else if (i == currentCommitIndex) {
      segment.classList.add("pr-progress-bar--commit-current");
    } else {
      segment.classList.add("pr-progress-bar--commit-pending");
    }
    ol.appendChild(segment);

    const dot = document.createElement("a");
    dot.href = commit.href;
    dot.classList.add("pr-progress-bar--icon");
    segment.appendChild(dot);
  });

  for (i = 0; i < commitCount; i++) {}
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
