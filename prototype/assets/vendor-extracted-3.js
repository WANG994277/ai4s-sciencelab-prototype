
  window.addEventListener('load', function () {
    var allowed = { knowledge: true, scidata: true, scimodel: true, scitoolbox: true, sciskill: true, sciagent: true, sciapp: true, 'task-ws': true, 'space-act': true, 'space-asset': true };
    var view = new URLSearchParams(location.search).get('view') || 'knowledge';
    if (!allowed[view]) view = 'knowledge';
    if (view === 'task-ws' || view === 'space-act' || view === 'space-asset') {
      var requestedSpace = new URLSearchParams(location.search).get('space') || '';
      var vendorSpace = { '高性能合成橡胶': '配方优化课题', '页岩气储层评价': '页岩气储层评价课题', 'CO₂ 吸附材料筛选': '催化剂优化项目' }[requestedSpace] || '配方优化课题';
      if (typeof wbSetSpace === 'function') wbSetSpace(vendorSpace);
      if (view === 'task-ws' && typeof enterTaskWorkspace === 'function') {
        enterTaskWorkspace();
        document.querySelectorAll('#hub-three-pane button[onclick="closeHubDetail()"]').forEach(function (button) {
          button.innerHTML = '返回空间概览';
          button.onclick = function () { if (window.parent.AI4SPrototype) window.parent.AI4SPrototype.navigate('space-overview'); };
        });
        return;
      }
      if (view === 'space-act' && typeof switchAssetsTab === 'function') return switchAssetsTab('sp-panel-space', 'nav-space-act');
      if (view === 'space-asset' && typeof switchAssetCat === 'function') return switchAssetCat('toolbox');
    }
    if (typeof switchPage === 'function') switchPage(view);
  });
