(function () {
  "use strict";

  var EXTERNAL_LINK_ICON =
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isSafeUrl(url) {
    return /^https?:\/\//i.test(url);
  }

  function renderInlineText(text) {
    var pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    var html = "";
    var lastIndex = 0;
    var match;

    while ((match = pattern.exec(text)) !== null) {
      html += escapeHtml(text.slice(lastIndex, match.index));

      var label = match[1];
      var href = match[2];

      if (isSafeUrl(href)) {
        html +=
          '<a href="' +
          escapeHtml(href) +
          '" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">' +
          escapeHtml(label) +
          "</a>";
      } else {
        html += escapeHtml(match[0]);
      }

      lastIndex = match.index + match[0].length;
    }

    html += escapeHtml(text.slice(lastIndex));
    return html;
  }

  function renderCompany(entry) {
    if (entry.companyUrl && isSafeUrl(entry.companyUrl)) {
      return (
        '<a href="' +
        escapeHtml(entry.companyUrl) +
        '" target="_blank" rel="noopener noreferrer" class="experience-link hover:underline">' +
        escapeHtml(entry.company) +
        EXTERNAL_LINK_ICON +
        "</a>"
      );
    }

    return escapeHtml(entry.company || "");
  }

  function renderBullets(entry) {
    if (!entry.bullets || !entry.bullets.length) {
      return "";
    }

    var items = entry.bullets
      .map(function (bullet) {
        return (
          '<li class="font-body-md text-body-md text-on-surface-variant">' +
          renderInlineText(bullet) +
          "</li>"
        );
      })
      .join("");

    return (
      '<ul class="font-body-md text-body-md text-on-surface-variant list-disc pl-5 space-y-sm mb-sm">' +
      items +
      "</ul>"
    );
  }

  function renderExperienceEntry(entry, isLast) {
    var articleClass =
      "grid grid-cols-1 md:grid-cols-4 gap-md pb-lg" +
      (isLast ? "" : " border-b border-outline-variant/20");

    var projectsLabel = entry.projectsLabel
      ? '<p class="font-label-sm text-label-sm text-on-surface-variant/80 mb-sm">' +
        escapeHtml(entry.projectsLabel) +
        "</p>"
      : "";

    var techStack = entry.techStack
      ? '<p class="font-label-sm text-label-sm text-on-surface-variant">Tech Stack: <strong class="text-on-surface">' +
        escapeHtml(entry.techStack) +
        "</strong></p>"
      : "";

    return (
      '<article class="' +
      articleClass +
      '">' +
      '<div class="md:col-span-1 font-label-md text-label-md text-on-surface-variant/70">' +
      escapeHtml(entry.period || "") +
      "</div>" +
      '<div class="md:col-span-3">' +
      '<h3 class="font-headline-sm text-headline-sm text-on-surface mb-xs">' +
      escapeHtml(entry.role || "") +
      "</h3>" +
      '<div class="font-label-md text-label-md text-secondary mb-sm">' +
      renderCompany(entry) +
      "</div>" +
      projectsLabel +
      renderBullets(entry) +
      techStack +
      "</div>" +
      "</article>"
    );
  }

  function renderExperienceList(entries) {
    if (!entries.length) {
      return '<p class="font-body-md text-body-md text-on-surface-variant">Experience entries will appear here.</p>';
    }

    return entries
      .map(function (entry, index) {
        return renderExperienceEntry(entry, index === entries.length - 1);
      })
      .join("");
  }

  window.renderExperienceList = renderExperienceList;
})();
