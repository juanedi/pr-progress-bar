function commitShaFromGithubPath(pathname) {
  const match = pathname.match(/\/commits\/([a-f0-9]{40})$/);
  return match ? match[1] : null;
}

const allCommits = Array.from(
  document.querySelectorAll(".js-diffbar-range-list a")
).map((link) => commitShaFromGithubPath(link.attributes.href.value));

const currentCommit = commitShaFromGithubPath(window.location.pathname);

console.log("Total commit count:", allCommits.length);
console.log("Current commit id:", currentCommit);
console.log("All commits", allCommits);
