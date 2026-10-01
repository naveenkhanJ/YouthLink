/**
 * The two minimal web pages the links in our emails open (FR-ACC-10, FR-ACC-01).
 *
 * The requirements say the password-reset link opens "the reset form served as a
 * minimal web page (token in the URL), not a mobile deep link" — deep links were
 * already rejected once (FR-ENDORSE-02) and this fallback channel should have the
 * fewest moving parts. So these are plain server-rendered HTML pages: no framework,
 * no external assets, one inline script.
 *
 * Everything interpolated into the markup goes through esc(), including the token,
 * so a crafted link cannot inject script into the page.
 */

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STYLES = `
  body { font-family: -apple-system, "Segoe UI", Roboto, Inter, sans-serif; background: #f3f4f6;
         color: #111827; margin: 0; padding: 24px 16px; }
  main { max-width: 360px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 24px;
         box-shadow: 0 3px 12px rgba(17,24,39,.12); }
  h1 { font-size: 20px; line-height: 28px; margin: 0 0 8px; }
  p { font-size: 14px; line-height: 20px; color: #6b7280; margin: 0 0 16px; }
  label { display: block; font-size: 14px; line-height: 20px; color: #6b7280; margin-bottom: 4px; }
  input { box-sizing: border-box; width: 100%; height: 48px; padding: 0 12px; margin-bottom: 16px;
          border: 1px solid #e5e7eb; border-radius: 8px; font-size: 16px; }
  button { width: 100%; height: 48px; border: 0; border-radius: 8px; background: #0f3d91; color: #fff;
           font-size: 16px; font-weight: 500; }
  button:disabled { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
  .error { font-size: 12px; line-height: 16px; color: #dc2626; min-height: 16px; margin: -8px 0 12px; }
`;

function layout(title, body) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><style>${STYLES}</style></head>
<body><main>${body}</main></body></html>`;
}

/** A page that only states an outcome (email confirmed, link expired, ...). */
function messagePage(title, message) {
  return layout(title, `<h1>${esc(title)}</h1><p>${esc(message)}</p>`);
}

/**
 * The reset form. It posts to the same confirm endpoint the app uses, so there is one
 * implementation of the rules (8–64 characters, token single-use, sessions revoked).
 * @param {string} token - The raw token from the link.
 */
function resetPasswordPage(token) {
  return layout(
    "Reset password",
    `<h1>Reset password</h1>
<p>Choose a new password. Changing your password signs you out on every other device.</p>
<form id="f" novalidate>
  <label for="pw">New password</label>
  <input id="pw" type="password" autocomplete="new-password" maxlength="64">
  <label for="pw2">Confirm new password</label>
  <input id="pw2" type="password" autocomplete="new-password" maxlength="64">
  <div class="error" id="err" role="alert"></div>
  <button id="go" type="submit">Set new password</button>
</form>
<script>
  var token = ${JSON.stringify(String(token ?? "")).replace(/</g, "\\u003c")};
  var f = document.getElementById("f"), err = document.getElementById("err"), go = document.getElementById("go");
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var pw = document.getElementById("pw").value, pw2 = document.getElementById("pw2").value;
    err.textContent = "";
    if (pw.length < 8 || pw.length > 64) { err.textContent = "8 to 64 characters — spaces allowed, no other rules."; return; }
    if (pw !== pw2) { err.textContent = "Passwords do not match"; return; }
    go.disabled = true;
    fetch("/api/account/reset-password/confirm", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token, newPassword: pw })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { ok: r.ok, b: b }; }); })
      .then(function (res) {
        if (res.ok) { document.querySelector("main").innerHTML = "<h1>Password updated</h1><p>You can now log in to YouthLink with your new password.</p>"; }
        else { err.textContent = res.b.error || "That link is no longer valid. Request a new one from the app."; go.disabled = false; }
      }).catch(function () { err.textContent = "Could not reach the server. Check your connection and try again."; go.disabled = false; });
  });
</script>`,
  );
}

export { messagePage, resetPasswordPage };
