import { HALL_OF_FAME_SIZE, MARKERS, RANK_BADGES } from "./constants.js";

/**
 * @typedef {import("./constants.js").ContributorStats} ContributorStats
 */

/**
 * @param {ContributorStats} contributor
 * @param {number} index
 * @returns {string}
 */
function generateHallOfFameCard(contributor, index) {
  const badge = RANK_BADGES[index] || `#${index + 1}`;
  const avatar =
    contributor.avatarUrl || `https://github.com/${contributor.login}.png`;

  const profile =
    contributor.profileUrl || `https://github.com/${contributor.login}`;

  return `
<td align="center" width="20%" valign="top">

### ${badge}

<a href="${profile}">
  <img
    src="${avatar}"
    width="96"
    height="96"
    alt="@${contributor.login}"
    style="border-radius:50%;"
  />
</a>

<br/><br/>

<strong>
<a href="${profile}">
@${contributor.login}
</a>
</strong>

<br/>

🔀 <strong>${contributor.mergedPrs}</strong> Merged PRs

<br/>

⭐ <strong>${contributor.mergedCommits}</strong> Commits

</td>`;
}

/**
 * @param {ContributorStats[]} hallOfFame
 * @returns {string}
 */
export function generateHallOfFameSection(hallOfFame) {
  if (hallOfFame.length === 0) {
    return "## 🏆 Hall of Fame\n\n_No merged contributions yet._";
  }

  const cards = hallOfFame
    .map((contributor, index) => generateHallOfFameCard(contributor, index))
    .join("");

  return `## 🏆 Hall of Fame

<table align="center">
<tr>
${cards}
</tr>
</table>`;
}

/**
 * @param {ContributorStats[]} contributors
 * @returns {string}
 */
export function generateAllContributorsSection(contributors) {
  if (contributors.length === 0) {
    return "## ❤️ All Contributors\n\n_No contributors yet._";
  }

  const avatars = contributors
    .map((contributor) => {
      const avatar =
        contributor.avatarUrl || `https://github.com/${contributor.login}.png`;
      const profile =
        contributor.profileUrl || `https://github.com/${contributor.login}`;
      return `<a href="${profile}"><img src="${avatar}" width="64" height="64" alt="@${contributor.login}" title="@${contributor.login}" style="border-radius:50%;margin:6px;"/></a>`;
    })
    .join("");

  return `## ❤️ All Contributors

<div align="center">

${avatars}

</div>`;
}

/**
 * @param {ContributorStats[]} ranked
 * @returns {string}
 */
export function generateContributorsBlock(ranked) {
  const hallOfFame = ranked.slice(0, HALL_OF_FAME_SIZE);
  return `${generateHallOfFameSection(hallOfFame)}\n\n${generateAllContributorsSection(ranked)}`;
}

/**
 * @param {string} readme
 * @param {string} contributorsBlock
 * @returns {string}
 */
export function replaceContributorsBlock(readme, contributorsBlock) {
  const startIndex = readme.indexOf(MARKERS.start);
  const endIndex = readme.indexOf(MARKERS.end);
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) {
    throw new Error("Contributor markers not found in README.md.");
  }

  const before = readme.slice(0, startIndex + MARKERS.start.length);
  const after = readme.slice(endIndex);
  return `${before}\n\n${contributorsBlock}\n\n${after}`;
}
