import { AUTOMATION, COMMANDS } from "./constants.js";
import { withMarker } from "./utils.js";

export const comments = {
  successfulClaim: ({ user, issueNumber }) =>
    withMarker(
      AUTOMATION.claimWelcomeMarker,
      `Welcome @${user}, issue #${issueNumber} is now assigned to you.\n\nPlease open your pull request within 24 hours and keep updates on this issue if you need extra context.\n\nBefore submitting, review CONTRIBUTING.md to match repository standards.`,
    ),
  alreadyAssigned: ({ assignee }) =>
    `This issue is currently assigned to @${assignee}. Please check unassigned issues and pick another one that matches your interests.`,
  maxIssueLimitReached: ({ user, activeCount }) =>
    `@${user}, you currently have ${activeCount} active assigned issues. The maximum is 4.\n\nPlease complete, merge, or ${COMMANDS.unclaim} one issue before claiming another.`,
  invalidClaim: ({ user }) =>
    `@${user}, to request assignment use exactly \`${COMMANDS.claim}\` in a new comment.`,
  wrongIssueAuthorClaimAttempt: ({ user, issueAuthor }) =>
    `@${user}, this issue was opened by @${issueAuthor}. For contributor-opened issues, only the issue author may claim it automatically.`,
  successfulUnclaim: ({ assignee }) =>
    `@${assignee} has released this issue. It is now available for others to claim.`,
  unauthorizedUnclaim: ({ actor, assignee }) =>
    `@${actor}, only @${assignee} or a maintainer can use ${COMMANDS.unclaim} on this issue.`,
  noActiveClaimToRelease: ({ user }) =>
    `@${user}, there is no active claim on this issue right now. If you want to work on it, comment \`${COMMANDS.claim}\`.`,
  manualAssignmentWelcome: ({ assignee, issueNumber }) =>
    withMarker(
      AUTOMATION.assignmentWelcomeMarker,
      `Welcome @${assignee}. You are now assigned to issue #${issueNumber}.\n\nPlease keep scope focused, open a PR within 24 hours, and follow CONTRIBUTING.md before requesting review.`,
    ),
  reminder12h: ({ assignee }) =>
    withMarker(
      AUTOMATION.reminder12Marker,
      `Hi @${assignee}, this is a friendly reminder that this claim has been inactive for 12 hours.\n\nIf you are still working on it, leave a quick progress update to keep the claim active.`,
    ),
  reminder18h: ({ assignee }) =>
    withMarker(
      AUTOMATION.reminder18Marker,
      `@${assignee}, this claim has been inactive for 18 hours.\n\nPlease post an update soon. Without activity, it will be released automatically at 24 hours for fairness.`,
    ),
  expiration24h: ({ assignee }) =>
    withMarker(
      AUTOMATION.expiredMarker,
      `@${assignee}, this claim was automatically released after 24 hours of inactivity so other contributors can participate fairly.\n\nYou are welcome to claim another available issue anytime.`,
    ),
  prValidationChecklist: ({ body }) =>
    withMarker(AUTOMATION.prChecklistMarker, body),
  missingLinkedIssue: () =>
    "Please link at least one issue in the PR description (for example `Closes #123`).",
  missingAssignment: ({ issueNumber, assignee }) =>
    `This PR references issue #${issueNumber}, which is currently assigned to @${assignee}. Please coordinate with the assigned contributor or request maintainer override.`,
  missingPrDescription: () =>
    "Please add a clear PR description summarizing what changed, why, and how it was tested.",
  prMergedCongratulations: ({ user, prNumber, prTitle, issuesText }) =>
    withMarker(
      AUTOMATION.mergedMarker,
      `Great work @${user} - your PR #${prNumber} (${prTitle}) is merged.\n\n${issuesText}\n\nThanks again for contributing to MeetOnMemory. If you want to keep going, check Discussions for upcoming work streams and ECSoC updates.`,
    ),
  firstContributorWelcome: ({ user }) =>
    withMarker(
      AUTOMATION.firstWelcomeMarker,
      `Welcome to MeetOnMemory, @${user}.\n\nStart with CONTRIBUTING.md for process details, use Discussions for questions, and feel free to ask maintainers for guidance when needed.`,
    ),
  naturalLanguageClaimGuidance: ({ user }) =>
    `@${user}, thanks for your interest. To claim this issue, comment exactly \`${COMMANDS.claim}\`.\n\nYou can review CONTRIBUTING.md for the full contribution flow.`,
  issueAlreadyClaimed: ({ user }) =>
    `@${user}, this issue is already assigned to you.`,
  issueUnavailable: ({ user }) =>
    `@${user}, this issue is not available for claiming right now (it may be closed, locked, or archived).`,
  maintainerOverrideNotification: ({ actor, target }) =>
    withMarker(
      AUTOMATION.overrideMarker,
      `Maintainer override applied by @${actor}. Assignment state was updated for @${target}.`,
    ),
};
