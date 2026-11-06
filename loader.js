/* GRINTECH 퀴즈 로더 — 임웹 /quiz 페이지의 코드 위젯이 불러온다.
   ?q=<이름> 이 있으면 그 퀴즈를, 없으면 퀴즈 목록을 보여준다. 블로그봇이 자동으로 올리는 파일이니 직접 고치지 마세요. */
(function () {
  var BASE = "https://grintechpet.github.io/grintechquiz1";
  var root = document.getElementById("gtq-root");
  if (!root) {
    root = document.createElement("div");
    var me = document.currentScript;
    if (me && me.parentNode) me.parentNode.insertBefore(root, me); else document.body.appendChild(root);
  }
  var slug = new URLSearchParams(location.search).get("q");
  var bust = "?v=" + Date.now();

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // innerHTML 로 넣은 <script> 는 실행되지 않으므로 새로 만들어 실행한다
  function mount(html) {
    root.innerHTML = html;
    root.querySelectorAll("script").forEach(function (old) {
      if (old.type && old.type !== "text/javascript") return;
      var s = document.createElement("script");
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
  }

  var CSS = '<style>#gtq-root .gl{max-width:520px;margin:0 auto;padding:20px 16px 40px;background:#fff;font-family:"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:#3c3c3c}' +
    '#gtq-root .gl h2{font-size:22px;font-weight:900;margin:0 0 4px}#gtq-root .gl p.s{color:#777;margin:0 0 18px;font-size:14px}' +
    '#gtq-root .gc{display:flex;align-items:center;gap:14px;border:2px solid #e5e5e5;border-radius:16px;padding:14px 16px;margin-bottom:12px;box-shadow:0 4px 0 #e5e5e5;text-decoration:none;color:inherit;background:#fff}' +
    '#gtq-root .gc:active{transform:translateY(4px);box-shadow:none}#gtq-root .gc .i{font-size:30px}#gtq-root .gc .t{flex:1;min-width:0}' +
    '#gtq-root .gc b{display:block;font-size:16px;font-weight:900;word-break:keep-all}#gtq-root .gc span{display:block;font-size:13px;color:#777;margin-top:2px;word-break:keep-all}' +
    '#gtq-root .gc em{font-style:normal;background:#58cc02;color:#fff;border-radius:12px;padding:8px 12px;font-weight:900;font-size:13px;box-shadow:0 3px 0 #46a302;white-space:nowrap}' +
    '#gtq-root .ge{text-align:center;color:#777;padding:40px 10px}</style>';
  var ICONS = ["🐶", "🐱", "🩺", "🦴", "💊", "🐾"];

  function list(msg) {
    fetch(BASE + "/q/index.json" + bust).then(function (r) { return r.json(); }).then(function (items) {
      var h = CSS + '<div class="gl">' + (msg ? '<div class="ge">' + esc(msg) + '</div>' : "") +
        '<h2>반려동물 건강 퀴즈</h2><p class="s">문제를 풀면서 우리 아이 건강 상식을 확인해 보세요.</p>';
      if (!items.length) h += '<div class="ge">아직 올라온 퀴즈가 없어요.</div>';
      items.forEach(function (q, k) {
        h += '<a class="gc" href="' + location.pathname + '?q=' + encodeURIComponent(q.slug) + '">' +
          '<span class="i">' + ICONS[k % ICONS.length] + '</span><span class="t"><b>' + esc(q.title) + '</b><span>' + esc(q.intro) + '</span></span><em>풀기</em></a>';
      });
      mount(h + "</div>");
    }).catch(function () { mount(CSS + '<div class="gl"><div class="ge">퀴즈 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</div></div>'); });
  }

  if (!slug) return list();
  root.innerHTML = '<div style="text-align:center;padding:60px 0;color:#aaa;font-family:sans-serif">퀴즈를 불러오는 중…</div>';
  fetch(BASE + "/q/" + encodeURIComponent(slug) + ".html" + bust)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(mount)
    .catch(function () { list("찾는 퀴즈가 없어요. 아래 목록에서 골라 주세요."); });
})();
