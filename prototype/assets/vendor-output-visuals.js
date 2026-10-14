(()=>{
function outMolSvg(kind) {
  var A = function (x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#fff" stroke-width="1.4"/>'; };
  var B = function (a, b, c, d, w) { return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="#C2C8D2" stroke-width="' + (w || 4) + '" stroke-linecap="round"/>'; };
  var C = '#7C8492', O = '#DC2626', H = '#DCE1E9';
  var g = '';
  if (kind === 'iso') {
    [[54, 104, 84, 90], [84, 90, 84, 62], [84, 90, 116, 104], [116, 104, 146, 90]].forEach(function (b) { g += B(b[0], b[1], b[2], b[3]); });
    [[54, 104], [84, 90], [84, 62], [116, 104], [146, 90]].forEach(function (p) { g += A(p[0], p[1], 8, C); });
    [[38, 114], [40, 92], [70, 50], [98, 52], [132, 116], [162, 80]].forEach(function (p) { g += A(p[0], p[1], 4.4, H); });
    return g;
  }
  if (kind === 'cell') {
    var seed = 7; var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var pts = []; for (var i = 0; i < 46; i++) pts.push([20 + rnd() * 160, 16 + rnd() * 128]);
    for (var a = 0; a < pts.length; a++) for (var b = a + 1; b < pts.length; b++) {
      var dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1];
      if (dx * dx + dy * dy < 360) g += '<line x1="' + pts[a][0].toFixed(1) + '" y1="' + pts[a][1].toFixed(1) + '" x2="' + pts[b][0].toFixed(1) + '" y2="' + pts[b][1].toFixed(1) + '" stroke="#CDD3DC" stroke-width="2.2"/>';
    }
    for (var k = 0; k < pts.length; k++) { var isO = (k % 11 === 0); g += A(pts[k][0].toFixed(1), pts[k][1].toFixed(1), isO ? 5.4 : (k % 3 ? 3.4 : 4.8), isO ? O : C); }
    return g;
  }
  // 默认 sty：苯环 + 乙烯基 + 乙氧基（含 O）
  [[120, 64, 146, 72], [146, 72, 150, 98], [150, 98, 128, 114], [128, 114, 102, 106], [102, 106, 98, 80], [98, 80, 120, 64],
   [120, 64, 120, 40], [120, 40, 142, 30], [102, 106, 80, 120], [80, 120, 58, 112], [58, 112, 42, 124]].forEach(function (b) { g += B(b[0], b[1], b[2], b[3]); });
  [[120, 64], [146, 72], [150, 98], [128, 114], [102, 106], [98, 80], [120, 40], [142, 30], [58, 112], [42, 124]].forEach(function (p) { g += A(p[0], p[1], 7.5, C); });
  g += A(80, 120, 7, O);
  [[168, 66], [164, 110], [136, 132], [86, 44]].forEach(function (p) { g += A(p[0], p[1], 4.2, H); });
  return g;
}
var SSBR_GALLERY = {
  title: 'Low-Tg SSBR Monomer Design',
  items: [
    { name: '4-ethoxystyrene.pdb', kind: 'sty' },
    { name: 'cis-1,4-isoprene.pdb', kind: 'iso' },
    { name: 'cell.cif', kind: 'cell' }
  ]
};
window.AI4SVendorVisuals={render:outMolSvg,gallery:SSBR_GALLERY};
})();