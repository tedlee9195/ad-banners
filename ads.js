/* 토스쇼핑 자동 광고 — 티스토리 스킨이 불러가는 코드 (2026-09-30)
 *
 * 스킨에는 이 파일을 불러오는 한 줄만 두고, 모양·동작은 여기서 고친다 — 고칠 때마다
 * 사람이 스킨을 다시 열 필요가 없게. 원본은 ~/토스광고만들기/ads.js,
 * 자동배너.py 의 광고목록_올리기가 공개 저장소(ad-banners)에 함께 올린다.
 *
 * 글 화면(#article-view)에서만 돌고, 본문 끝에 [구분선 ◇] → 대가성 문구(가운데) →
 * 무작위 배너 3개 → 가격 안내(가운데)를 붙인다. 이미 광고가 있는 글(예전 고정 배너의
 * '토스쇼핑 쉐어링크' 문구, 서식으로 넣은 .toss-auto-ads)은 건너뛴다. 배너 목록을 못
 * 읽으면 아무것도 안 붙인다 — 대가성 문구만 덩그러니 남지 않게.
 */
(function () {
  var N = 3;
  var 목록주소 = 'https://tedlee9195.github.io/ad-banners/ads.json';
  var 대가성 = '이 콘텐츠는 토스쇼핑 쉐어링크 활동의 일환으로, 링크를 통한 구매가 발생하면 일정 수수료를 지급받습니다.';

  var 구분선 =
    '<div style="display:flex;align-items:center;justify-content:center;max-width:360px;margin:8px auto 30px;">'
    + '<span style="flex:1;height:1px;background:#d5d5d5;"></span>'
    + '<span style="width:9px;height:9px;border:1px solid #c4c4c4;background:#fff;transform:rotate(45deg);margin:0 12px;"></span>'
    + '<span style="flex:1;height:1px;background:#d5d5d5;"></span></div>';

  function 배너칸(b) {
    return '<p style="margin:0 0 6px;text-align:center;"><a href="' + b.url + '" target="_blank" rel="noopener sponsored">'
      + '<img src="' + b.img + '" alt="토스쇼핑 특가 상품" style="width:100%;max-width:700px;border-radius:12px;"></a></p>'
      + '<p style="margin:0 0 22px;text-align:center;"><a href="' + b.url + '" target="_blank" rel="noopener sponsored" '
      + 'style="font-size:15px;font-weight:700;color:#3182f6;">👉 최저가로 구매하기</a></p>';
  }

  function 시작() {
    var 본문 = document.querySelector('#article-view .tt_article_useless_p_margin') || document.querySelector('#article-view');
    if (!본문 || !window.fetch) return;
    if (본문.querySelector('.toss-auto-ads')) return;
    if ((본문.textContent || '').indexOf('토스쇼핑 쉐어링크') >= 0) return;
    fetch(목록주소 + '?t=' + Math.floor(Date.now() / 600000))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var 오늘 = new Date().toISOString().slice(0, 10);
        var 목록 = (d.배너 || []).filter(function (b) { return !b.until || b.until >= 오늘; });
        if (!목록.length) return;
        var 고름 = 목록.slice().sort(function () { return Math.random() - 0.5; }).slice(0, N);
        var 상자 = document.createElement('div');
        상자.className = 'toss-auto-ads';
        상자.style.cssText = 'max-width:700px;margin:44px auto 12px;';
        상자.innerHTML = 구분선
          + '<p style="font-size:14px;line-height:1.7;color:#495057;background:#f1f3f5;border:1px solid #dee2e6;'
          + 'border-radius:8px;padding:10px 14px;margin:0 0 16px;text-align:center;">📢 ' + 대가성 + '</p>'
          + 고름.map(배너칸).join('')
          + '<p style="font-size:13px;line-height:1.7;color:#868e96;text-align:center;margin:0;">'
          + '📌 날짜와 시간에 따라 가격이 달라질 수 있으니 꼭 확인하시고 구입하세요</p>';
        본문.appendChild(상자);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', 시작); else 시작();
})();
