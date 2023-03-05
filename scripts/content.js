PROGRESS_BAR_ID = "pr-progress-bar--container";

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
        const messageNode = link.querySelector(".text-emphasized");
        return {
          href: link.attributes.href.value,
          sha: commitShaFromHref(link.attributes.href.value),
          message: messageNode ? messageNode.textContent.trim() : "",
        };
      });

      const currentCommitIndex = allCommits.findIndex(
        (c) => c.sha == currentCommit
      );

      preExisting = document.getElementById(PROGRESS_BAR_ID);
      if (preExisting) {
        preExisting.remove();
      }

      const progressBar = buildProgressBar(currentCommitIndex, allCommits);
      attach(progressBar);
    });
  }
}

function percentage(commitIndex, total) {
  return ((commitIndex + 1) * 100) / total;
}

function buildProgressBar(currentCommitIndex, allCommits) {
  const ol = document.createElement("ol");
  ol.id = PROGRESS_BAR_ID;

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

    const link = document.createElement("a");
    link.href = commit.href;
    link.classList.add("pr-progress-bar--link");
    link.title = commit.message;
    segment.appendChild(link);
  });

  return ol;
}

function attach(progressBar) {
  const titleRow = document.querySelector(".commit .commit-title");
  const descriptionRow = document.querySelector(".commit .commit-desc");

  const previousPanel = descriptionRow || titleRow;
  previousPanel.insertAdjacentElement("afterend", progressBar);
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
