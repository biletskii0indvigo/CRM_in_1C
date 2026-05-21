// ============ STATE ============
let ST = {
  patients: PATIENTS.slice(),
  tasks: TASKS.slice(),
  drag: null,
  kbAtags: {},
  dealAtags: {},
  taskAtags: {},
  currentScreen: 'deals',
  selectedDealId: null,
  selectedTaskId: null,
  selectedOrderId: null,
  isAssistant: false,
  openTabs: [],            // [{id,label}]
  activeTab: null,
  dealSort: { key:'date', dir:'desc' },
  taskFilter: { show:'all', curator:'all' },
  kbFilter: { curator:'all', type:'all' },
  morningFilter: 'all',
  cardTab: 'orders',
  curatorOnlyForRole: null, // if role is cur0..cur2 -> 0..2
};

// ============ TOAST ============
function toast(msg, kind='info') {
  const el = document.createElement('div');
  el.className = 'toast '+(kind==='ok'?'ok':kind==='err'?'err':'');
  const ic = kind==='ok'?'ti-circle-check':kind==='err'?'ti-alert-triangle':'ti-info-circle';
  el.innerHTML = `<i class="ti ${ic}"></i><div>${msg}</div>`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>{ el.style.animation='slideOut .2s ease forwards'; setTimeout(()=>el.remove(),250); }, 3000);
}

// ============ TABS ============
const SCREEN_META = {
  deals:   { label:'Пациенты (CRM)',             icon:'ti-list' },
  kanban:  { label:'Воронка продаж',            icon:'ti-layout-kanban' },
  morning: { label:'Утреннее планирование',     icon:'ti-sun' },
  tasks:   { label:'Задачи кураторов',          icon:'ti-checkbox' },
  assist:  { label:'РМ помощника куратора',    icon:'ti-headset' },
  reminders:{label:'Напоминания пациентам',         icon:'ti-bell' },
  substitutions:{label:'Замещения / Отпуска',    icon:'ti-beach' },
  sources: { label:'Источники обращений',     icon:'ti-funnel' },
  report:  { label:'Отчёт по ответственным',     icon:'ti-report' },
  analytics:{label:'Аналитика CRM',              icon:'ti-chart-pie' },
  ropDash: { label:'Дашборд РОП',                   icon:'ti-dashboard' },
  curatorDash:{label:'Дашборд куратора',        icon:'ti-user-check' },
  card:    { label:'Карточка пациента',         icon:'ti-id' },
  taskCard:{ label:'Карточка задачи',           icon:'ti-checkbox' },
  orderCard:{label:'Карточка заказа',            icon:'ti-receipt' },
};
function openTab(id, labelOverride){
  const singletons = ['card','taskCard','orderCard'];
  if (!singletons.includes(id) && !ST.openTabs.find(t=>t.id===id)) ST.openTabs.push({id, label: labelOverride||SCREEN_META[id].label});
  if (singletons.includes(id)){
    const idx = ST.openTabs.findIndex(t=>t.id===id);
    if (idx>=0) ST.openTabs[idx].label = labelOverride || SCREEN_META[id].label;
    else ST.openTabs.push({id, label: labelOverride||SCREEN_META[id].label});
  }
  ST.activeTab = id;
  ST.currentScreen = id;
  renderAll();
}
function closeTab(id, ev){
  if (ev) ev.stopPropagation();
  ST.openTabs = ST.openTabs.filter(t=>t.id!==id);
  if (ST.activeTab===id){
    ST.activeTab = ST.openTabs.length ? ST.openTabs[ST.openTabs.length-1].id : 'deals';
    ST.currentScreen = ST.activeTab;
    if (!ST.openTabs.length) openTab('deals');
  }
  renderAll();
}
function renderTabs(){
  const tb = document.getElementById('tabbar');
  let h = `<div class="tab home${ST.activeTab==='home'?' active':''}" onclick="ST.activeTab='home';ST.currentScreen='home';renderAll()" title="Начальная страница"><i class="ti ti-home"></i></div>`;
  ST.openTabs.forEach(t=>{
    const meta = SCREEN_META[t.id] || {};
    h += `<div class="tab${ST.activeTab===t.id?' active':''}" onclick="ST.activeTab='${t.id}';ST.currentScreen='${t.id}';renderAll()">
      <i class="ti ${meta.icon||'ti-file'}" style="font-size:13px;color:#666"></i>
      <span class="lbl">${t.label}</span>
      <div class="x" onclick="closeTab('${t.id}',event)">✕</div>
    </div>`;
  });
  tb.innerHTML = h;
}

// ============ NAV ============
function bindNav(){
  document.querySelectorAll('#nav .nav-item[data-screen]').forEach(el=>{
    el.onclick = ()=>{
      document.querySelectorAll('#nav .nav-sub .nav-item').forEach(n=>n.classList.remove('active'));
      el.classList.add('active');
      openTab(el.dataset.screen);
    };
  });
  document.getElementById('roleSel').onchange = (e)=>{
    const v = e.target.value;
    ST.curatorOnlyForRole = v.startsWith('cur') ? parseInt(v.slice(3)) : null;
    ST.isAssistant = v==='assist';
    const avMap = { rop:'ВС', cur0:'АС', cur1:'РМ', cur2:'ГВ', assist:'ИН', adm:'КИ' };
    document.getElementById('roleAv').textContent = avMap[v];
    toast('Роль переключена: '+e.target.options[e.target.selectedIndex].text, 'ok');
    if (v==='assist') openTab('assist');
    else if (v==='rop') openTab('ropDash');
    else if (v.startsWith('cur')) openTab('curatorDash');
    renderAll();
  };
}

// ============ HELPERS ============
function curatorOf(id){ return CURATORS.find(c=>c.id===id); }
function stageOf(id){ return STAGES.find(s=>s.id===id); }
function patientOf(id){ return ST.patients.find(p=>p.id===id); }

function pillFor(kind, val){
  if (!val || val==='—') return '';
  const v = String(val).toLowerCase();
  let cls = 'p-gray';
  if (kind==='status'){
    if (v==='новый') cls='p-blue';
    else if (v==='в работе') cls='p-amber';
    else if (v==='отказ') cls='p-red';
    else if (v==='выполнен' || v==='выполнена') cls='p-green';
    else if (v==='ожидание' || v==='реактивация') cls='p-purple';
  } else if (kind==='type'){
    if (v==='первичная' || v==='первичный') cls='p-blue';
    else if (v==='повторная' || v==='повторный') cls='p-teal';
    else if (v==='реактивация' || v==='реактивированный') cls='p-orange';
  } else if (kind==='vedenie'){
    cls = 'p-teal';
  } else if (kind==='psycho'){
    if (v==='тревожный') cls='p-red';
    else if (v==='решительный') cls='p-green';
    else if (v==='экономный') cls='p-amber';
    else if (v==='исследователь') cls='p-purple';
  } else if (kind==='dozhim'){
    if (v.includes('эскал')) cls='p-red';
    else if (v.includes('день 7')) cls='p-purple';
    else if (v.includes('день 3')) cls='p-amber';
    else if (v.includes('день 0')) cls='p-blue';
  } else if (kind==='priority'){
    if (v==='а') cls='p-red';
    else if (v==='в') cls='p-amber';
    else cls='p-gray';
  } else if (kind==='task'){
    if (v.includes('эскал')) cls='p-red';
    else if (v.includes('день 7')) cls='p-purple';
    else if (v.includes('день 3')) cls='p-amber';
    else if (v.includes('день 0')) cls='p-blue';
    else if (v.includes('ведение')) cls='p-teal';
    else if (v.includes('реактив')) cls='p-orange';
    else if (v.includes('nps')) cls='p-green';
  }
  return `<span class="pill ${cls}">${val}</span>`;
}
function curatorPill(cId){
  if (cId==null) return '<span class="pill p-gray">без куратора</span>';
  const c = curatorOf(cId);
  return `<span class="dot" style="background:${c.dot}"></span>${c.name}`;
}

// ============ FILTERS ============
function filterPatientsByTags(){
  const list = ST.patients.filter(p=>{
    if (ST.curatorOnlyForRole!=null && p.curatorId!==ST.curatorOnlyForRole) return false;
    return true;
  });
  const groups = ST.dealAtags;
  if (!Object.keys(groups).length) return list;
  return list.filter(p=>{
    for (const [k,vals] of Object.entries(groups)){
      if (!vals.length) continue;
      if (k==='type'){
        const t = p.type==='Первичная'?'первичный':p.type==='Повторная'?'повторный':'реактивированный';
        if (!vals.includes(t)) return false;
      } else if (k==='vedenie'){
        if (!vals.includes((p.vedenie||'').toLowerCase())) return false;
      } else if (k==='geo'){
        if (!vals.includes(p.geo)) return false;
      } else if (k==='psycho'){
        if (!vals.includes(p.psycho)) return false;
      } else if (k==='source'){
        if (!vals.includes(p.source)) return false;
      } else if (k==='format'){
        if (!vals.includes(p.format)) return false;
      } else if (k==='dozhim'){
        if (!vals.includes(p.dozhim)) return false;
      }
    }
    return true;
  });
}

function tagPanelHTML(stateKey, groupsToShow){
  const groups = groupsToShow || TAG_GROUPS;
  const active = ST[stateKey] || {};
  let total = 0;
  Object.values(active).forEach(v=>total+=v.length);
  let h = '';
  groups.forEach(g=>{
    h += `<div class="taggrp"><span class="gh">${g.label}</span>`;
    g.tags.forEach(t=>{
      const on = (active[g.key]||[]).includes(t);
      h += `<span class="tag${on?' on':''}" onclick="toggleTag('${stateKey}','${g.key}','${t}')">${t}</span>`;
    });
    h += `</div>`;
  });
  h += `<button class="tag-reset" onclick="resetTags('${stateKey}')"><i class="ti ti-x"></i> Сбросить${total?' ('+total+')':''}</button>`;
  return h;
}
function toggleTag(stateKey, group, tag){
  if (!ST[stateKey][group]) ST[stateKey][group] = [];
  const i = ST[stateKey][group].indexOf(tag);
  if (i>=0) ST[stateKey][group].splice(i,1);
  else ST[stateKey][group].push(tag);
  renderAll();
}
function resetTags(stateKey){
  ST[stateKey] = {};
  renderAll();
}

// ============ SCREENS ============
function renderHome(){
  return `<div class="form-pad">
    <h2 style="margin:8px 0 4px;font-size:18px">Индвиго · CRM-модуль «Маркетинг» <span style="color:#888;font-weight:400;font-size:13px;margin-left:8px">v0.1.0 · Фаза 1 (MVP)</span></h2>
    <div style="color:#666;margin-bottom:18px">Начальная страница · 18.05.2026 · ${ST.openTabs.length} активных вкладок · <a class="lk" onclick="toast('Открыт TECHNICAL_SPECIFICATION.md','ok')">ТЗ v0.1.0</a></div>
    <div class="metrics" style="grid-template-columns:repeat(4,1fr)">
      <div class="metric"><div class="k">Сделок в работе</div><div class="v">${ST.patients.filter(p=>p.status==='В работе').length}</div><div class="s">из ${ST.patients.length} всего</div></div>
      <div class="metric"><div class="k">Без куратора</div><div class="v" style="color:var(--red)">${ST.patients.filter(p=>p.curatorId==null).length}</div><div class="s">требуют распределения</div></div>
      <div class="metric"><div class="k">Задач просрочено</div><div class="v" style="color:var(--red)">${ST.tasks.filter(t=>t.urgency==='overdue'&&!t.done).length}</div><div class="s">из ${ST.tasks.filter(t=>!t.done).length} открытых</div></div>
      <div class="metric"><div class="k">Конверсия дожима</div><div class="v" style="color:var(--green)">28,4%</div><div class="s">цель 25% · план перевыполнен</div></div>
    </div>
    <div class="group"><div class="group-h"><span class="ch">▼</span>Избранное</div>
      <div style="padding:10px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${['ropDash','curatorDash','deals','kanban','morning','tasks','assist','reminders','substitutions','analytics','sources','report'].map(s=>`
          <div onclick="openTab('${s}')" style="border:1px solid var(--border-light);padding:10px;cursor:pointer;background:#fff;border-radius:2px" onmouseover="this.style.background='#FFFCE8'" onmouseout="this.style.background='#fff'">
            <div style="font-weight:700;color:var(--link);font-size:13px">${SCREEN_META[s].label}</div>
            <div style="font-size:11px;color:#777;margin-top:2px">Открыть в новой вкладке</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// ---------- SCREEN: Пациенты (CRM) ----------
function renderDeals(){
  const list = sortDeals(filterPatientsByTags());
  document.getElementById('recCount').textContent = `Пациентов: ${list.length} из ${ST.patients.length}`;
  const arr = (k)=> ST.dealSort.key===k ? (ST.dealSort.dir==='asc'?' ↑':' ↓') : '';
  const cols = [
    {k:'_',  l:'',                  w:'28px', sort:false},
    {k:'num',l:'№ карты',          w:'108px'},
    {k:'date',l:'Дата входа',     w:'90px'},
    {k:'name',l:'Пациент',          w:'210px'},
    {k:'abc',l:'ABC',                w:'52px'},
    {k:'ageCat',l:'Возр.',           w:'62px'},
    {k:'finance',l:'Финанс.',         w:'72px'},
    {k:'cycle',l:'Цикл',             w:'90px'},
    {k:'activeOrders',l:'Акт. заказов', w:'80px'},
    {k:'sumOrders',l:'Сумма по заказам', w:'120px'},
    {k:'sumPaid',l:'Оплачено',    w:'100px'},
    {k:'sumDue', l:'К оплате',     w:'100px'},
    {k:'nextContact',l:'След. контакт', w:'110px'},
    {k:'curatorId',l:'Куратор',      w:'150px'},
    {k:'comment',l:'Комментарий',   w:'260px'},
    {k:'status',l:'Статус',          w:'100px'},
    {k:'type',l:'Тип',                w:'95px'},
    {k:'priority',l:'Приоритет',     w:'70px'},
    {k:'vedenie',l:'Тип ведения',   w:'130px'},
    {k:'psycho',l:'Психотип',        w:'110px'},
    {k:'geo',l:'Гео',                 w:'90px'},
    {k:'source',l:'Источник',        w:'90px'},
  ];

  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="createDeal()"><i class="ti ti-user-plus"></i> Создать пациента</button>
    <button class="tb" onclick="toast('Карточка скопирована (демо)')"><i class="ti ti-copy"></i></button>
    <button class="tb" onclick="toast('Изменения сохранены','ok')"><i class="ti ti-device-floppy"></i> Записать</button>
    <button class="tb" onclick="toast('Запись помечена на удаление','err')"><i class="ti ti-trash"></i></button>
    <div class="tb-sep"></div>
    <button class="tb"><i class="ti ti-filter"></i> Найти</button>
    <button class="tb" onclick="resetTags('dealAtags');toast('Фильтры сброшены','ok')"><i class="ti ti-filter-off"></i> Отменить поиск</button>
    <div class="tb-sep"></div>
    <button class="tb"><i class="ti ti-printer"></i> Печать</button>
    <button class="tb"><i class="ti ti-file-export"></i> Excel</button>
    <div class="grow"></div>
    <div class="filterbar" style="border:none;padding:0">
      <input type="checkbox" id="fltOnly" ${ST.curatorOnlyForRole!=null?'checked':''}>
      <label for="fltOnly" class="lbl">Куратор:</label>
      <div class="pick">
        <input value="${ST.curatorOnlyForRole!=null?curatorOf(ST.curatorOnlyForRole).full:'Все пользователи'}" readonly>
        <div class="b" title="Выбрать">▼</div>
        <div class="b" title="Открыть">↗</div>
      </div>
    </div>
  </div>

  <div class="tagpanel">${tagPanelHTML('dealAtags')}<span class="tagcount">Показано <b>${list.length}</b> из ${ST.patients.length}</span></div>

  <div class="tablewrap">
    <table class="t" id="dealsTable">
      <colgroup>${cols.map(c=>`<col style="width:${c.w}">`).join('')}</colgroup>
      <thead><tr>
        ${cols.map(c=>`<th ${c.sort!==false?`onclick="sortDealsBy('${c.k}')"`:''}>${c.k==='_'?'<input type="checkbox">':c.l}<span class="sortarrow">${arr(c.k)}</span></th>`).join('')}
      </tr></thead>
      <tbody>
        ${list.map(p=>{
          const od = p.dozhim==='день 7'||p.dozhim==='эскалация';
          const dueColor = p.sumDue>0 ? 'color:var(--amber-border);font-weight:600' : 'color:#999';
          return `<tr class="${ST.selectedDealId===p.id?'sel':''}${od?' overdue':''}" onclick="selectDeal('${p.id}',event)" ondblclick="openDealCard('${p.id}')">
            <td><input type="checkbox" onclick="event.stopPropagation()"></td>
            <td><a class="lk" onclick="event.stopPropagation();openDealCard('${p.id}')">${p.num}</a></td>
            <td>${p.date} 10:14</td>
            <td><a class="lk" onclick="event.stopPropagation();openDealCard('${p.id}')">${p.name}</a> ${p.doNotContact?'<i class="ti ti-phone-off" style="color:var(--red);font-size:13px;vertical-align:-2px" title="Не связываться"></i>':''} ${p.dms?'<span class="pill p-amber" title="ДМС">ДМС</span>':''} ${p.abonement?`<span class="pill p-blue" title="Абонемент: ${p.abonement.used}/${p.abonement.total}"><i class="ti ti-ticket"></i> ${p.abonement.used}/${p.abonement.total}</span>`:''}</td>
            <td style="text-align:center">${pillForAbc(p.abc)}</td>
            <td style="text-align:center">${typeof pillForAge==='function'?pillForAge(p.ageCat):''}</td>
            <td style="text-align:center">${typeof pillForFinance==='function'?pillForFinance(p.finance):''}</td>
            <td style="font-size:11px"><b>№${p.cycleNum}</b> <span style="color:#777">· ${p.cycleType}</span></td>
            <td style="text-align:center">${p.activeOrders?`<span class="pill p-blue">${p.activeOrders}</span>`:`<span style="color:#aaa">—</span>`}${p.ordersCount>p.activeOrders?` <span style="color:#999;font-size:10.5px">/${p.ordersCount}</span>`:''}</td>
            <td style="text-align:right;font-weight:600">${p.sumOrders?fmt(p.sumOrders):''}</td>
            <td style="text-align:right;color:var(--green)">${p.sumPaid?fmt(p.sumPaid):''}</td>
            <td style="text-align:right;${dueColor}">${p.sumDue>0?fmt(p.sumDue):''}</td>
            <td style="${od?'color:var(--red);font-weight:600':''}">${p.nextContact||''}</td>
            <td>${p.curatorId!=null?curatorPill(p.curatorId):'<span class="ph">— не назначен —</span>'}</td>
            <td title="${p.comment}">${p.comment}${p.dozhim?` <i style="color:#888">[Дожим: ${p.dozhim}]</i>`:''}</td>
            <td>${pillFor('status',p.status)}</td>
            <td>${pillFor('type',p.type)}</td>
            <td>${pillFor('priority',p.priority)}</td>
            <td>${p.vedenie?pillFor('vedenie',p.vedenie):''}</td>
            <td>${pillFor('psycho',p.psycho)}</td>
            <td>${p.geo}</td>
            <td>${p.source}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}
function sortDealsBy(k){
  if (k==='_') return;
  if (ST.dealSort.key===k) ST.dealSort.dir = ST.dealSort.dir==='asc'?'desc':'asc';
  else ST.dealSort = { key:k, dir:'asc' };
  renderAll();
}
function sortDeals(list){
  const {key,dir} = ST.dealSort;
  const mul = dir==='asc'?1:-1;
  return list.slice().sort((a,b)=>{
    let va=a[key], vb=b[key];
    if (va==null) va=''; if (vb==null) vb='';
    if (typeof va==='number'||typeof vb==='number') return ((+va||0)-(+vb||0))*mul;
    return String(va).localeCompare(String(vb),'ru')*mul;
  });
}
function selectDeal(id, ev){
  ST.selectedDealId = id;
  renderAll();
}
function openDealCard(id){
  ST.selectedDealId = id;
  const p = patientOf(id);
  openTab('card', `${p.num} · ${p.name.split(' ')[0]} ${p.name.split(' ')[1]?.[0]||''}.`);
}
function orderOf(oid){
  for (const p of ST.patients){
    const o = (p.orders||[]).find(x=>x.id===oid);
    if (o) return {order:o, patient:p};
  }
  return null;
}
function openOrderCard(oid){
  ST.selectedOrderId = oid;
  const r = orderOf(oid); if (!r) return;
  openTab('orderCard', `Заказ ${r.order.num}`);
}
function createDeal(){
  const id = 'p'+ST.patients.length;
  const newP = { id, name:'Новый пациент', initials:'НП', num:'000-005'+(4490+ST.patients.length),
    date:'14.05.26', payDate:'', nextContact:'', stage:'lead', curatorId:null, status:'Новый',
    type:'Первичная', priority:'С', vedenie:'', psycho:'исследователь', geo:'местный',
    source:'сайт', format:'визит', dozhim:null, sum:0, comment:'Новая карточка — заполните данные пациента.', orders:[], activeOrders:0, ordersCount:0, sumOrders:0, sumPaid:0, sumDue:0, sumCancelled:0 };
  ST.patients.unshift(newP);
  ST.selectedDealId = id;
  openDealCard(id);
  toast('Создана карточка пациента '+newP.num,'ok');
}

// ---------- SCREEN: Kanban ----------
function renderKanban(){
  const filtered = ST.patients.filter(p=>{
    if (ST.curatorOnlyForRole!=null && p.curatorId!==ST.curatorOnlyForRole) return false;
    if (ST.kbFilter.curator!=='all'){
      if (ST.kbFilter.curator==='none' && p.curatorId!=null) return false;
      else if (ST.kbFilter.curator!=='none' && p.curatorId!==parseInt(ST.kbFilter.curator)) return false;
    }
    if (ST.kbFilter.type!=='all'){
      const t = p.type==='Первичная'?'первичный':p.type==='Повторная'?'повторный':'реактивированный';
      if (t!==ST.kbFilter.type) return false;
    }
    // tag filter (subset of groups)
    for (const [k,vals] of Object.entries(ST.kbAtags)){
      if (!vals.length) continue;
      if (k==='vedenie' && !vals.includes((p.vedenie||'').toLowerCase())) return false;
      if (k==='psycho' && !vals.includes(p.psycho)) return false;
      if (k==='dozhim' && !vals.includes(p.dozhim)) return false;
      if (k==='geo' && !vals.includes(p.geo)) return false;
    }
    return true;
  });
  const totalSum = filtered.reduce((s,p)=>s+p.sum,0);
  const kbGroups = TAG_GROUPS.filter(g=>['vedenie','psycho','dozhim','geo'].includes(g.key));

  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="createDeal()"><i class="ti ti-plus"></i> Создать сделку</button>
    <button class="tb" onclick="renderAll();toast('Канбан обновлён','ok')"><i class="ti ti-refresh"></i> Обновить</button>
    <div class="tb-sep"></div>
    <span class="lbl" style="font-size:12px;color:#555">Куратор:</span>
    <select class="role-sel" onchange="ST.kbFilter.curator=this.value;renderAll()" style="height:22px;border:1px solid var(--border)">
      <option value="all" ${ST.kbFilter.curator==='all'?'selected':''}>Все</option>
      <option value="none" ${ST.kbFilter.curator==='none'?'selected':''}>Без куратора</option>
      ${CURATORS.map(c=>`<option value="${c.id}" ${ST.kbFilter.curator==String(c.id)?'selected':''}>${c.name}</option>`).join('')}
    </select>
    <span class="lbl" style="font-size:12px;color:#555;margin-left:10px">Тип:</span>
    <select class="role-sel" onchange="ST.kbFilter.type=this.value;renderAll()" style="height:22px;border:1px solid var(--border)">
      <option value="all">Все</option><option value="первичный">Первичный</option><option value="повторный">Повторный</option><option value="реактивированный">Реактивированный</option>
    </select>
    <div class="grow"></div>
    <div class="sumblob"><b>Σ Воронки (акт. заказы):</b> ${fmt(filtered.reduce((s,p)=>s+(p.orders||[]).filter(o=>o.status==='Активен'||o.status==='Частично оплачен').reduce((a,o)=>a+o.sum,0),0))} ₽ &nbsp;·&nbsp; <b>${filtered.length}</b> из ${ST.patients.length} пациентов</div>
  </div>

  <div class="tagpanel">${tagPanelHTML('kbAtags', kbGroups)}</div>

  <div class="kanban" id="kanban">
    ${STAGES.map(s=>{
      const cards = filtered.filter(p=>p.stage===s.id);
      const colSum = cards.reduce((a,b)=>a+(b.sumOrders||0),0);
      const colActive = cards.reduce((a,b)=>a+(b.activeOrders||0),0);
      return `
      <div class="col" ondragover="kbOver(event,'${s.id}')" ondragleave="kbLeave(event)" ondrop="kbDrop(event,'${s.id}')">
        <div class="col-strip" style="background:${s.strip}"></div>
        <div class="col-h"><span>${s.name}</span><span class="ct">${cards.length}</span></div>
        <div class="col-b" id="col-${s.id}">
          ${cards.map(p=>kCardHTML(p)).join('')||'<div style="color:#aaa;font-size:11px;padding:10px;text-align:center">— пусто —</div>'}
        </div>
        <div class="col-sum"><span>Σ ${fmt(colSum)} ₽</span><span>${colActive} акт. зак.</span></div>
      </div>`;
    }).join('')}
  </div>`;
}
function kCardHTML(p){
  const tags = [];
  if (p.type==='Первичная') tags.push('<span class="pill p-blue">первичный</span>');
  else if (p.type==='Повторная') tags.push('<span class="pill p-teal">повторный</span>');
  else tags.push('<span class="pill p-orange">реактив.</span>');
  if (p.vedenie) tags.push(`<span class="pill p-teal">${p.vedenie.slice(0,12)}</span>`);
  tags.push(`<span class="pill ${p.psycho==='тревожный'?'p-red':p.psycho==='решительный'?'p-green':p.psycho==='экономный'?'p-amber':'p-purple'}">${p.psycho}</span>`);
  if (p.dozhim) tags.push(`<span class="pill ${p.dozhim==='эскалация'?'p-red':p.dozhim==='день 7'?'p-purple':p.dozhim==='день 3'?'p-amber':'p-blue'}">${p.dozhim}</span>`);
  const cur = p.curatorId!=null?curatorOf(p.curatorId):null;
  const ordersLine = p.ordersCount ? `<div style="display:flex;align-items:center;gap:5px;margin:4px 0 5px;padding:3px 6px;background:#F4F8FC;border:1px solid #D6E2EF;border-radius:2px;font-size:10.5px">
        <i class="ti ti-receipt" style="color:#1565C0"></i>
        <span><b>${p.activeOrders||0}</b>/${p.ordersCount} заказ${p.ordersCount>1?'ов':''}</span>
        <span style="margin-left:auto;font-weight:700;color:#222">${fmt(p.sumOrders)} ₽</span>
      </div>` : `<div style="font-size:10.5px;color:#aaa;margin:2px 0 5px">— без заказов —</div>`;
  return `<div class="kcard" draggable="true" ondragstart="kbDragStart(event,'${p.id}')" ondragend="kbDragEnd(event)" ondblclick="openDealCard('${p.id}')">
    <div class="kn" title="${p.name}">${p.name}</div>
    <div class="km">${p.source} · ${p.date}${p.sumDue>0?` · <span style="color:var(--amber-border);font-weight:600">к оплате ${fmt(p.sumDue)} ₽</span>`:''}</div>
    ${ordersLine}
    <div class="kt">${tags.join('')}</div>
    <div class="kf">${cur?`<span class="dot" style="background:${cur.dot}"></span>${cur.name}`:'<span style="color:#999">— без куратора —</span>'}</div>
  </div>`;
}
function kbDragStart(e, pid){ ST.drag = pid; try{ e.dataTransfer.setData('text/plain',pid);}catch(_){} e.currentTarget.classList.add('dragging'); }
function kbDragEnd(e){ e.currentTarget.classList.remove('dragging'); document.querySelectorAll('.col-b').forEach(c=>c.classList.remove('dz-on')); }
function kbOver(e, stage){ e.preventDefault(); document.getElementById('col-'+stage).classList.add('dz-on'); }
function kbLeave(e){ e.currentTarget.querySelector('.col-b')?.classList.remove('dz-on'); }
function kbDrop(e, stage){
  e.preventDefault();
  const pid = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || ST.drag;
  document.querySelectorAll('.col-b').forEach(c=>c.classList.remove('dz-on'));
  if (!pid) return;
  const p = patientOf(pid); if (!p) return;
  if (p.stage===stage) return;
  const old = stageOf(p.stage); p.stage = stage;
  // sync status superficially
  if (stage==='final') p.status='Выполнен';
  if (stage==='react') p.status='Реактивация';
  if (stage==='waiting') p.status='Ожидание';
  ST.drag = null;
  renderAll();
  toast(`${p.name}: ${old.name} → ${stageOf(stage).name}`,'ok');
}

// ---------- SCREEN: Morning Planning ----------
function renderMorning(){
  const unassigned = ST.patients.filter(p=>p.curatorId==null);
  const finals = ST.patients.filter(p=>p.stage==='final').length;
  const byCur = CURATORS.map(c=>({c, list: ST.patients.filter(p=>p.curatorId===c.id)}));
  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="autoAssign()"><i class="ti ti-wand"></i> Авто-распределить</button>
    <button class="tb" onclick="resetAssign()"><i class="ti ti-rotate-clockwise-2"></i> Сбросить</button>
    <button class="tb" onclick="toast('Уведомления отправлены кураторам (3)','ok')"><i class="ti ti-send"></i> Уведомить кураторов</button>
    <button class="tb" onclick="toast('Открыт журнал распределения')"><i class="ti ti-history"></i> Журнал</button>
    <div class="grow"></div>
    <span style="font-size:11.5px;color:#666">${new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})} · 09:42</span>
  </div>

  <div class="stat-row">
    <div class="stat-box"><div class="k">Активных</div><div class="v">${ST.patients.filter(p=>p.status==='В работе'||p.status==='Новый').length}</div></div>
    <div class="stat-box red"><div class="k">Без куратора</div><div class="v">${unassigned.length}</div></div>
    <div class="stat-box amber"><div class="k">Финальных</div><div class="v">${finals}</div></div>
    <div class="stat-box green"><div class="k">Кураторов</div><div class="v">${CURATORS.length}</div></div>
  </div>

  <div class="planlayout">
    <div class="panel-c">
      <div class="panel-h">
        <i class="ti ti-users"></i>
        <span>Нераспределённые пациенты</span>
        <span class="pill p-red" style="margin-left:auto">${unassigned.length}</span>
      </div>
      <div style="padding:5px 10px;font-size:11px;color:#888;border-bottom:1px solid var(--border-light);background:#fff">← Перетащите пациента к нужному куратору, либо нажмите «Авто-распределить»</div>
      <div class="panel-b" id="poolZone"
           ondragover="mpOver(event,'poolZone')" ondragleave="mpLeave(event,'poolZone')" ondrop="mpDrop(event,null)">
        ${unassigned.length? unassigned.map(p=>chipHTML(p,false)).join('') : '<div style="color:#999;padding:20px;text-align:center;width:100%">— Все пациенты распределены —</div>'}
      </div>
    </div>

    <div class="lanes">
      ${byCur.map(({c,list})=>`
        <div class="lane">
          <div class="lane-h">
            <div class="av" style="background:${c.dot}">${c.short}</div>
            <span>${c.full}</span>
            <span class="pill p-gray" style="margin-left:6px">${list.length} пациентов</span>
            ${typeof curatorLoadHtml==='function'?curatorLoadHtml(c.id):''}
          </div>
          <div class="lane-b" id="lane-${c.id}"
               ondragover="mpOver(event,'lane-${c.id}')" ondragleave="mpLeave(event,'lane-${c.id}')" ondrop="mpDrop(event,${c.id})">
            ${list.length? list.map(p=>chipHTML(p,true)).join('') : '<div style="color:#bbb;font-size:11px;padding:6px">— перетащите сюда —</div>'}
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}
function chipHTML(p, mini){
  const av = `<div class="av" style="background:${p.curatorId!=null?curatorOf(p.curatorId).dot:'#888'}">${p.initials}</div>`;
  return `<div class="chip${mini?' mini':''}" draggable="true" ondragstart="mpDragStart(event,'${p.id}')" ondragend="mpDragEnd(event)" ondblclick="openDealCard('${p.id}')" title="${p.name} · ${p.source} · ${p.type}">${av}<span>${p.name.split(' ').slice(0,2).join(' ')}</span><span class="m">${mini?p.type[0]:p.source}</span></div>`;
}
function mpDragStart(e,pid){ ST.drag=pid; try{e.dataTransfer.setData('text/plain',pid);}catch(_){} e.currentTarget.classList.add('dragging');}
function mpDragEnd(e){ e.currentTarget.classList.remove('dragging'); document.querySelectorAll('.panel-b,.lane-b').forEach(c=>c.classList.remove('dz-on'));}
function mpOver(e,id){ e.preventDefault(); document.getElementById(id).classList.add('dz-on');}
function mpLeave(e,id){ document.getElementById(id).classList.remove('dz-on');}
function mpDrop(e,curId){
  e.preventDefault();
  const pid = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || ST.drag;
  document.querySelectorAll('.panel-b,.lane-b').forEach(c=>c.classList.remove('dz-on'));
  if (!pid) return;
  const p = patientOf(pid); if (!p) return;
  const oldName = p.curatorId!=null ? curatorOf(p.curatorId).name : 'без куратора';
  p.curatorId = curId;
  const newName = curId!=null ? curatorOf(curId).name : 'без куратора';
  ST.drag = null;
  renderAll();
  toast(`${p.name}: ${oldName} → ${newName}`,'ok');
}
function autoAssign(){
  const un = ST.patients.filter(p=>p.curatorId==null);
  if (!un.length){ toast('Нераспределённых нет','ok'); return; }
  un.forEach((p,i)=> p.curatorId = i % CURATORS.length);
  renderAll();
  toast(`Авто-распределено: ${un.length} пациентов (round-robin)`,'ok');
}
function resetAssign(){
  ST.patients.forEach(p=>{ if (p.stage==='lead'||p.stage==='booked') p.curatorId=null; });
  renderAll();
  toast('Распределение сброшено для стадий «Лид» и «Записан»');
}

// ---------- SCREEN: Tasks ----------
function renderTasks(){
  let tasks = ST.tasks.slice();
  if (ST.curatorOnlyForRole!=null) tasks = tasks.filter(t=>t.curatorId===ST.curatorOnlyForRole);
  if (ST.taskFilter.show==='open')      tasks = tasks.filter(t=>!t.done);
  else if (ST.taskFilter.show==='over') tasks = tasks.filter(t=>t.urgency==='overdue'&&!t.done);
  else if (ST.taskFilter.show==='done') tasks = tasks.filter(t=>t.done);
  if (ST.taskFilter.curator!=='all') tasks = tasks.filter(t=>t.curatorId===parseInt(ST.taskFilter.curator));
  // tag filter
  const activeTaskTags = [];
  Object.values(ST.taskAtags).forEach(v=>activeTaskTags.push(...v));
  if (activeTaskTags.length){
    tasks = tasks.filter(t=>activeTaskTags.every(tg=>t.tags.includes(tg)||t.type.toLowerCase().includes(tg.toLowerCase())));
  }
  const total = tasks.length;
  const over = tasks.filter(t=>t.urgency==='overdue'&&!t.done).length;
  const done = tasks.filter(t=>t.done).length;

  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="toast('Открыто окно создания задачи','ok')"><i class="ti ti-plus"></i> Создать задачу</button>
    <button class="tb" onclick="markSelectedTasksDone()"><i class="ti ti-check"></i> Выполнить</button>
    <button class="tb"><i class="ti ti-arrow-forward"></i> Перенести</button>
    <button class="tb" onclick="toast('Задача эскалирована РОП','err')"><i class="ti ti-alert-triangle"></i> Эскалировать РОП</button>
    <div class="tb-sep"></div>
    <span class="lbl" style="font-size:12px;color:#555">Показать:</span>
    <select class="role-sel" onchange="ST.taskFilter.show=this.value;renderAll()" style="height:22px;border:1px solid var(--border)">
      <option value="all">Все</option>
      <option value="open" ${ST.taskFilter.show==='open'?'selected':''}>Открытые</option>
      <option value="over" ${ST.taskFilter.show==='over'?'selected':''}>Просроченные</option>
      <option value="done" ${ST.taskFilter.show==='done'?'selected':''}>Выполненные</option>
    </select>
    <span class="lbl" style="font-size:12px;color:#555;margin-left:8px">Куратор:</span>
    <select class="role-sel" onchange="ST.taskFilter.curator=this.value;renderAll()" style="height:22px;border:1px solid var(--border)">
      <option value="all">Все</option>
      ${CURATORS.map(c=>`<option value="${c.id}" ${ST.taskFilter.curator==String(c.id)?'selected':''}>${c.name}</option>`).join('')}
    </select>
    <div class="grow"></div>
  </div>

  <div class="tagpanel">
    <div class="taggrp"><span class="gh">Теги</span>
      ${TASK_TAGS.map(t=>{
        const on = (ST.taskAtags.all||[]).includes(t);
        return `<span class="tag${on?' on':''}" onclick="toggleTag('taskAtags','all','${t}')">${t}</span>`;
      }).join('')}
    </div>
    <button class="tag-reset" onclick="resetTags('taskAtags')"><i class="ti ti-x"></i> Сбросить</button>
  </div>

  <div class="tablewrap">
    <table class="t">
      <colgroup>
        <col style="width:22px"><col style="width:14px"><col style="width:220px"><col style="width:160px"><col style="width:130px">
        <col style="width:120px"><col style="width:130px"><col style="width:160px"><col style="width:110px"><col style="width:90px"><col style="width:100px">
      </colgroup>
      <thead><tr>
        <th><input type="checkbox"></th><th></th><th>Задача</th><th>Пациент</th><th>Куратор</th>
        <th>Тип задачи</th><th>Привязка</th><th>Теги</th><th>Срок</th><th>Приоритет</th><th>Статус</th>
      </tr></thead>
      <tbody>
        ${tasks.map(t=>{
          const c = curatorOf(t.curatorId);
          const overdue = t.urgency==='overdue' && !t.done;
          const ord = t.orderId ? orderOf(t.orderId)?.order : null;
          const linkCell = ord
            ? `<i class="ti ti-receipt" style="color:#1565C0;font-size:11px"></i> <a class="lk" onclick="event.stopPropagation();openOrderCard('${ord.id}')">${ord.num}</a>`
            : `<i class="ti ti-user" style="color:#888;font-size:11px"></i> <span style="color:#666;font-size:11px">к пациенту</span>`;
          return `<tr class="${overdue?'overdue':''} ${t.done?'done':''}" ondblclick="openTaskCard('${t.id}')">
            <td><input type="checkbox" ${t.done?'checked':''} onclick="event.stopPropagation();toggleTaskDone('${t.id}',this.checked)"></td>
            <td><span class="urg ${t.urgency}"></span></td>
            <td>${t.done?`<a class="lk" onclick="openTaskCard('${t.id}')" style="opacity:.7">${t.title}</a>`:`<a class="lk" onclick="openTaskCard('${t.id}')">${t.title}</a>`}</td>
            <td><a class="lk" onclick="openDealCard('${t.pid}')">${t.patient}</a></td>
            <td><span class="dot" style="background:${c.dot}"></span>${c.name}</td>
            <td>${pillFor('task',t.type)}</td>
            <td>${linkCell}</td>
            <td>${t.tags.map(x=>`<span class="pill p-gray">${x}</span>`).join(' ')}</td>
            <td ${overdue?'style="color:var(--red);font-weight:700"':''}>${t.meta}</td>
            <td>${t.urgency==='overdue'?'<b style="color:var(--red)">ПРОСРОЧЕНО</b>':t.urgency==='high'?'Высокий':t.urgency==='med'?'Средний':'Низкий'}</td>
            <td>${pillFor('status', t.status)}</td>
          </tr>`;
        }).join('')||'<tr><td colspan="11" style="text-align:center;color:#999;padding:30px">Нет задач по выбранным фильтрам</td></tr>'}
      </tbody>
    </table>
  </div>

  <div style="border-top:1px solid var(--border-light);padding:5px 12px;background:#FAFAFA;font-size:11.5px;color:#555;display:flex;gap:18px;flex-shrink:0">
    <span>Записей: <b>${total}</b></span>
    <span style="color:var(--red)">Просрочено: <b>${over}</b></span>
    <span style="color:var(--green)">Выполнено: <b>${done}</b></span>
  </div>`;
}
function toggleTaskDone(id, on){
  const t = ST.tasks.find(x=>x.id===id);
  if (!t) return;
  if (on && !t.done){
    // FR-006: requires comment (open modal); checkbox stays unchecked until confirmed
    if (typeof showCloseModal==='function'){ showCloseModal(id); }
    else { t.done = true; t.status='Выполнена'; renderAll(); }
    return;
  }
  t.done = on;
  t.status = on ? 'Выполнена' : (t.urgency==='overdue'?'Просрочена':'Открыта');
  renderAll();
  toast(`Задача «${t.title.slice(0,30)}…»: ${on?'выполнена':'возвращена'}`, on?'ok':'info');
}
function markSelectedTasksDone(){
  toast('Выберите задачи флажком слева','info');
}

// ---------- SCREEN: Report ----------
function renderReport(){
  const colHeaders = [
    'Ответственный / Номенклатура / Сделка',
    'Кол-во новых сделок',
    'Сумма новых сделок',
    'Цена новых сделок',
    'Кол-во оплаченных у всех сделок',
    'Выручка по всем сделкам',
    'Выручка ИД по новым',
    'Выручка по новым',
    'Конверсия по новым',
    'Выручка по новым (за всё время)',
    'Конверсия по новым (за всё время)',
  ];

  // compute totals per responsible & overall
  const sumGroup = (gs) => {
    const t = {k:0,sum:0,price:0,paidAll:0,revAll:0,revIdNew:0,revNew:0,revAllTime:0};
    gs.forEach(g=>g.deals.forEach(d=>{t.k+=d.k;t.sum+=d.sum;t.price+=d.price;t.paidAll+=d.paidAll;t.revAll+=d.revAll;t.revIdNew+=d.revIdNew;t.revNew+=d.revNew;t.revAllTime+=d.revAllTime}));
    return t;
  };
  const sumDeals = (deals) => {
    const t = {k:0,sum:0,price:0,paidAll:0,revAll:0,revIdNew:0,revNew:0,revAllTime:0};
    deals.forEach(d=>{t.k+=d.k;t.sum+=d.sum;t.price+=d.price;t.paidAll+=d.paidAll;t.revAll+=d.revAll;t.revIdNew+=d.revIdNew;t.revNew+=d.revNew;t.revAllTime+=d.revAllTime});
    return t;
  };
  const wAvg = (deals, key) => {
    let total=0, wsum=0;
    deals.forEach(d=>{ total+=d.k; wsum+=d.k*d[key]; });
    return total?wsum/total:0;
  };

  let rows = '';
  let grand = {k:0,sum:0,price:0,paidAll:0,revAll:0,revIdNew:0,revNew:0,revAllTime:0};
  let allDeals = [];
  REPORT.forEach(r=>r.groups.forEach(g=>allDeals.push(...g.deals)));

  REPORT.forEach((r,ri)=>{
    const rt = sumGroup(r.groups);
    Object.keys(grand).forEach(k=>grand[k]+=rt[k]);
    const rDealsAll = []; r.groups.forEach(g=>rDealsAll.push(...g.deals));
    const rConv = wAvg(rDealsAll,'conv'), rConvAT = wAvg(rDealsAll,'convAllTime');
    rows += `<tr class="r1"><td><span class="chev" onclick="this.parentElement.parentElement.parentElement.querySelectorAll('.gr${ri}').forEach(e=>e.style.display=e.style.display==='none'?'':'none')">▼</span>${r.resp}</td>
      <td>${fmtInt(rt.k)}</td><td>${fmt(rt.sum)}</td><td>${fmt(rt.price)}</td>
      <td>${fmtInt(rt.paidAll)}</td><td>${fmt(rt.revAll)}</td><td>${fmt(rt.revIdNew)}</td><td>${fmt(rt.revNew)}</td>
      <td>${fmtPct(rConv)}</td><td>${fmt(rt.revAllTime)}</td><td>${fmtPct(rConvAT)}</td></tr>`;
    r.groups.forEach((g,gi)=>{
      const gt = sumDeals(g.deals);
      const gConv = wAvg(g.deals,'conv'), gConvAT = wAvg(g.deals,'convAllTime');
      rows += `<tr class="r2 gr${ri}"><td><span class="chev">▸</span>${g.name}</td>
        <td>${fmtInt(gt.k)}</td><td>${fmt(gt.sum)}</td><td>${fmt(gt.price)}</td>
        <td>${fmtInt(gt.paidAll)}</td><td>${fmt(gt.revAll)}</td><td>${fmt(gt.revIdNew)}</td><td>${fmt(gt.revNew)}</td>
        <td>${fmtPct(gConv)}</td><td>${fmt(gt.revAllTime)}</td><td>${fmtPct(gConvAT)}</td></tr>`;
      g.deals.forEach(d=>{
        rows += `<tr class="r3 gr${ri}"><td><a class="lk">${d.name}</a></td>
          <td>${fmtInt(d.k)}</td><td>${fmt(d.sum)}</td><td>${fmt(d.price)}</td>
          <td>${fmtInt(d.paidAll)}</td><td>${fmt(d.revAll)}</td><td>${fmt(d.revIdNew)}</td><td>${fmt(d.revNew)}</td>
          <td>${fmtPct(d.conv)}</td><td>${fmt(d.revAllTime)}</td><td>${fmtPct(d.convAllTime)}</td></tr>`;
      });
    });
  });
  const grandConv = wAvg(allDeals,'conv'), grandConvAT = wAvg(allDeals,'convAllTime');
  rows += `<tr class="r1" style="background:#E0DCC4"><td><b>ИТОГО</b></td>
    <td><b>${fmtInt(grand.k)}</b></td><td><b>${fmt(grand.sum)}</b></td><td><b>${fmt(grand.price)}</b></td>
    <td><b>${fmtInt(grand.paidAll)}</b></td><td><b>${fmt(grand.revAll)}</b></td><td><b>${fmt(grand.revIdNew)}</b></td><td><b>${fmt(grand.revNew)}</b></td>
    <td><b>${fmtPct(grandConv)}</b></td><td><b>${fmt(grand.revAllTime)}</b></td><td><b>${fmtPct(grandConvAT)}</b></td></tr>`;

  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="toast('Отчёт сформирован: '+${grand.k}+' сделок','ok')"><i class="ti ti-player-play"></i> Сформировать</button>
    <button class="tb"><i class="ti ti-settings"></i> Настройки…</button>
    <div class="tb-sep"></div>
    <span class="lbl" style="font-size:12px;color:#555">Период:</span>
    <div class="pick"><input value="01.04.2026" style="width:80px"><div class="b">📅</div></div>
    <span class="lbl">—</span>
    <div class="pick"><input value="30.04.2026" style="width:80px"><div class="b">📅</div></div>
    <span class="lbl" style="font-size:12px;color:#555;margin-left:6px">Отдел:</span>
    <div class="pick"><input value="Институт Движения — все" style="width:170px"><div class="b">▼</div></div>
    <button class="tb">Разворачивать до <span style="color:#888">▼</span></button>
    <div class="tb-sep"></div>
    <button class="tb"><i class="ti ti-printer"></i></button>
    <button class="tb"><i class="ti ti-zoom-in"></i></button>
    <button class="tb"><i class="ti ti-file-spreadsheet"></i> Excel</button>
    <button class="tb"><i class="ti ti-mail"></i></button>
    <div class="grow"></div>
    <div class="pick"><input placeholder="Введите слово для фильтра (название товара, покупателя и пр.)" style="width:340px"></div>
    <button class="tb">Ещё ▼</button>
  </div>

  <div style="padding:6px 12px;border-bottom:1px solid var(--border-light);background:#FAFAFA;font-size:12px;color:#444">
    <b>Отчёт:</b> Сделки: по ответственным (Номенклатуре) &nbsp;·&nbsp;
    <b>Период:</b> 01.04.2026 — 30.04.2026 &nbsp;·&nbsp;
    <b>Сформирован:</b> 14.05.2026 09:42 &nbsp;·&nbsp;
    <span style="color:var(--green)">● база актуальна</span>
  </div>

  <div class="tablewrap">
    <table class="rep">
      <colgroup>
        <col style="width:340px"><col style="width:90px"><col style="width:110px"><col style="width:110px"><col style="width:110px">
        <col style="width:110px"><col style="width:110px"><col style="width:110px"><col style="width:90px"><col style="width:130px"><col style="width:100px">
      </colgroup>
      <thead><tr>${colHeaders.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

// ---------- SCREEN: Deal Card ----------
const VED_SUB = {
  'Контрольный визит': ['3 месяца','6 месяцев','12 месяцев'],
  'Поддерживающее лечение': ['Массаж','ЛФК','Физиотерапия'],
  'Контроль диагностики': ['МРТ','Анализы крови'],
  'Комбинированное': ['Визит + процедура','Диагностика + консультация'],
};
let CARD_STATE = { vedType:'', vedSub:'', nextDate:'', format:'', comment:'', responsible:'' };
function renderCard(){
  const p = patientOf(ST.selectedDealId);
  if (!p) return '<div style="padding:24px;color:#888">Пациент не выбран. Откройте пациента двойным кликом из списка.</div>';
  // pre-fill card state from patient
  if (!CARD_STATE._loaded || CARD_STATE._pid!==p.id){
    CARD_STATE = {_loaded:true,_pid:p.id, vedType:p.vedenie||'', vedSub:'', nextDate:p.nextContact||'', format:p.format||'', comment:'', responsible: p.curatorId!=null?String(p.curatorId):''};
  }
  const subs = VED_SUB[CARD_STATE.vedType] || [];
  const filledCount = ['vedType','vedSub','nextDate','format','comment','responsible'].filter(k=>CARD_STATE[k]&&CARD_STATE[k].toString().trim()).length;
  const canClose = filledCount===6;
  const autoDate = canClose ? minusDays(CARD_STATE.nextDate,7) : '';
  recomputePatient(p);
  // tasks for this patient
  const patTasks = ST.tasks.filter(t=>t.pid===p.id);

  return `
  <div class="cmdbar">
    <button class="tb blue" onclick="recordAndClose()" ${canClose?'':'disabled style=\"opacity:.5;cursor:not-allowed\"'}><i class="ti ti-check"></i> Записать и закрыть</button>
    <button class="tb primary" onclick="recordCard()"><i class="ti ti-device-floppy"></i> Записать</button>
    <button class="tb" onclick="toast('Пациент переведён в статус «Отказ»','err')"><i class="ti ti-x"></i> Оформить отказ</button>
    <div class="tb-sep"></div>
    <button class="tb" onclick="createOrderFor('${p.id}')"><i class="ti ti-receipt-2"></i> + Заказ</button>
    <button class="tb" onclick="createTaskFor('${p.id}',null)"><i class="ti ti-checkbox"></i> + Задача</button>
    <button class="tb" onclick="toast('Исходящий звонок инициирован: '+'${p.name}','ok')"><i class="ti ti-phone-call"></i> Позвонить</button>
    <button class="tb" onclick="toast('Синхронизация с МИС…','ok')"><i class="ti ti-refresh"></i> Синхронизировать</button>
    <div class="grow"></div>
    <button class="tb"><i class="ti ti-printer"></i></button>
    <button class="tb"><i class="ti ti-dots"></i> Ещё</button>
  </div>

  <div class="form-pad">
    <div class="card-strip">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;border-radius:50%;background:${p.curatorId!=null?curatorOf(p.curatorId).dot:'#888'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">${p.initials}</div>
        <div>
          <div><span class="lbl">Карта пациента №</span> <span class="num">${p.num}</span></div>
          <div style="font-weight:700;font-size:14px;color:#222">${p.name}</div>
        </div>
      </div>
      <div class="inp dt" style="width:140px"><input value="${p.date} 10:14" readonly><div class="b">📅</div></div>
      <div class="right">
        <span class="lbl">Стадия:</span> <span class="pill p-blue">${stageOf(p.stage).name}</span>
        <span class="lbl">Статус:</span> ${pillFor('status',p.status)}
        <span class="lbl">Тип:</span> ${pillFor('type',p.type)}
      </div>
    </div>

    <div class="group">
      <div class="group-h"><span class="ch">▼</span>Показатели по заказам</div>
      <div style="padding:10px 14px;display:grid;grid-template-columns:repeat(5,1fr);gap:8px">
        <div class="metric"><div class="k">Активных заказов</div><div class="v" style="color:var(--blue)">${p.activeOrders}</div><div class="s">из ${p.ordersCount} всего</div></div>
        <div class="metric"><div class="k">Сумма по заказам</div><div class="v">${fmt(p.sumOrders)} ₽</div></div>
        <div class="metric"><div class="k">Оплачено</div><div class="v" style="color:var(--green)">${fmt(p.sumPaid)} ₽</div></div>
        <div class="metric"><div class="k">К оплате</div><div class="v" style="color:var(--amber-border)">${fmt(p.sumDue)} ₽</div></div>
        <div class="metric"><div class="k">Отменено</div><div class="v" style="color:var(--red)">${fmt(p.sumCancelled)} ₽</div></div>
      </div>
    </div>

    <div class="group">
      <div class="group-h"><span class="ch">▼</span>Заказы пациента · ${p.orders.length}
        <span style="margin-left:auto;font-weight:400;font-size:11px;color:#666">двойной клик — открыть карточку заказа</span>
        <button class="tb primary" style="margin-left:10px;height:20px;font-size:11px" onclick="createOrderFor('${p.id}')"><i class="ti ti-plus"></i> Заказ</button>
      </div>
      ${p.orders.length ? `<table class="t">
        <colgroup><col style="width:140px"><col style="width:90px"><col style="width:200px"><col style="width:70px"><col style="width:120px"><col style="width:100px"><col style="width:100px"><col style="width:120px"><col style="width:80px"></colgroup>
        <thead><tr><th>№ заказа</th><th>Дата</th><th>Номенклатурн. группа</th><th>Поз.</th><th>Сумма</th><th>Оплачено</th><th>К оплате</th><th>Статус</th><th>Задач</th></tr></thead>
        <tbody>
          ${p.orders.map(o=>{
            const oTasks = ST.tasks.filter(t=>t.orderId===o.id).length;
            const due = o.sum-o.paid;
            return `<tr ondblclick="openOrderCard('${o.id}')" style="cursor:pointer">
              <td><a class="lk" onclick="openOrderCard('${o.id}')">${o.num}</a></td>
              <td>${o.date}</td>
              <td title="${o.category}">${o.category}</td>
              <td style="text-align:center">${o.services.length}</td>
              <td style="text-align:right;font-weight:600">${fmt(o.sum)}</td>
              <td style="text-align:right;color:var(--green)">${o.paid?fmt(o.paid):''}</td>
              <td style="text-align:right;${due>0?'color:var(--amber-border);font-weight:600':'color:#999'}">${due>0?fmt(due):'—'}</td>
              <td>${pillForOrder(o.status)}</td>
              <td style="text-align:center">${oTasks?`<span class="pill p-blue">${oTasks}</span>`:'<span style="color:#bbb">—</span>'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>` : `<div style="padding:20px;text-align:center;color:#999;font-size:12px">— у пациента нет заказов. Нажмите «+ Заказ» для создания —</div>`}
    </div>

    <div class="group">
      <div class="group-h"><span class="ch">▼</span>Атрибуты пациента <span style="margin-left:auto;font-weight:400;font-size:11px;color:#666">сегмент · цикл · флаги</span></div>
      <div class="group-b">
        <div class="l">Ответственный куратор:</div>
        <div class="inp"><select onchange="tryChangeCurator('${p.id}',this.value)"><option value="">— не назначен —</option>${CURATORS.map(c=>`<option value="${c.id}" ${p.curatorId===c.id?'selected':''}>${c.full}</option>`).join('')}</select><div class="b">↗</div></div>
        <div class="l">Дата оплаты (план.):</div>
        <div class="inp dt"><input value="${p.payDate||''}"><div class="b">📅</div></div>

        <div class="l">ABC-сегмент:</div>
        <div class="inp"><select onchange="p_setAbc('${p.id}',this.value)">
          ${ABC_SEGMENTS.map(s=>`<option value="${s.id}" ${p.abc===s.id?'selected':''}>${s.name} — ${s.desc}</option>`).join('')}
        </select></div>
        <div class="l">Цикл лечения:</div>
        <div style="display:flex;gap:6px;align-items:center">
          <div class="inp" style="width:60px"><input type="number" value="${p.cycleNum}" min="1" max="20" style="text-align:center"></div>
          <div class="inp" style="flex:1"><select>${CYCLE_TYPES.map(c=>`<option ${p.cycleType===c?'selected':''}>${c}</option>`).join('')}</select></div>
        </div>

        <div class="l">Приоритет:</div>
        <div class="inp"><select><option ${p.priority==='А'?'selected':''}>А — Высокий</option><option ${p.priority==='В'?'selected':''}>В — Средний</option><option ${p.priority==='С'?'selected':''}>С — Низкий</option></select></div>
        <div class="l">Психотип:</div>
        <div class="inp"><select><option ${p.psycho==='экономный'?'selected':''}>экономный</option><option ${p.psycho==='тревожный'?'selected':''}>тревожный</option><option ${p.psycho==='решительный'?'selected':''}>решительный</option><option ${p.psycho==='исследователь'?'selected':''}>исследователь</option></select></div>

        <div class="l">География:</div>
        <div class="inp"><select><option ${p.geo==='местный'?'selected':''}>местный</option><option ${p.geo==='иногородний'?'selected':''}>иногородний</option></select></div>
        <div class="l">Источник:</div>
        <div class="inp"><select><option ${p.source==='сайт'?'selected':''}>сайт</option><option ${p.source==='звонок'?'selected':''}>звонок</option><option ${p.source==='WhatsApp'?'selected':''}>WhatsApp</option><option ${p.source==='рекомендация'?'selected':''}>рекомендация</option><option ${p.source==='реклама'?'selected':''}>реклама</option></select></div>

        <div class="l">Флаги:</div>
        <div style="grid-column:span 3;display:flex;gap:18px;align-items:center;font-size:12.5px;flex-wrap:wrap">
          <label><input type="checkbox" ${p.dms?'checked':''} onchange="p_toggle('${p.id}','dms',this.checked)"> ДМС — финансовые поля видны только куратору/РОП</label>
          <label><input type="checkbox" ${p.doNotContact?'checked':''} onchange="p_toggle('${p.id}','doNotContact',this.checked)"> «Не связываться» — скрывает пациента у помощников</label>
          ${typeof pillForAge==='function'?`<span style="color:#666">Возраст: ${pillForAge(p.ageCat)} · Финансирование: ${pillForFinance(p.finance)}</span>`:''}
        </div>
        ${p.curatorHistory && p.curatorHistory.filter(c=>c!=null).length>0 ? `<div class="l">История кураторов:</div>
        <div style="grid-column:span 3;font-size:11.5px;color:#666;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          ${p.curatorHistory.filter(c=>c!=null).map(c=>{const cu=curatorOf(c);return `<span class="pill p-gray"><span class="dot" style="background:${cu.dot}"></span>${cu.name}</span>`;}).join('')}
          <span style="font-size:10.5px;color:#999">· FR-001 P2.8: лимит 2 куратора на пациента · ${p.curatorHistory.filter(c=>c!=null).length}/2 использовано</span>
        </div>` : ''}
      </div>
    </div>
    ${typeof delta1_renderAbonementControls==='function'?delta1_renderAbonementControls(p):''}

    <div class="vedenie-wrap">
      <div style="font-weight:700;font-size:13px;color:#5a4500;margin-bottom:6px;display:flex;align-items:center;gap:6px">
        <i class="ti ti-clipboard-check"></i> Блок «Ведение» <span style="font-weight:400;font-size:11px;color:#7a6300">— заполняется куратором перед закрытием финальной стадии</span>
      </div>
      <div class="group-b">
        <div class="l req">Тип ведения:</div>
        <div class="inp"><select onchange="CARD_STATE.vedType=this.value;CARD_STATE.vedSub='';renderAll()">
          <option value="">— выберите —</option>
          ${Object.keys(VED_SUB).map(v=>`<option ${CARD_STATE.vedType===v?'selected':''}>${v}</option>`).join('')}
        </select></div>
        <div class="l req">Подтип ведения:</div>
        <div class="inp"><select onchange="CARD_STATE.vedSub=this.value;renderAll()" ${subs.length?'':'disabled'}>
          <option value="">— выберите —</option>
          ${subs.map(s=>`<option ${CARD_STATE.vedSub===s?'selected':''}>${s}</option>`).join('')}
        </select></div>

        <div class="l req">Дата следующего контакта:</div>
        <div class="inp dt"><input value="${CARD_STATE.nextDate}" placeholder="дд.мм.гг" onchange="CARD_STATE.nextDate=this.value;renderAll()"><div class="b">📅</div></div>
        <div class="l req">Формат контакта:</div>
        <div class="inp"><select onchange="CARD_STATE.format=this.value;renderAll()">
          <option value="">— выберите —</option>
          <option ${CARD_STATE.format==='визит'?'selected':''}>визит</option>
          <option ${CARD_STATE.format==='процедура'?'selected':''}>процедура</option>
          <option ${CARD_STATE.format==='диагностика'?'selected':''}>диагностика</option>
        </select></div>

        <div class="l req">Комментарий куратору:</div>
        <div class="inp" style="grid-column:span 3"><input maxlength="280" placeholder="например: согласовать дату, напомнить про оплату" value="${CARD_STATE.comment}" onchange="CARD_STATE.comment=this.value;renderAll()"></div>

        <div class="l req">Ответственный куратор:</div>
        <div class="inp" style="grid-column:span 3"><select onchange="CARD_STATE.responsible=this.value;renderAll()">
          <option value="">— выберите —</option>
          ${CURATORS.map(c=>`<option value="${c.id}" ${CARD_STATE.responsible===String(c.id)?'selected':''}>${c.full}</option>`).join('')}
        </select></div>
      </div>
      <div style="font-size:11px;color:#7a6300;padding:3px 0 0;display:flex;align-items:center;gap:6px"><i class="ti ti-info-circle"></i> 6 обязательных полей по ТЗ v0.1.0 · блокирующая валидация FR-008</div>
      ${!canClose ? `<div class="err" style="margin-top:4px">⚠ Заполнено ${filledCount} из 6 обязательных полей. Кнопка «Записать и закрыть» станет активной после заполнения всех полей.</div>` : ''}
      ${canClose ? `<div class="info-ok"><i class="ti ti-circle-check"></i> Авто-задача куратору будет создана: <b>${autoDate}</b> (за 7 дней до контакта) · тип «${CARD_STATE.format[0].toUpperCase()+CARD_STATE.format.slice(1)}» · получатель — ${p.curatorId!=null?curatorOf(p.curatorId).name:'(назначить куратора)'}</div>` : ''}
    </div>

    <div class="ctabs">
      ${[['orders','Задачи по пациенту'],['extra','Дополнительно'],['strat','Стратегия 0-3-7']].map(([k,l])=>`
        <div class="ctab${ST.cardTab===k?' active':''}" onclick="ST.cardTab='${k}';renderAll()">${l}</div>
      `).join('')}
    </div>

    <div class="cpane ${ST.cardTab==='orders'?'show':''}">
      ${patTasks.length ? `<table class="t">
        <colgroup><col style="width:14px"><col style="width:280px"><col style="width:140px"><col style="width:130px"><col style="width:130px"><col style="width:120px"><col style="width:100px"></colgroup>
        <thead><tr><th></th><th>Задача</th><th>Привязана к заказу</th><th>Куратор</th><th>Тип</th><th>Срок</th><th>Статус</th></tr></thead>
        <tbody>
          ${patTasks.map(t=>{
            const ord = t.orderId ? p.orders.find(o=>o.id===t.orderId) : null;
            const cu = curatorOf(t.curatorId);
            return `<tr ondblclick="openTaskCard('${t.id}')" style="cursor:pointer" class="${t.urgency==='overdue'&&!t.done?'overdue':''} ${t.done?'done':''}">
              <td><span class="urg ${t.urgency}"></span></td>
              <td><a class="lk" onclick="openTaskCard('${t.id}')">${t.title}</a></td>
              <td>${ord?`<a class="lk" onclick="openOrderCard('${ord.id}')">${ord.num}</a> <span style="color:#888;font-size:10.5px">(${ord.category})</span>`:'<span style="color:#999;font-size:11px">— к пациенту —</span>'}</td>
              <td><span class="dot" style="background:${cu.dot}"></span>${cu.name}</td>
              <td>${pillFor('task',t.type)}</td>
              <td>${t.meta}</td>
              <td>${pillFor('status',t.status)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>` : `<div style="padding:14px;color:#999;font-size:12px">— у пациента нет задач —</div>`}
    </div>

    <div class="cpane ${ST.cardTab==='extra'?'show':''}">
      <div class="group-b" style="grid-template-columns:200px 1fr 200px 1fr;padding:10px 0">
        <div class="l">Программа лояльности:</div><div class="inp"><input value="«Серебро» (5% скидка)"><div class="b">↗</div></div>
        <div class="l">Договор:</div><div class="inp"><input value="ДГ-2026-04421"><div class="b">↗</div></div>
        <div class="l">Полис ОМС/ДМС:</div><div class="inp"><input value="—"></div>
        <div class="l">ИНН:</div><div class="inp"><input value="775342198633"></div>
        <div class="l">Каналы коммуникации:</div><div class="inp" style="grid-column:span 3"><input value="email, WhatsApp, SMS — разрешены"></div>
        <div class="l">Комментарий:</div><div class="inp" style="grid-column:span 3"><input value="${p.comment.replace(/"/g,'&quot;')}"></div>
      </div>
    </div>

    <div class="cpane ${ST.cardTab==='strat'?'show':''}">
      <div style="font-size:11.5px;color:#666;margin:6px 0">Стратегия дожима «0-3-7» применяется автоматически, если пациент завершил финальную стадию, но не записался на ведение.</div>
      <div class="strat" style="grid-template-columns:repeat(5,1fr)">
        <div class="strat-card"><div class="day">День 0 · сразу</div><div class="ttl">Не записался → Звонок</div>
          <div class="desc">Приоритет <b>Высокий</b>. Шаблон <code>day0_script_v3</code>.</div></div>
        <div class="strat-card d3"><div class="day">День 3</div><div class="ttl">Нет ответа → WhatsApp</div>
          <div class="desc">Шаблон <code>day3_sms</code>. Приоритет <b>Средний</b>.</div></div>
        <div class="strat-card d7"><div class="day">День 7 · эскалация</div><div class="ttl">Звонок РОП</div>
          <div class="desc">Передача руководителю. <b>Просрочена</b>.</div></div>
        <div class="strat-card d3"><div class="day">День 14</div><div class="ttl">Повторный WhatsApp</div>
          <div class="desc">С акцией / спецпредложением. Приоритет <b>Средний</b>.</div></div>
        <div class="strat-card" style="border-left-color:#B7770D"><div class="day">День 30</div><div class="ttl">Реактивация</div>
          <div class="desc">Перевод в базу реактивации. Скидка “Возвращение”.</div></div>
      </div>
      <button class="tb primary" style="margin-top:10px" onclick="applyStrategy('${p.id}')"><i class="ti ti-sparkles"></i> Применить стратегию дожима</button>
    </div>
  </div>`;
}
function pillForOrder(s){
  // Try 9-status enum first
  const en = ORDER_STATUSES_9.find(x=>x.name===s || x.id===s);
  if (en) return `<span class="pill ${en.cls}">${en.name}</span>`;
  const v = (s||'').toLowerCase();
  let cls='p-gray';
  if (v==='активен') cls='p-blue';
  else if (v==='оплачен') cls='p-green';
  else if (v==='частично оплачен') cls='p-amber';
  else if (v==='отменён') cls='p-red';
  return `<span class="pill ${cls}">${s}</span>`;
}
function pillForAbc(id){
  const a = abcOf(id);
  return `<span class="pill ${a.cls}" title="${a.desc}">${a.name}</span>`;
}
function pillForReception(t){
  const cls = t==='Первичный'?'p-blue':t==='Повторный'?'p-teal':t==='Промежуточный'?'p-amber':t==='Финальный'?'p-purple':'p-gray';
  return `<span class="pill ${cls}">${t}</span>`;
}
function createOrderFor(pid){
  const p = patientOf(pid); if (!p) return;
  const oi = p.orders.length;
  const newOrder = {
    id:'o'+pid.slice(1)+'_'+oi,
    num:'КПМП-'+String(26500+ST.patients.indexOf(p)*7+oi+99).padStart(7,'0'),
    patientId:p.id,
    date:'14.05.26',
    category:'ПРИЁМ СПЕЦИАЛИСТОВ',
    services:[{name:'Новая услуга',qty:1,price:0,sum:0}],
    sum:0, paid:0, status:'Активен', curatorId:p.curatorId,
  };
  p.orders.push(newOrder);
  recomputePatient(p);
  toast('Создан заказ '+newOrder.num,'ok');
  openOrderCard(newOrder.id);
}
function createTaskFor(pid, orderId){
  const p = patientOf(pid); if (!p) return;
  const newT = {
    id:'t'+ST.tasks.length, curatorId:p.curatorId??0,
    title:'Новая задача по: '+p.name, patient:p.name, pid:p.id, orderId,
    meta:'14.05.26 10:00', urgency:'med', done:false, type:'Авто-задача',
    tags:[], status:'Открыта'
  };
  ST.tasks.unshift(newT);
  toast('Создана задача','ok');
  openTaskCard(newT.id);
}
function minusDays(ds, n){
  // ds: dd.mm.yy
  if (!ds) return '';
  const m = ds.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
  if (!m) return '';
  let y = parseInt(m[3]); if (y<100) y+=2000;
  const d = new Date(y, parseInt(m[2])-1, parseInt(m[1]));
  d.setDate(d.getDate()-n);
  return ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+String(d.getFullYear()).slice(-2);
}
function recordCard(){
  const p = patientOf(ST.selectedDealId); if (!p) return;
  if (CARD_STATE.vedType) p.vedenie = CARD_STATE.vedType;
  if (CARD_STATE.nextDate) p.nextContact = CARD_STATE.nextDate;
  if (CARD_STATE.format) p.format = CARD_STATE.format;
  toast('Сделка записана','ok');
  renderAll();
}
function recordAndClose(){
  recordCard();
  const p = patientOf(ST.selectedDealId);
  // create auto-task
  const auto = {
    id:'t'+(ST.tasks.length), curatorId: p.curatorId ?? 0,
    title:`Связаться по ведению: ${p.name} (формат — ${CARD_STATE.format})`,
    patient:p.name, pid:p.id, meta:minusDays(CARD_STATE.nextDate,7)+' 10:00',
    urgency:'med', done:false, type:'Авто-задача',
    tags:['Ведение', CARD_STATE.format, 'автозадача'], status:'Запланирована'
  };
  ST.tasks.unshift(auto);
  toast(`Авто-задача создана на ${auto.meta}`,'ok');
  closeTab('card');
}
function applyStrategy(pid){
  const p = patientOf(pid);
  const base = [
    {d:0,  urg:'high',    type:'Дожим день 0', title:`Звонок: ${p.name} — согласовать ведение`, tags:['день 0','звонок','первичный']},
    {d:3,  urg:'med',     type:'Дожим день 3', title:`WhatsApp ${p.name} (шаблон day3_sms)`,  tags:['день 3','WhatsApp']},
    {d:7,  urg:'overdue', type:'Дожим день 7', title:`Эскалация РОП: ${p.name} не отвечает 7 дней`, tags:['день 7','эскалация','звонок']},
    {d:14, urg:'med',     type:'Дожим день 14',title:`Повторный контакт через 2 недели: ${p.name}`, tags:['день 14','WhatsApp']},
    {d:30, urg:'low',     type:'Дожим день 30',title:`Реактивация через месяц: ${p.name}`, tags:['день 30','реактивация']},
  ];
  base.forEach((b,i)=>{
    ST.tasks.unshift({ id:'t'+(ST.tasks.length+i), curatorId:p.curatorId ?? 0, title:b.title,
      patient:p.name, pid:p.id, orderId:null, meta:`14.05.26 ${10+i*1}:00`, urgency:b.urg, done:false, type:b.type,
      tags:b.tags, status:b.urg==='overdue'?'Просрочена':'Открыта' });
  });
  renderAll();
  toast(`Создано 5 задач по стратегии 0-3-7-14-30: «${p.name}»`,'ok');
}

// ---------- SCREEN: Task Card ----------
let TASK_STATE = { _loaded:false };
function openTaskCard(id){
  ST.selectedTaskId = id;
  const t = ST.tasks.find(x=>x.id===id);
  if (!t) return;
  TASK_STATE = {_loaded:true,_tid:id,
    title:t.title, patient:t.patient, curatorId:t.curatorId, type:t.type,
    urgency:t.urgency, meta:t.meta, status:t.status, tags:t.tags.slice(),
    desc: t.desc || autoDescFor(t),
    reminder: 'За 15 минут',
    channel: t.type.includes('WhatsApp')||t.tags.includes('WhatsApp')?'WhatsApp':(t.type.includes('Напомин')?'Email':'Телефон'),
    script: scriptFor(t),
    orderId: t.orderId || null,
  };
  openTab('taskCard', `Задача № ${id.replace('t','000-')}`);
}
function autoDescFor(t){
  if (t.type.includes('день 0')) return 'Первый контакт после финальной стадии. Цель — согласовать дату ведения и получить устное подтверждение.';
  if (t.type.includes('день 3')) return 'Повторный контакт. Отправить WhatsApp-сообщение по шаблону day3_sms с подборкой ближайших слотов.';
  if (t.type.includes('эск')) return 'Эскалация РОП. Пациент не вернулся на контакт 7 дней. Согласовать дальнейшие действия с руководителем.';
  if (t.type.includes('NPS')) return 'Опрос удовлетворённости. Отправить форму NPS в WhatsApp с 1 вопросом и открытым комментарием.';
  if (t.type.includes('Реактив')) return 'Реактивация ранее выпавшего пациента. Применить акцию «Возвращение-2026» (скидка 10%).';
  if (t.type.includes('Ведение')) return 'Плановый контакт в рамках ведения пациента. Согласовать визит / процедуру / диагностику.';
  return 'Служебная задача куратора.';
}
function scriptFor(t){
  if (t.type.includes('день 0')) return 'day0_script_v3';
  if (t.type.includes('день 3')) return 'day3_sms';
  if (t.type.includes('эск')) return 'escalation_v1';
  if (t.type.includes('NPS')) return 'nps_short_v2';
  if (t.type.includes('Реактив')) return 'reactivation_2026';
  return '—';
}
function renderTaskCard(){
  const t = ST.tasks.find(x=>x.id===ST.selectedTaskId);
  if (!t) return '<div style="padding:24px;color:#888">Задача не выбрана.</div>';
  if (!TASK_STATE._loaded || TASK_STATE._tid!==t.id){ openTaskCard(t.id); return ''; }
  const c = curatorOf(t.curatorId);
  const p = patientOf(t.pid);
  const overdue = t.urgency==='overdue' && !t.done;
  const num = t.id.replace('t','000-00');
  const allTagOptions = [...new Set([...TASK_TAGS, ...TASK_STATE.tags])];
  const audit = [
    { d:'04.05.26 09:12', who:c?.name||'Система', what:'Задача создана автоматически в рамках стратегии 0-3-7' },
    { d:'05.05.26 10:48', who:c?.name||'-',       what:'Назначена куратору (РОП: Васильев С.И.)' },
    overdue ? { d:t.meta, who:'Система', what:'Срок произошёл. Статус изменён на «Просрочена»' } : null,
    t.done ? { d:'06.05.26 14:22', who:c?.name||'-', what:'Задача выполнена. Результат: пациент согласился на ведение' } : null,
  ].filter(Boolean);

  return `
  <div class="cmdbar">
    <button class="tb blue" onclick="taskCardSaveClose()"><i class="ti ti-check"></i> Записать и закрыть</button>
    <button class="tb primary" onclick="taskCardSave()"><i class="ti ti-device-floppy"></i> Записать</button>
    <div class="tb-sep"></div>
    <button class="tb" onclick="taskCardComplete()" ${t.done?'disabled style=\"opacity:.5\"':''}><i class="ti ti-circle-check"></i> Выполнить</button>
    <button class="tb" onclick="taskCardPostpone()"><i class="ti ti-arrow-forward"></i> Перенести</button>
    <button class="tb" onclick="taskCardEscalate()"><i class="ti ti-alert-triangle"></i> Эскалировать РОП</button>
    <button class="tb" onclick="taskCardReassign()"><i class="ti ti-user-share"></i> Перепривязать</button>
    <div class="tb-sep"></div>
    <button class="tb" onclick="toast('Исходящий звонок: '+'${p?.name||t.patient}','ok')"><i class="ti ti-phone-call"></i> Позвонить</button>
    <button class="tb" onclick="toast('Отправлено WhatsApp-сообщение','ok')"><i class="ti ti-brand-whatsapp"></i> WhatsApp</button>
    <div class="grow"></div>
    <button class="tb"><i class="ti ti-printer"></i></button>
    <button class="tb"><i class="ti ti-dots"></i> Ещё</button>
  </div>

  <div class="form-pad">
    <div class="card-strip">
      <div><span class="lbl">Задача №</span> <span class="num">${num}</span></div>
      <div class="inp dt" style="width:140px"><input value="${t.meta}" readonly><div class="b">📅</div></div>
      <div><span class="lbl">Пациент:</span> <a class="lk" onclick="openDealCard('${t.pid}')">${t.patient}</a> ${p?`<span class="lbl">· карта</span> <a class="lk" onclick="openDealCard('${t.pid}')">${p.num}</a>`:''}
        ${(()=>{ const ord = t.orderId? orderOf(t.orderId)?.order : null; return ord?` &nbsp;<span class="pill p-blue" style="vertical-align:middle"><i class="ti ti-receipt"></i> заказ <a class="lk" onclick="openOrderCard('${ord.id}')" style="color:var(--blue)">${ord.num}</a></span>`:''; })()}
      </div>
      <div class="right">
        ${overdue?'<span class="pill p-red">ПРОСРОЧЕНА</span>':''}
        <span class="lbl">Статус:</span> ${pillFor('status',t.status)}
        <span class="lbl">Тип:</span> ${pillFor('task',t.type)}
      </div>
    </div>

    <div class="twocols" style="grid-template-columns:1.4fr 1fr;gap:10px">
      <div>
        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Основные</div>
          <div class="group-b" style="grid-template-columns:160px 1fr">
            <div class="l req">Заголовок:</div>
            <div class="inp"><input value="${TASK_STATE.title.replace(/"/g,'&quot;')}" oninput="TASK_STATE.title=this.value"></div>

            <div class="l req">Пациент:</div>
            <div class="inp"><input value="${TASK_STATE.patient}" readonly><div class="b" title="Выбрать">▼</div><div class="b" title="Открыть" onclick="openDealCard('${t.pid}')">↗</div></div>

            <div class="l req">Ответственный:</div>
            <div class="inp"><select onchange="TASK_STATE.curatorId=parseInt(this.value)">
              ${CURATORS.map(cu=>`<option value="${cu.id}" ${cu.id===TASK_STATE.curatorId?'selected':''}>${cu.full}</option>`).join('')}
            </select><div class="b">↗</div></div>

            <div class="l req">Тип задачи:</div>
            <div class="inp"><select onchange="TASK_STATE.type=this.value;TASK_STATE.script=scriptFor({type:this.value,tags:TASK_STATE.tags});renderAll()">
              ${['Дожим день 0','Дожим день 3','Дожим день 7','Ведение','Реактивация','Эскалация','Авто-задача','Напоминание','NPS опрос'].map(x=>`<option ${TASK_STATE.type===x?'selected':''}>${x}</option>`).join('')}
            </select></div>

            <div class="l req">Приоритет:</div>
            <div style="display:flex;gap:14px;align-items:center;font-size:12.5px">
              <label><input type="radio" name="urg" ${TASK_STATE.urgency==='high'?'checked':''} onchange="TASK_STATE.urgency='high'"> <span class="urg high" style="vertical-align:middle"></span> Высокий</label>
              <label><input type="radio" name="urg" ${TASK_STATE.urgency==='med'?'checked':''} onchange="TASK_STATE.urgency='med'"> <span class="urg med" style="vertical-align:middle"></span> Средний</label>
              <label><input type="radio" name="urg" ${TASK_STATE.urgency==='low'?'checked':''} onchange="TASK_STATE.urgency='low'"> <span class="urg low" style="vertical-align:middle"></span> Низкий</label>
            </div>

            <div class="l req">Срок:</div>
            <div style="display:flex;gap:6px;align-items:center">
              <div class="inp dt" style="width:130px"><input value="${TASK_STATE.meta.split(' ')[0]||''}" onchange="TASK_STATE.meta=this.value+' '+(TASK_STATE.meta.split(' ')[1]||'10:00')"><div class="b">📅</div></div>
              <div class="inp" style="width:80px"><input value="${TASK_STATE.meta.split(' ')[1]||'10:00'}" onchange="TASK_STATE.meta=(TASK_STATE.meta.split(' ')[0]||'14.05.26')+' '+this.value"><div class="b">⏰</div></div>
              <span style="font-size:11.5px;color:#666">Напомнить:</span>
              <div class="inp" style="width:120px"><select onchange="TASK_STATE.reminder=this.value">
                ${['Не напоминать','За 15 минут','За 1 час','За 1 день'].map(x=>`<option ${TASK_STATE.reminder===x?'selected':''}>${x}</option>`).join('')}
              </select></div>
            </div>

            <div class="l">Канал:</div>
            <div class="inp" style="width:200px"><select onchange="TASK_STATE.channel=this.value">
              ${['Телефон','WhatsApp','SMS','Email','Личный визит'].map(x=>`<option ${TASK_STATE.channel===x?'selected':''}>${x}</option>`).join('')}
            </select></div>

            <div class="l">Шаблон скрипта:</div>
            <div class="inp"><input value="${TASK_STATE.script}" readonly><div class="b" title="Выбрать">▼</div><div class="b" title="Открыть" onclick="toast('Открыт шаблон: '+TASK_STATE.script,'ok')">↗</div></div>

            <div class="l">Привязка к заказу:</div>
            <div style="display:flex;gap:4px;align-items:center">
              <div class="inp" style="flex:1"><select onchange="TASK_STATE.orderId=this.value||null">
                <option value="">— к пациенту (без заказа) —</option>
                ${(p?.orders||[]).map(o=>`<option value="${o.id}" ${TASK_STATE.orderId===o.id?'selected':''}>${o.num} · ${o.category} · ${fmt(o.sum)} ₽ · ${o.status}</option>`).join('')}
              </select></div>
              ${TASK_STATE.orderId ? `<button class="tb" onclick="openOrderCard('${TASK_STATE.orderId}')" title="Открыть заказ"><i class="ti ti-external-link"></i></button>` : ''}
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Теги</div>
          <div style="padding:8px 12px;display:flex;flex-wrap:wrap;gap:4px;align-items:center">
            ${allTagOptions.map(tg=>{
              const on = TASK_STATE.tags.includes(tg);
              return `<span class="tag${on?' on':''}" onclick="toggleTaskCardTag('${tg.replace(/'/g,"\\'")}')">${tg}</span>`;
            }).join('')}
            <input placeholder="+ добавить тег" style="border:1px dashed #C5B280;background:transparent;border-radius:10px;padding:1px 8px;height:18px;font-size:11px;outline:none;margin-left:4px" onkeydown="if(event.key==='Enter'&&this.value.trim()){TASK_STATE.tags.push(this.value.trim());this.value='';renderAll()}">
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Описание / Цель задачи</div>
          <div style="padding:8px 12px">
            <textarea oninput="TASK_STATE.desc=this.value" style="width:100%;min-height:88px;border:1px solid var(--border);font:12.5px Arial;padding:6px 8px;resize:vertical;outline:none" placeholder="Подробности для куратора…">${TASK_STATE.desc||''}</textarea>
            <div style="font-size:11px;color:#888;margin-top:3px">Макс. 1000 символов · видно куратору и РОП</div>
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Результат выполнения</div>
          <div class="group-b" style="grid-template-columns:160px 1fr">
            <div class="l">Исход:</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${['Дозвонился, согласился','Дозвонился, отказ','Не взял трубку','Неверный номер','Перенести'].map(r=>`<span class="tag" onclick="toast('Исход: '+'${r}','ok')">${r}</span>`).join('')}
            </div>
            <div class="l">След. контакт:</div>
            <div class="inp dt" style="width:140px"><input placeholder="дд.мм.гг"><div class="b">📅</div></div>
            <div class="l">Комментарий:</div>
            <div class="inp"><input placeholder="Что обсудили, что дальше…"></div>
          </div>
        </div>
      </div>

      <div>
        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Карточка пациента</div>
          ${p?`<div style="padding:10px 12px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:36px;height:36px;border-radius:50%;background:${c?.dot||'#888'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">${p.initials}</div>
              <div>
                <div style="font-weight:700"><a class="lk" onclick="openDealCard('${p.id}')">${p.name}</a></div>
                <div style="font-size:11px;color:#888">${p.num} · ${p.date}</div>
              </div>
            </div>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#666;padding:2px 0;width:130px">Стадия:</td><td>${stageOf(p.stage).name}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Статус:</td><td>${pillFor('status',p.status)}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Тип:</td><td>${pillFor('type',p.type)}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Приоритет:</td><td>${pillFor('priority',p.priority)}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Психотип:</td><td>${pillFor('psycho',p.psycho)}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Гео:</td><td>${p.geo}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Источник:</td><td>${p.source}</td></tr>
              <tr><td style="color:#666;padding:2px 0">След. контакт:</td><td ${p.dozhim==='день 7'||p.dozhim==='эскалация'?'style="color:var(--red);font-weight:600"':''}>${p.nextContact||'—'}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Сумма:</td><td><b>${fmt(p.sum)} ₽</b></td></tr>
              <tr><td style="color:#666;padding:2px 0;vertical-align:top">Комментарий:</td><td style="white-space:normal;line-height:1.4">${p.comment}</td></tr>
            </table>
            <button class="tb" style="margin-top:8px;width:100%" onclick="openDealCard('${p.id}')"><i class="ti ti-external-link"></i> Открыть карточку пациента</button>
          </div>`:'<div style="padding:10px 12px;color:#999">Пациент не привязан</div>'}
        </div>

        ${(()=>{
          const ord = t.orderId ? orderOf(t.orderId)?.order : null;
          if (!ord) return `<div class="group">
            <div class="group-h"><span class="ch">▼</span>Заказ</div>
            <div style="padding:14px 12px;color:#999;font-size:12px">
              <i class="ti ti-info-circle"></i> Задача привязана к пациенту, без конкретного заказа.
              <div style="margin-top:8px"><button class="tb" onclick="document.querySelector('select[onchange*=orderId]')?.focus()"><i class="ti ti-link"></i> Привязать заказ</button></div>
            </div>
          </div>`;
          const due = ord.sum - ord.paid;
          return `<div class="group">
            <div class="group-h"><span class="ch">▼</span>Заказ <span style="margin-left:auto;font-weight:400;font-size:11px;color:#666">${ord.num}</span></div>
            <div style="padding:10px 12px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <div style="width:32px;height:32px;border-radius:4px;background:#E1ECF7;color:#1565C0;display:flex;align-items:center;justify-content:center"><i class="ti ti-receipt" style="font-size:18px"></i></div>
                <div>
                  <div style="font-weight:700"><a class="lk" onclick="openOrderCard('${ord.id}')">${ord.num}</a></div>
                  <div style="font-size:11px;color:#888">${ord.category}</div>
                </div>
                <div style="margin-left:auto">${pillForOrder(ord.status)}</div>
              </div>
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#666;padding:2px 0;width:110px">Сумма:</td><td style="font-weight:700">${fmt(ord.sum)} ₽</td></tr>
                <tr><td style="color:#666;padding:2px 0">Оплачено:</td><td style="color:var(--green)">${fmt(ord.paid)} ₽</td></tr>
                <tr><td style="color:#666;padding:2px 0">К оплате:</td><td style="${due>0?'color:var(--amber-border);font-weight:600':'color:#999'}">${fmt(Math.max(0,due))} ₽</td></tr>
                <tr><td style="color:#666;padding:2px 0">Позиций:</td><td>${ord.services.length}</td></tr>
              </table>
              <div style="margin-top:8px;padding:6px 8px;background:#FAFAFA;border:1px solid var(--border-light);border-radius:2px;font-size:11px;color:#444;max-height:88px;overflow:auto">
                ${ord.services.map(s=>`<div style="display:flex;justify-content:space-between;padding:1px 0"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px">${s.name}</span><span style="color:#777">×${s.qty}</span></div>`).join('')}
              </div>
              <button class="tb" style="margin-top:8px;width:100%" onclick="openOrderCard('${ord.id}')"><i class="ti ti-external-link"></i> Открыть карточку заказа</button>
            </div>
          </div>`;
        })()}

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>История / Аудит</div>
          <div style="padding:6px 0">
            <table style="width:100%;font-size:11.5px;border-collapse:collapse">
              ${audit.map(a=>`<tr><td style="padding:4px 10px;color:#888;white-space:nowrap;border-top:1px solid #eee;width:110px">${a.d}</td><td style="padding:4px 4px;color:#555;white-space:nowrap;border-top:1px solid #eee">${a.who}</td><td style="padding:4px 10px;border-top:1px solid #eee;line-height:1.35">${a.what}</td></tr>`).join('')}
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
function toggleTaskCardTag(tg){
  const i = TASK_STATE.tags.indexOf(tg);
  if (i>=0) TASK_STATE.tags.splice(i,1); else TASK_STATE.tags.push(tg);
  renderAll();
}
function taskCardSave(){
  const t = ST.tasks.find(x=>x.id===ST.selectedTaskId); if (!t) return;
  t.title = TASK_STATE.title; t.curatorId = TASK_STATE.curatorId; t.type = TASK_STATE.type;
  t.urgency = TASK_STATE.urgency; t.meta = TASK_STATE.meta; t.tags = TASK_STATE.tags.slice();
  t.desc = TASK_STATE.desc;
  t.orderId = TASK_STATE.orderId || null;
  toast('Задача записана','ok');
  renderAll();
}
function taskCardSaveClose(){ taskCardSave(); closeTab('taskCard'); }
function taskCardComplete(){
  const t = ST.tasks.find(x=>x.id===ST.selectedTaskId); if (!t) return;
  if (typeof showCloseModal==='function'){ showCloseModal(t.id); return; }
  t.done = true; t.status = 'Выполнена';
  toast('Задача выполнена','ok');
  closeTab('taskCard');
}
function taskCardPostpone(){
  const t = ST.tasks.find(x=>x.id===ST.selectedTaskId); if (!t) return;
  const parts = t.meta.split(' '); const ds = parts[0]; const tm = parts[1]||'10:00';
  const m = ds.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/); if (!m) return;
  let y = parseInt(m[3]); if (y<100) y+=2000;
  const d = new Date(y, parseInt(m[2])-1, parseInt(m[1])); d.setDate(d.getDate()+1);
  const nd = ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+String(d.getFullYear()).slice(-2);
  t.meta = nd+' '+tm; TASK_STATE.meta = t.meta;
  if (t.urgency==='overdue'){ t.urgency='med'; TASK_STATE.urgency='med'; t.status='Открыта'; }
  toast('Срок перенесён на '+nd,'ok');
  renderAll();
}
function taskCardEscalate(){
  const t = ST.tasks.find(x=>x.id===ST.selectedTaskId); if (!t) return;
  t.urgency='overdue'; t.status='Просрочена'; t.type='Эскалация';
  if (!t.tags.includes('эскалация')) t.tags.push('эскалация');
  toast('Задача эскалирована РОП','err');
  renderAll();
}
function taskCardReassign(){
  const t = ST.tasks.find(x=>x.id===ST.selectedTaskId); if (!t) return;
  t.curatorId = (t.curatorId+1) % CURATORS.length; TASK_STATE.curatorId = t.curatorId;
  toast('Задача передана куратору: '+curatorOf(t.curatorId).name,'ok');
  renderAll();
}

// ---------- SCREEN: Assistant Workspace (Помощник куратора) ----------
function renderAssist(){
  // Tasks assigned to the assistant. By default — pick curator linked to current assistant role.
  const myAssist = ASSISTANTS[0]; // demo: Иванова Н.А.
  const linkedCurator = myAssist.forCuratorId;
  // Pool of tasks visible to assistant — only call/WhatsApp tasks for their curator, excluding DMS/Не связываться
  const visible = ST.tasks.filter(t=>{
    if (t.curatorId !== linkedCurator) return false;
    const p = patientOf(t.pid);
    if (!p) return false;
    if (p.dms) return false;
    if (p.doNotContact) return false;
    // assistant cannot see "Эскалация" — that's curator/РОП only
    if (t.type==='Эскалация') return false;
    return true;
  });
  const sel = ST.assistSelectedTaskId && visible.find(t=>t.id===ST.assistSelectedTaskId) || visible[0];
  const selPatient = sel ? patientOf(sel.pid) : null;
  const selOrder   = sel?.orderId ? orderOf(sel.orderId)?.order : null;
  const cur = curatorOf(linkedCurator);

  return `
  <div class="cmdbar">
    <div style="display:flex;align-items:center;gap:8px;font-size:12px">
      <i class="ti ti-headset" style="color:#666;font-size:16px"></i>
      <span style="color:#555">Помощник:</span> <b>${myAssist.full}</b>
      <span style="color:#bbb">·</span>
      <span style="color:#555">Прикреплён к:</span> <span class="dot" style="background:${cur.dot}"></span><b>${cur.full}</b>
    </div>
    <div class="grow"></div>
    <button class="tb" onclick="toast('Запрошена замена куратора у РОП','ok')"><i class="ti ti-user-share"></i> Запросить замену</button>
    <button class="tb" onclick="toast('Сводное уведомление отправлено куратору','ok')"><i class="ti ti-bell"></i> Уведомить куратора</button>
  </div>

  <div style="background:var(--blue-soft);border-bottom:1px solid var(--blue-border);padding:6px 12px;font-size:11.5px;color:var(--blue);display:flex;align-items:center;gap:10px">
    <i class="ti ti-info-circle"></i>
    <span>Ограничения роли: <b>не видны</b> пациенты с ДМС и с флагом «Не связываться». Финансовые поля скрыты. Эскалации — только у куратора/РОП.</span>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:0;flex:1;min-height:0">
    <!-- LEFT: priority list -->
    <div style="border-right:1px solid var(--border-light);display:flex;flex-direction:column;min-height:0">
      <div style="background:#F0F0F0;padding:5px 10px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border-light)">
        <i class="ti ti-list-numbers"></i> Очередь задач · приоритет
        <span class="pill p-blue" style="margin-left:auto">${visible.length}</span>
      </div>
      <div style="flex:1;overflow:auto">
        ${visible.length ? visible.sort((a,b)=>{const ord={overdue:0,high:1,med:2,low:3};return (ord[a.urgency]||9)-(ord[b.urgency]||9);}).map((t,i)=>{
          const p = patientOf(t.pid); if (!p) return '';
          const isSel = sel?.id===t.id;
          return `<div onclick="ST.assistSelectedTaskId='${t.id}';renderAll()" style="padding:8px 10px;border-bottom:1px solid #eee;cursor:pointer;display:flex;align-items:flex-start;gap:8px;${isSel?'background:var(--blue-sel)':''}${t.urgency==='overdue'?';border-left:3px solid var(--red)':''}">
            <span style="font-size:13px;color:#888;font-weight:700;width:18px;text-align:right;padding-top:2px">${i+1}.</span>
            <span class="urg ${t.urgency}" style="margin-top:5px"></span>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:12.5px;color:${isSel?'var(--blue)':'#222'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div>
              <div style="font-size:11px;color:#777;margin-top:2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                <b>${p.name.split(' ').slice(0,2).join(' ')}</b>
                ${pillForAbc(p.abc)}
                <span class="pill p-gray">${p.geo}</span>
                ${selOrder===null && t.orderId?'<i class="ti ti-receipt" style="color:#1565C0;font-size:11px"></i>':''}
              </div>
              <div style="font-size:10.5px;color:#999;margin-top:2px"><i class="ti ti-${t.tags.includes('WhatsApp')?'brand-whatsapp':'phone'}" style="font-size:11px"></i> ${t.meta}</div>
            </div>
          </div>`;
        }).join('') : `<div style="padding:30px;text-align:center;color:#999">— нет задач в очереди —</div>`}
      </div>
    </div>

    <!-- RIGHT: task detail card -->
    <div style="overflow:auto;padding:14px;min-height:0">
      ${sel ? renderAssistCard(sel, selPatient, selOrder) : '<div style="color:#999;padding:30px;text-align:center">Выберите задачу слева</div>'}
    </div>
  </div>`;
}
function renderAssistCard(t, p, ord){
  const cu = curatorOf(t.curatorId);
  const channel = t.tags.includes('WhatsApp')?'WhatsApp':'Телефон';
  return `
    <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px">
      <div style="width:56px;height:56px;border-radius:50%;background:${cu.dot};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;flex-shrink:0">${p.initials}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-weight:700;font-size:16px">${p.name}</span>
          ${pillForAbc(p.abc)}
          ${pillFor('type',p.type)}
          <span class="pill p-gray">${p.geo}</span>
        </div>
        <div style="font-size:11.5px;color:#666;margin-top:3px">Карта <a class="lk" onclick="openDealCard('${p.id}')">${p.num}</a> · Цикл №${p.cycleNum} (${p.cycleType}) · Куратор ${cu.name}</div>
      </div>
      <div style="text-align:right">
        <span class="urg ${t.urgency}" style="vertical-align:middle"></span>
        <span style="font-size:11.5px;color:#666;margin-left:6px">${t.urgency==='overdue'?'ПРОСРОЧЕНО':t.urgency==='high'?'Высокий':t.urgency==='med'?'Средний':'Низкий'}</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div class="metric"><div class="k">Тип задачи</div><div class="v" style="font-size:13px">${t.type}</div></div>
      <div class="metric"><div class="k">Срок</div><div class="v" style="font-size:13px;${t.urgency==='overdue'?'color:var(--red)':''}">${t.meta}</div></div>
    </div>

    ${ord ? `<div class="group" style="margin-bottom:10px">
      <div class="group-h"><span class="ch">▼</span>Заказ · <span style="font-weight:400;color:#666;margin-left:6px">${ord.num}</span></div>
      <div style="padding:10px 12px;font-size:12.5px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">${pillForReception(ord.receptionType)} ${pillForOrder(statusOf9(ord.status9).name)}</div>
        <div style="color:#666">${ord.category}</div>
        <div style="color:#999;font-size:11.5px;margin-top:4px">${ord.services.length} позиций · <i>финансовые суммы скрыты для роли «Помощник»</i></div>
      </div>
    </div>` : `<div style="background:#F4F4F4;border:1px dashed #C5C5C5;padding:10px 12px;font-size:12px;color:#666;margin-bottom:10px;border-radius:2px"><i class="ti ti-user"></i> Задача без привязки к заказу — общий контакт с пациентом.</div>`}

    ${p.abonement ? `<div style="background:#FFF8E1;border:1px solid #E8C840;padding:8px 12px;border-radius:2px;margin-bottom:10px;font-size:12px;display:flex;align-items:center;gap:8px">
      <i class="ti ti-ticket" style="color:#7a5500;font-size:16px"></i>
      <div>
        <b>Абонемент:</b> ${p.abonement.used} из ${p.abonement.total} занятий
        ${p.abonement.used >= p.abonement.total-1 ? '<span style="color:var(--red);margin-left:6px;font-weight:600">⚠ Предпоследнее занятие — напомнить о продлении!</span>' : ''}
      </div>
    </div>` : ''}

    <div class="group" style="margin-bottom:10px">
      <div class="group-h"><span class="ch">▼</span>Контакт</div>
      <div style="padding:10px 12px;font-size:12.5px">
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <button class="tb primary" onclick="toast('Вызов: ${p.name}','ok')"><i class="ti ti-phone-call"></i> Позвонить</button>
          <button class="tb" onclick="toast('WhatsApp открыт','ok')"><i class="ti ti-brand-whatsapp"></i> WhatsApp</button>
          <button class="tb" onclick="toast('SMS отправлено','ok')"><i class="ti ti-message"></i> SMS</button>
        </div>
        <div style="color:#666"><b>Канал по задаче:</b> ${channel} · <b>Шаблон скрипта:</b> <code>${t.type.includes('день 0')?'day0_script_v3':t.type.includes('день 3')?'day3_sms':t.type.includes('NPS')?'nps_short_v2':'general_v1'}</code></div>
      </div>
    </div>

    <div class="group" style="margin-bottom:10px">
      <div class="group-h"><span class="ch">▼</span>Комментарий врача</div>
      <div style="padding:10px 12px;font-size:12.5px;color:#444;line-height:1.45">
        «${p.comment}»
      </div>
    </div>

    <div class="group">
      <div class="group-h"><span class="ch">▼</span>Закрытие задачи <span style="margin-left:auto;font-weight:400;font-size:11px;color:#7a5500"><i class="ti ti-alert-triangle"></i> комментарий обязателен</span></div>
      <div style="padding:10px 12px">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          ${['Дозвонился, согласился','Дозвонился, отказ','Не взял трубку','Неверный номер','Перенести +1 день'].map(r=>`<span class="tag" onclick="toast('Исход: '+'${r}','ok')">${r}</span>`).join('')}
        </div>
        <textarea id="assistComment" style="width:100%;min-height:60px;border:1px solid var(--border);font:12.5px Arial;padding:6px 8px;resize:vertical;outline:none" placeholder="Опишите результат разговора (обязательно)…"></textarea>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="tb blue" onclick="assistClose('${t.id}')"><i class="ti ti-check"></i> Закрыть с комментарием</button>
          <button class="tb" onclick="assistPostpone('${t.id}')"><i class="ti ti-arrow-forward"></i> Перенести</button>
          <div class="grow"></div>
          <button class="tb" onclick="openTaskCard('${t.id}')"><i class="ti ti-external-link"></i> Полная карточка</button>
        </div>
      </div>
    </div>
  `;
}
function assistClose(tid){
  const cmt = document.getElementById('assistComment')?.value.trim();
  if (!cmt){ toast('Введите комментарий перед закрытием','err'); return; }
  const t = ST.tasks.find(x=>x.id===tid); if (!t) return;
  t.done = true; t.status='Выполнена'; t.desc = cmt;
  toast('Задача закрыта · комментарий записан','ok');
  ST.assistSelectedTaskId = null;
  renderAll();
}
function assistPostpone(tid){
  const t = ST.tasks.find(x=>x.id===tid); if (!t) return;
  // +1 day
  const parts = t.meta.split(' '); const ds = parts[0]; const tm = parts[1]||'10:00';
  const m = ds.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/); if (!m) return;
  let y = parseInt(m[3]); if (y<100) y+=2000;
  const d = new Date(y, parseInt(m[2])-1, parseInt(m[1])); d.setDate(d.getDate()+1);
  const nd = ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+String(d.getFullYear()).slice(-2);
  t.meta = nd+' '+tm; if (t.urgency==='overdue') t.urgency='med';
  toast('Задача перенесена на '+nd,'ok');
  renderAll();
}

function p_setAbc(pid, val){ const p = patientOf(pid); if (!p) return; p.abc=val; toast(`ABC-сегмент: ${val}`,'ok'); renderAll(); }
function p_toggle(pid, key, on){ const p = patientOf(pid); if (!p) return; p[key]=on; toast(`${key}: ${on?'вкл':'выкл'}`,on?'ok':'info'); renderAll(); }

// ---------- SCREEN: Order Card ----------
let ORDER_STATE = { _loaded:false };
function renderOrderCard(){
  const sel = ST.selectedOrderId; if (!sel) return '<div style="padding:24px;color:#888">Заказ не выбран.</div>';
  const r = orderOf(sel); if (!r) return '<div style="padding:24px;color:#888">Заказ не найден.</div>';
  const {order:o, patient:p} = r;
  if (!ORDER_STATE._loaded || ORDER_STATE._oid!==o.id){
    ORDER_STATE = {_loaded:true,_oid:o.id, status:o.status, category:o.category};
  }
  const cur = p.curatorId!=null?curatorOf(p.curatorId):null;
  const due = o.sum - o.paid;
  const orderTasks = ST.tasks.filter(t=>t.orderId===o.id);
  return `
  <div class="cmdbar">
    <button class="tb blue" onclick="orderSaveClose()"><i class="ti ti-check"></i> Записать и закрыть</button>
    <button class="tb primary" onclick="orderSave()"><i class="ti ti-device-floppy"></i> Записать</button>
    <div class="tb-sep"></div>
    <button class="tb" onclick="orderMarkPaid()"><i class="ti ti-cash"></i> Отметить оплату</button>
    <button class="tb" onclick="orderCancel()"><i class="ti ti-ban"></i> Отменить заказ</button>
    <button class="tb" onclick="trigger3DayTask('${o.id}')" title="FR-007 · создаёт автозадачу +3 раб. дня"><i class="ti ti-clock-play"></i> Завершить приём (триггер +3)</button>
    <button class="tb" onclick="createTaskFor('${p.id}','${o.id}')"><i class="ti ti-checkbox"></i> + Задача по заказу</button>
    <div class="tb-sep"></div>
    <button class="tb"><i class="ti ti-printer"></i> Печать заказа</button>
    <button class="tb"><i class="ti ti-file-invoice"></i> Счёт</button>
    <button class="tb"><i class="ti ti-receipt-tax"></i> Чек</button>
    <div class="grow"></div>
    <button class="tb"><i class="ti ti-dots"></i> Ещё</button>
  </div>

  <div class="form-pad">
    <div class="card-strip">
      <div><span class="lbl">Заказ №</span> <span class="num">${o.num}</span></div>
      <div class="inp dt" style="width:140px"><input value="${o.date} 10:14" readonly><div class="b">📅</div></div>
      <div><span class="lbl">Пациент:</span> <a class="lk" onclick="openDealCard('${p.id}')">${p.name}</a> <span class="lbl">· карта</span> <a class="lk" onclick="openDealCard('${p.id}')">${p.num}</a></div>
      <div class="right">
        <span class="lbl">Статус:</span> ${pillForOrder(o.status)}
        ${typeof dynamicMrtBadge==='function'?dynamicMrtBadge(o):''}
      </div>
    </div>

    <div class="twocols" style="grid-template-columns:1.5fr 1fr;gap:10px">
      <div>
        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Номенклатура заказа · ${o.services.length} позиций</div>
          <table class="t">
            <colgroup><col style="width:30px"><col style="width:auto"><col style="width:60px"><col style="width:100px"><col style="width:100px"></colgroup>
            <thead><tr><th>N</th><th>Услуга</th><th>Кол.</th><th>Цена</th><th>Сумма</th></tr></thead>
            <tbody>
              ${o.services.map((s,i)=>`<tr>
                <td style="color:#999">${i+1}</td>
                <td><a class="lk">${s.name}</a></td>
                <td style="text-align:center">${s.qty}</td>
                <td style="text-align:right">${fmt(s.price)}</td>
                <td style="text-align:right;font-weight:600">${fmt(s.sum)}</td>
              </tr>`).join('')}
              <tr style="background:#F0EFE8;font-weight:700">
                <td colspan="4" style="text-align:right">Итого по заказу:</td>
                <td style="text-align:right">${fmt(o.sum)} ₽</td>
              </tr>
            </tbody>
          </table>
          <div style="padding:6px 10px;border-top:1px solid var(--border-light);display:flex;gap:6px">
            <button class="tb"><i class="ti ti-plus"></i> Добавить позицию</button>
            <button class="tb"><i class="ti ti-package-import"></i> Подобрать из прайс-листа</button>
            <div class="grow"></div>
            <button class="tb"><i class="ti ti-trash"></i></button>
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Реквизиты заказа</div>
          <div class="group-b">
            <div class="l">Номенклатурная группа:</div>
            <div class="inp"><select onchange="ORDER_STATE.category=this.value">
              ${SERVICE_POOL.map(c=>`<option ${ORDER_STATE.category===c[0]?'selected':''}>${c[0]}</option>`).join('')}
            </select></div>
            <div class="l">Медицинская орг.:</div>
            <div class="inp"><input value="Институт Движения, осн. филиал"><div class="b">↗</div></div>

            <div class="l req">Статус:</div>
            <div class="inp"><select onchange="ORDER_STATE.status=this.value;renderAll()">
              ${['Активен','Оплачен','Частично оплачен','Отменён'].map(s=>`<option ${ORDER_STATE.status===s?'selected':''}>${s}</option>`).join('')}
            </select></div>
            <div class="l">Исполнитель:</div>
            <div class="inp"><input value="Семёнов А.К., ортопед-травматолог"><div class="b">▼</div><div class="b">↗</div></div>

            <div class="l">Источник:</div>
            <div class="inp"><input value="Внутреннее назначение"></div>
            <div class="l">Оплата:</div>
            <div class="inp"><input value="Наличные / карта МИР"></div>

            <div class="l">Признаки:</div>
            <div style="grid-column:span 3;display:flex;gap:14px;align-items:center;font-size:12.5px">
              <label><input type="checkbox" ${o.isDynamicMRT?'checked':''} onchange="const r=orderOf('${o.id}');if(r){r.order.isDynamicMRT=this.checked;renderAll();toast(this.checked?'Отмечен как МРТ в динамике':'Снят признак МРТ в динамике','ok');}"> <b>МРТ в динамике</b> (FR-017 P2.4) — исключить из конверсии воронки</label>
              ${o._triggered?'<span class="pill p-green"><i class="ti ti-circle-check"></i> Триггер +3 дня запущен</span>':''}
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Задачи по заказу · ${orderTasks.length}
            <button class="tb primary" style="margin-left:auto;height:20px;font-size:11px" onclick="createTaskFor('${p.id}','${o.id}')"><i class="ti ti-plus"></i> Задача</button>
          </div>
          ${orderTasks.length ? `<table class="t">
            <colgroup><col style="width:14px"><col style="width:auto"><col style="width:140px"><col style="width:120px"><col style="width:120px"><col style="width:100px"></colgroup>
            <thead><tr><th></th><th>Задача</th><th>Куратор</th><th>Тип</th><th>Срок</th><th>Статус</th></tr></thead>
            <tbody>
              ${orderTasks.map(t=>{
                const cu = curatorOf(t.curatorId);
                return `<tr ondblclick="openTaskCard('${t.id}')" class="${t.urgency==='overdue'&&!t.done?'overdue':''} ${t.done?'done':''}" style="cursor:pointer">
                  <td><span class="urg ${t.urgency}"></span></td>
                  <td><a class="lk" onclick="openTaskCard('${t.id}')">${t.title}</a></td>
                  <td><span class="dot" style="background:${cu.dot}"></span>${cu.name}</td>
                  <td>${pillFor('task',t.type)}</td>
                  <td>${t.meta}</td>
                  <td>${pillFor('status',t.status)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>` : `<div style="padding:14px;color:#999;font-size:12px">— задач по этому заказу нет —</div>`}
        </div>
      </div>

      <div>
        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Финансы</div>
          <div style="padding:10px 12px;display:grid;grid-template-columns:1fr;gap:8px">
            <div class="metric"><div class="k">Сумма заказа</div><div class="v">${fmt(o.sum)} ₽</div></div>
            <div class="metric"><div class="k">Оплачено</div><div class="v" style="color:var(--green)">${fmt(o.paid)} ₽</div><div class="s">${o.sum?Math.round(o.paid/o.sum*100):0}% от суммы</div></div>
            <div class="metric"><div class="k">К оплате</div><div class="v" style="color:${due>0?'var(--amber-border)':'#999'}">${fmt(Math.max(0,due))} ₽</div></div>
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>Пациент</div>
          <div style="padding:10px 12px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:36px;height:36px;border-radius:50%;background:${cur?cur.dot:'#888'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">${p.initials}</div>
              <div>
                <div style="font-weight:700"><a class="lk" onclick="openDealCard('${p.id}')">${p.name}</a></div>
                <div style="font-size:11px;color:#888">${p.num} · ${pillFor('type',p.type)} · ${pillFor('priority',p.priority)}</div>
              </div>
            </div>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#666;padding:2px 0;width:130px">Куратор:</td><td>${cur?`<span class="dot" style="background:${cur.dot}"></span>${cur.name}`:'— не назначен —'}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Стадия:</td><td>${stageOf(p.stage).name}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Психотип:</td><td>${pillFor('psycho',p.psycho)}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Гео:</td><td>${p.geo}</td></tr>
              <tr><td style="color:#666;padding:2px 0">Источник:</td><td>${p.source}</td></tr>
              <tr><td style="color:#666;padding:2px 0">След. контакт:</td><td>${p.nextContact||'—'}</td></tr>
            </table>
            <button class="tb" style="margin-top:8px;width:100%" onclick="openDealCard('${p.id}')"><i class="ti ti-external-link"></i> Открыть карточку пациента</button>
          </div>
        </div>

        <div class="group">
          <div class="group-h"><span class="ch">▼</span>История</div>
          <div style="padding:6px 0">
            <table style="width:100%;font-size:11.5px;border-collapse:collapse">
              <tr><td style="padding:4px 10px;color:#888;border-top:1px solid #eee;width:90px">${o.date} 09:48</td><td style="padding:4px 10px;border-top:1px solid #eee">Создан заказ из карты пациента</td></tr>
              <tr><td style="padding:4px 10px;color:#888;border-top:1px solid #eee">${o.date} 10:14</td><td style="padding:4px 10px;border-top:1px solid #eee">Добавлено номенклатуры: ${o.services.length} поз.</td></tr>
              ${o.paid>0?`<tr><td style="padding:4px 10px;color:#888;border-top:1px solid #eee">${o.date} 16:32</td><td style="padding:4px 10px;border-top:1px solid #eee">Принята оплата: <b>${fmt(o.paid)} ₽</b></td></tr>`:''}
              ${o.status==='Отменён'?`<tr><td style="padding:4px 10px;color:#888;border-top:1px solid #eee">04.04.26 11:00</td><td style="padding:4px 10px;border-top:1px solid #eee;color:var(--red)">Заказ отменён</td></tr>`:''}
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
function orderSave(){
  const r = orderOf(ST.selectedOrderId); if (!r) return;
  r.order.status = ORDER_STATE.status; r.order.category = ORDER_STATE.category;
  if (r.order.status==='Оплачен') r.order.paid = r.order.sum;
  if (r.order.status==='Отменён') r.order.paid = 0;
  recomputePatient(r.patient);
  toast('Заказ записан','ok'); renderAll();
}
function orderSaveClose(){ orderSave(); closeTab('orderCard'); }
function orderMarkPaid(){
  const r = orderOf(ST.selectedOrderId); if (!r) return;
  r.order.paid = r.order.sum; r.order.status='Оплачен'; ORDER_STATE.status='Оплачен';
  recomputePatient(r.patient);
  toast(`Оплата принята: ${fmt(r.order.sum)} ₽`,'ok'); renderAll();
}
function orderCancel(){
  const r = orderOf(ST.selectedOrderId); if (!r) return;
  r.order.status='Отменён'; r.order.paid=0; ORDER_STATE.status='Отменён';
  recomputePatient(r.patient);
  toast('Заказ отменён','err'); renderAll();
}

// ============ ROUTER ============
function renderAll(){
  renderTabs();
  const main = document.getElementById('content');
  let html = '';
  const screens = ['home','deals','kanban','morning','tasks','assist','reminders','substitutions','sources','report','analytics','ropDash','curatorDash','card','taskCard','orderCard'];
  const renderers = { home:renderHome, deals:renderDeals, kanban:renderKanban, morning:renderMorning, tasks:renderTasks, assist:renderAssist, reminders:typeof renderReminders==='function'?renderReminders:()=>'', substitutions:typeof renderSubstitutions==='function'?renderSubstitutions:()=>'', sources:typeof renderSources==='function'?renderSources:()=>'', report:renderReport, analytics:typeof renderAnalytics==='function'?renderAnalytics:()=>'', ropDash:typeof renderRopDash==='function'?renderRopDash:()=>'', curatorDash:typeof renderCuratorDash==='function'?renderCuratorDash:()=>'', card:renderCard, taskCard:renderTaskCard, orderCard:renderOrderCard };
  screens.forEach(s=>{
    const show = (ST.currentScreen===s);
    html += `<section class="screen${show?' show':''}" data-screen-label="${SCREEN_META[s]?.label||'Главная'}">${show?renderers[s]():''}</section>`;
  });
  main.innerHTML = html;
  // Update record count
  if (ST.currentScreen!=='deals'){
    const screenLabel = SCREEN_META[ST.currentScreen]?.label || 'Главная';
    document.getElementById('recCount').textContent = screenLabel;
  }
}

// ============ MODAL (placeholder) ============
function closeModal(){ document.getElementById('modal').classList.remove('show'); }

// ============ INIT ============
window.addEventListener('DOMContentLoaded',()=>{
  bindNav();
  ST.openTabs = [{id:'deals',label:'Сделки'}];
  ST.activeTab='deals';
  ST.currentScreen='deals';
  renderAll();
  setTimeout(()=>toast('CRM-модуль загружен · база ИнститутДвижения_Prod','ok'), 400);
});
