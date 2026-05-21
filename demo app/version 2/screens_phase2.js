// ============================================================
// PHASE-2 SCREENS — FR-013/014/015/018/019/020/021/022/023
// ============================================================

// ============ SCREEN: Дашборд РОП (FR-018) ============
function renderRopDash(){
  const open = ST.patients.filter(p=>p.status==='В работе'||p.status==='Новый');
  const overdueT = ST.tasks.filter(t=>t.urgency==='overdue' && !t.done);
  const overdueSum = ST.patients.filter(p=>(p.dozhim==='день 7'||p.dozhim==='эскалация')).reduce((s,p)=>s+p.sumDue,0);
  const sumOpen = ST.patients.reduce((s,p)=>s+(p.sumOrders||0),0);
  const sumPaid = ST.patients.reduce((s,p)=>s+(p.sumPaid||0),0);
  const sumDue = ST.patients.reduce((s,p)=>s+(p.sumDue||0),0);
  // По кураторам
  const byCur = CURATORS.map(c=>{
    const pts = ST.patients.filter(p=>p.curatorId===c.id);
    const tasks = ST.tasks.filter(t=>t.curatorId===c.id);
    const done = tasks.filter(t=>t.done).length;
    const overdue = tasks.filter(t=>t.urgency==='overdue'&&!t.done).length;
    const sum = pts.reduce((s,p)=>s+p.sumOrders,0);
    return { c, pts:pts.length, tasks:tasks.length, done, overdue, sum, perf: tasks.length? Math.round(done/tasks.length*100):0 };
  });
  // Funnel
  const funnel = STAGES.map(s=>({ s, n: ST.patients.filter(p=>p.stage===s.id).length }));
  const funnelMax = Math.max(...funnel.map(f=>f.n));
  // Распределение по источникам
  const bySource = {};
  ST.patients.forEach(p=>{ bySource[p.source] = (bySource[p.source]||0)+1; });
  // Распределение по ABC
  const byAbc = {};
  ST.patients.forEach(p=>{ byAbc[p.abc] = (byAbc[p.abc]||0)+1; });

  return `
  <div class="cmdbar">
    <span style="font-weight:700;font-size:13px;display:flex;align-items:center;gap:6px"><i class="ti ti-dashboard"></i> Дашборд руководителя ОП</span>
    <div class="tb-sep"></div>
    <span class="lbl" style="font-size:12px;color:#555">Период:</span>
    <div class="pick"><input value="01.05.2026 — 18.05.2026" style="width:160px"><div class="b">📅</div></div>
    <span class="lbl" style="font-size:12px;color:#555">Куратор:</span>
    <select class="role-sel" style="height:22px;border:1px solid var(--border)"><option>Все</option>${CURATORS.map(c=>`<option>${c.name}</option>`).join('')}</select>
    <span class="lbl" style="font-size:12px;color:#555">Город:</span>
    <select class="role-sel" style="height:22px;border:1px solid var(--border)"><option>Все</option><option>Москва</option><option>Тюмень</option></select>
    <button class="tb primary" onclick="toast('Дашборд обновлён','ok')"><i class="ti ti-refresh"></i> Обновить</button>
    <div class="grow"></div>
    <button class="tb"><i class="ti ti-file-export"></i> Экспорт PDF</button>
    <span style="font-size:11px;color:#888">обновлено 18.05.26 09:42</span>
  </div>

  <div style="flex:1;overflow:auto;padding:12px;background:#F7F7F7">
    <!-- KPI Row -->
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px">
      <div class="kpi-card"><div class="kpi-k">Активных заказов</div><div class="kpi-v">${open.length}</div><div class="kpi-s" style="color:var(--green)">+12% к прошлой нед.</div></div>
      <div class="kpi-card"><div class="kpi-k">Сумма открытых</div><div class="kpi-v">${fmtCompact(sumOpen)}</div><div class="kpi-s">${fmt(sumOpen)} ₽</div></div>
      <div class="kpi-card"><div class="kpi-k">К оплате</div><div class="kpi-v" style="color:var(--amber-border)">${fmtCompact(sumDue)}</div><div class="kpi-s">${fmt(sumDue)} ₽</div></div>
      <div class="kpi-card"><div class="kpi-k">Просрочек</div><div class="kpi-v" style="color:var(--red)">${overdueT.length}</div><div class="kpi-s">на ${fmt(overdueSum)} ₽</div></div>
      <div class="kpi-card"><div class="kpi-k">Конверсия дожима</div><div class="kpi-v" style="color:var(--green)">28,4%</div><div class="kpi-s">цель ≥25% ✓</div></div>
      <div class="kpi-card"><div class="kpi-k">Средний чек</div><div class="kpi-v">${fmtCompact(sumOpen/Math.max(open.length,1))}</div><div class="kpi-s">первичный приём</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:10px;margin-bottom:12px">
      <!-- Funnel -->
      <div class="group" style="background:#fff;margin:0">
        <div class="group-h"><span class="ch">▼</span>Воронка продаж по стадиям</div>
        <div style="padding:14px 16px">
          ${funnel.map(f=>{
            const w = funnelMax ? Math.round(f.n/funnelMax*100) : 0;
            return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">
              <div style="width:110px;font-size:12px;color:#444">${f.s.name}</div>
              <div style="flex:1;height:22px;background:#F0F0F0;border-radius:2px;position:relative">
                <div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:${f.s.strip};opacity:.85;border-radius:2px"></div>
                <div style="position:absolute;left:8px;top:3px;font-size:11.5px;color:${w>30?'#fff':'#333'};font-weight:700">${f.n}</div>
              </div>
              <div style="width:50px;text-align:right;font-size:11px;color:#666">${ST.patients.length? Math.round(f.n/ST.patients.length*100):0}%</div>
            </div>`;
          }).join('')}
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border-light);font-size:11.5px;color:#666;display:flex;gap:18px">
            <span><b>Конверсия Лид→Финальная:</b> ${ST.patients.length?Math.round(funnel[3].n/(funnel[0].n+1)*100):0}%</span>
            <span><b>Цель:</b> ≥55% за 6 мес</span>
          </div>
        </div>
      </div>

      <!-- ABC distribution -->
      <div class="group" style="background:#fff;margin:0">
        <div class="group-h"><span class="ch">▼</span>Распределение по ABC-сегментам</div>
        <div style="padding:14px 16px">
          ${ABC_SEGMENTS.map(s=>{
            const n = byAbc[s.id]||0;
            const w = ST.patients.length? Math.round(n/ST.patients.length*100):0;
            return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <div style="width:90px;font-size:12px">${pillForAbc(s.id)}</div>
              <div style="flex:1;height:18px;background:#F0F0F0;border-radius:2px;position:relative">
                <div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:${abcColor(s.id)};opacity:.7;border-radius:2px"></div>
              </div>
              <div style="width:60px;text-align:right;font-size:11.5px;font-weight:600">${n} (${w}%)</div>
            </div>`;
          }).join('')}
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border-light);font-size:11.5px;color:#666">
            Фокус-внимание: <b style="color:var(--red)">Реанимация</b> + <b style="color:var(--purple)">ВИП</b> — приоритет в утреннем планировании.
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <!-- Curators perf -->
      <div class="group" style="background:#fff;margin:0">
        <div class="group-h"><span class="ch">▼</span>Эффективность кураторов</div>
        <table class="t" style="margin:0">
          <colgroup><col style="width:auto"><col style="width:60px"><col style="width:60px"><col style="width:70px"><col style="width:80px"><col style="width:110px"></colgroup>
          <thead><tr><th>Куратор</th><th>Пац.</th><th>Зад.</th><th>Прсрч.</th><th>% вып.</th><th>Сумма заказов</th></tr></thead>
          <tbody>
            ${byCur.map(b=>`<tr>
              <td><span class="dot" style="background:${b.c.dot}"></span>${b.c.name}</td>
              <td style="text-align:center">${b.pts}</td>
              <td style="text-align:center">${b.tasks}</td>
              <td style="text-align:center;${b.overdue>0?'color:var(--red);font-weight:600':''}">${b.overdue}</td>
              <td style="text-align:right"><b>${b.perf}%</b></td>
              <td style="text-align:right">${fmt(b.sum)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- Sources -->
      <div class="group" style="background:#fff;margin:0">
        <div class="group-h"><span class="ch">▼</span>Источники обращений (FR-020) <a class="lk" style="margin-left:auto;font-size:11px" onclick="openTab('sources')">справочник →</a></div>
        <div style="padding:14px 16px">
          ${Object.entries(bySource).sort((a,b)=>b[1]-a[1]).map(([src,n])=>{
            const w = ST.patients.length? Math.round(n/ST.patients.length*100):0;
            return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <div style="width:90px;font-size:12px;color:#444">${src}</div>
              <div style="flex:1;height:18px;background:#F0F0F0;border-radius:2px;position:relative">
                <div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:#1565C0;opacity:.7"></div>
              </div>
              <div style="width:80px;text-align:right;font-size:11.5px;color:#666">${n} <span style="color:#999">· CPL ~${1200+n*180}₽</span></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Просрочки -->
    <div class="group" style="background:#fff;margin:0">
      <div class="group-h"><span class="ch">▼</span>Просроченные задачи · ${overdueT.length} <span style="margin-left:auto;font-weight:400;font-size:11px;color:var(--red)">на сумму ${fmt(overdueSum)} ₽</span></div>
      <table class="t" style="margin:0">
        <colgroup><col style="width:auto"><col style="width:160px"><col style="width:140px"><col style="width:120px"><col style="width:90px"></colgroup>
        <thead><tr><th>Задача</th><th>Пациент</th><th>Куратор</th><th>Срок</th><th>Сумма</th></tr></thead>
        <tbody>
          ${overdueT.slice(0,8).map(t=>{const c=curatorOf(t.curatorId);const p=patientOf(t.pid);return `<tr ondblclick="openTaskCard('${t.id}')" style="cursor:pointer" class="overdue">
            <td><a class="lk" onclick="openTaskCard('${t.id}')">${t.title}</a></td>
            <td><a class="lk" onclick="openDealCard('${t.pid}')">${t.patient}</a></td>
            <td><span class="dot" style="background:${c.dot}"></span>${c.name}</td>
            <td style="color:var(--red);font-weight:600">${t.meta}</td>
            <td style="text-align:right">${p?fmt(p.sumDue):''}</td>
          </tr>`;}).join('')||'<tr><td colspan="5" style="text-align:center;color:#999;padding:20px">Просроченных задач нет</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>`;
}
function abcColor(id){ return {A:'#1A6B30',B:'#B7770D',C:'#888',VIP:'#6A3FAA',REA:'#C0392B'}[id]||'#888'; }
function fmtCompact(n){
  if (!n) return '0';
  if (n>=1e6) return (n/1e6).toFixed(1).replace('.0','')+' млн';
  if (n>=1e3) return Math.round(n/1e3)+'k';
  return Math.round(n);
}

// ============ SCREEN: Дашборд куратора (FR-019) ============
function renderCuratorDash(){
  const me = ST.curatorOnlyForRole != null ? ST.curatorOnlyForRole : 0;
  const c = curatorOf(me);
  const myPts = ST.patients.filter(p=>p.curatorId===me);
  const myTasks = ST.tasks.filter(t=>t.curatorId===me);
  const today = myTasks.filter(t=>!t.done);
  const overdue = myTasks.filter(t=>t.urgency==='overdue'&&!t.done);
  const partial = myPts.filter(p=>(p.orders||[]).some(o=>o.status==='Частично оплачен'));
  const dueSum = myPts.reduce((s,p)=>s+(p.sumDue||0),0);
  const done = myTasks.filter(t=>t.done).length;
  const perf = myTasks.length? Math.round(done/myTasks.length*100):0;

  return `
  <div class="cmdbar">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:30px;height:30px;border-radius:50%;background:${c.dot};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">${c.short}</div>
      <div>
        <div style="font-weight:700;font-size:13px">${c.full}</div>
        <div style="font-size:11px;color:#888">Куратор · ${myPts.length} пациентов в работе</div>
      </div>
    </div>
    <div class="tb-sep"></div>
    <button class="tb primary" onclick="toast('Открыто планирование дня','ok')"><i class="ti ti-calendar-plus"></i> Спланировать день</button>
    <button class="tb" onclick="openTab('tasks')"><i class="ti ti-list"></i> Все мои задачи</button>
    <button class="tb" onclick="toast('Запрошено замещение у РОП','ok')"><i class="ti ti-beach"></i> Уйти в отпуск</button>
    <div class="grow"></div>
    <span style="font-size:11px;color:#888">${new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}</span>
  </div>

  <div style="flex:1;overflow:auto;padding:12px;background:#F7F7F7">
    <!-- Сводное приветствие FR-022 -->
    <div style="background:#FFFEF0;border:1px solid #E8C840;padding:12px 16px;border-radius:2px;margin-bottom:12px;display:flex;align-items:center;gap:12px">
      <i class="ti ti-info-circle" style="font-size:24px;color:#7a5500"></i>
      <div style="flex:1;font-size:13px">
        <b>Доброе утро, ${c.full.split(' ')[1]}!</b> На сегодня у вас <b>${today.length} активных задач</b>${overdue.length?`, из них <b style="color:var(--red)">${overdue.length} просрочено</b>`:''}. К оплате — <b>${fmt(dueSum)} ₽</b> у ${partial.length} пациентов.
      </div>
      <button class="tb primary" onclick="openTab('tasks')">Начать <i class="ti ti-arrow-right"></i></button>
    </div>

    <!-- KPI -->
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px">
      <div class="kpi-card"><div class="kpi-k">Задач сегодня</div><div class="kpi-v">${today.length}</div></div>
      <div class="kpi-card"><div class="kpi-k">Просрочено</div><div class="kpi-v" style="color:var(--red)">${overdue.length}</div></div>
      <div class="kpi-card"><div class="kpi-k">Частично оплачено</div><div class="kpi-v" style="color:var(--amber-border)">${partial.length}</div><div class="kpi-s">${fmt(dueSum)} ₽</div></div>
      <div class="kpi-card"><div class="kpi-k">% выполнения</div><div class="kpi-v" style="color:${perf>=80?'var(--green)':'#222'}">${perf}%</div><div class="kpi-s">цель ≥95%</div></div>
      <div class="kpi-card"><div class="kpi-k">Конверсия дожима</div><div class="kpi-v" style="color:var(--green)">31%</div><div class="kpi-s">цель ≥25% ✓</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="group" style="background:#fff;margin:0">
        <div class="group-h"><span class="ch">▼</span>Топ-приоритеты дня <span style="margin-left:auto;font-weight:400;font-size:11px;color:#666">по срочности</span></div>
        <div style="padding:6px 0">
          ${today.sort((a,b)=>{const o={overdue:0,high:1,med:2,low:3};return (o[a.urgency]||9)-(o[b.urgency]||9);}).slice(0,6).map((t,i)=>{
            const p = patientOf(t.pid);
            return `<div onclick="openTaskCard('${t.id}')" style="display:flex;align-items:center;gap:8px;padding:7px 14px;border-bottom:1px solid #eee;cursor:pointer">
              <span style="width:18px;text-align:center;font-weight:700;color:#888">${i+1}</span>
              <span class="urg ${t.urgency}"></span>
              <div style="flex:1;min-width:0">
                <div style="font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div>
                <div style="font-size:10.5px;color:#888">${p?.name||t.patient} · ${pillForAbc(p?.abc||'C')} · ${t.meta}</div>
              </div>
              <i class="ti ti-chevron-right" style="color:#bbb"></i>
            </div>`;
          }).join('')||'<div style="padding:20px;text-align:center;color:#999">— задач нет —</div>'}
        </div>
      </div>

      <div class="group" style="background:#fff;margin:0">
        <div class="group-h"><span class="ch">▼</span>Мои пациенты по стадиям</div>
        <div style="padding:14px 16px">
          ${STAGES.map(s=>{
            const n = myPts.filter(p=>p.stage===s.id).length;
            const w = myPts.length? Math.round(n/myPts.length*100):0;
            return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <div style="width:110px;font-size:12px;color:#444">${s.name}</div>
              <div style="flex:1;height:18px;background:#F0F0F0;border-radius:2px;position:relative">
                <div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:${s.strip};opacity:.7;border-radius:2px"></div>
              </div>
              <div style="width:40px;text-align:right;font-size:11.5px;font-weight:600">${n}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="group" style="background:#fff;margin:12px 0 0">
      <div class="group-h"><span class="ch">▼</span>Мои метрики за месяц</div>
      <div style="padding:14px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
        <div><div style="font-size:11px;color:#666;text-transform:uppercase">Средний чек</div><div style="font-size:18px;font-weight:700">14 280 ₽</div><div style="font-size:11px;color:var(--green)">+8%</div></div>
        <div><div style="font-size:11px;color:#666;text-transform:uppercase">Конверсия лид→оплата</div><div style="font-size:18px;font-weight:700">42%</div><div style="font-size:11px;color:var(--green)">цель ≥40%</div></div>
        <div><div style="font-size:11px;color:#666;text-transform:uppercase">Время на пациента</div><div style="font-size:18px;font-weight:700">31 мин</div><div style="font-size:11px;color:#888">норма 30-40 мин</div></div>
        <div><div style="font-size:11px;color:#666;text-transform:uppercase">No-show по моим</div><div style="font-size:18px;font-weight:700;color:var(--green)">8%</div><div style="font-size:11px;color:var(--green)">цель &lt;15%</div></div>
      </div>
    </div>
  </div>`;
}

// ============ SCREEN: Аналитика (FR-023) ============
function renderAnalytics(){
  const tab = ST.analyticsTab || 'ltv';
  return `
  <div class="cmdbar">
    <span style="font-weight:700;font-size:13px;display:flex;align-items:center;gap:6px"><i class="ti ti-chart-pie"></i> Аналитика CRM</span>
    <div class="tb-sep"></div>
    <span class="lbl">Период:</span>
    <div class="pick"><input value="01.04.2026 — 18.05.2026" style="width:170px"><div class="b">📅</div></div>
    <button class="tb primary"><i class="ti ti-refresh"></i> Пересчитать</button>
    <div class="grow"></div>
    <button class="tb"><i class="ti ti-file-export"></i> Excel</button>
    <button class="tb"><i class="ti ti-share"></i> Поделиться</button>
  </div>

  <div class="ctabs" style="border-top:none">
    ${[['ltv','LTV по сегментам'],['channels','Каналы привлечения'],['curators','Эффективность кураторов'],['funnel','Конверсия воронки']].map(([k,l])=>`
      <div class="ctab${tab===k?' active':''}" onclick="ST.analyticsTab='${k}';renderAll()">${l}</div>
    `).join('')}
  </div>

  <div style="flex:1;overflow:auto;padding:14px;background:#fff">
    ${tab==='ltv' ? renderAnalyticsLtv() : tab==='channels' ? renderAnalyticsChannels() : tab==='curators' ? renderAnalyticsCurators() : renderAnalyticsFunnel()}
  </div>`;
}
function renderAnalyticsLtv(){
  const seg = [
    {name:'Первичные', n:ST.patients.filter(p=>p.type==='Первичная').length, ltv:14800, color:'#1565C0'},
    {name:'Повторные', n:ST.patients.filter(p=>p.type==='Повторная').length, ltv:42600, color:'#0C6E56'},
    {name:'Реактивированные', n:ST.patients.filter(p=>p.type==='Реактивация').length, ltv:18400, color:'#B7770D'},
  ];
  const maxLtv = Math.max(...seg.map(s=>s.ltv));
  // ABC ltv
  const abcLtv = ABC_SEGMENTS.map(s=>({s, n:ST.patients.filter(p=>p.abc===s.id).length, ltv: {A:84000,B:32000,C:9200,VIP:142000,REA:6400}[s.id]}));
  return `
    <h3 style="margin:0 0 4px;font-size:15px">LTV по сегментам пациентов</h3>
    <div style="color:#666;font-size:12px;margin-bottom:14px">Средний пожизненный доход с пациента, в разрезе типа и ABC-сегмента</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px">
      <div class="group" style="margin:0">
        <div class="group-h"><span class="ch">▼</span>По типу пациента</div>
        <div style="padding:14px 16px">
          ${seg.map(s=>{const w=Math.round(s.ltv/maxLtv*100);return `<div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:3px"><b>${s.name}</b> <span style="color:#666">${s.n} пац. · <b style="color:#222">${fmt(s.ltv)} ₽</b></span></div>
            <div style="height:22px;background:#F0F0F0;border-radius:2px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:${s.color};opacity:.8;border-radius:2px"></div></div>
          </div>`;}).join('')}
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border-light);font-size:12px;color:#444">
            <b>Цель за 6 мес:</b> LTV реактивированных ≥80% от первичных (текущий показатель: <b style="color:var(--amber-border)">124% — перевыполнен</b>)
          </div>
        </div>
      </div>
      <div class="group" style="margin:0">
        <div class="group-h"><span class="ch">▼</span>По ABC-сегменту</div>
        <div style="padding:14px 16px">
          ${abcLtv.map(a=>{const w=Math.round(a.ltv/142000*100);return `<div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:3px"><span>${pillForAbc(a.s.id)} <span style="color:#666">${a.s.desc}</span></span> <span><b>${a.n} пац. · ${fmt(a.ltv)} ₽</b></span></div>
            <div style="height:18px;background:#F0F0F0;border-radius:2px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:${abcColor(a.s.id)};opacity:.7;border-radius:2px"></div></div>
          </div>`;}).join('')}
        </div>
      </div>
    </div>

    <div class="group" style="margin:0">
      <div class="group-h"><span class="ch">▼</span>Динамика LTV по месяцам (последние 6 мес)</div>
      <div style="padding:14px 16px">
        <div style="display:flex;align-items:flex-end;gap:8px;height:160px;border-bottom:1px solid #ddd;padding-bottom:4px">
          ${[12400,13800,14200,15600,16800,18200].map((v,i)=>{const h=Math.round(v/18200*140);const m=['Дек','Янв','Фев','Мар','Апр','Май'][i];return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end">
              <div style="font-size:10px;color:#666;margin-bottom:3px">${fmtCompact(v)}</div>
              <div style="width:80%;height:${h}px;background:linear-gradient(to top,#1565C0,#4A8FE0);border-radius:2px 2px 0 0"></div>
              <div style="font-size:11px;color:#666;margin-top:4px">${m}</div>
            </div>`;}).join('')}
        </div>
        <div style="font-size:11.5px;color:var(--green);text-align:right;margin-top:6px">▲ +47% за полгода</div>
      </div>
    </div>
  `;
}
function renderAnalyticsChannels(){
  const ch = [
    {name:'Сайт', leads:48, conv:42, avgCheck:14200, cpl:1200, cls:'p-blue'},
    {name:'Рекомендация', leads:32, conv:68, avgCheck:18600, cpl:0, cls:'p-green'},
    {name:'WhatsApp', leads:24, conv:55, avgCheck:12400, cpl:340, cls:'p-teal'},
    {name:'Реклама', leads:38, conv:28, avgCheck:11200, cpl:2800, cls:'p-amber'},
    {name:'Звонок', leads:18, conv:48, avgCheck:13800, cpl:820, cls:'p-purple'},
  ];
  return `
    <h3 style="margin:0 0 4px;font-size:15px">Эффективность каналов привлечения</h3>
    <div style="color:#666;font-size:12px;margin-bottom:14px">CPL · конверсия · средний чек по источнику обращения · последние 6 нед.</div>
    <table class="t" style="margin:0">
      <colgroup><col style="width:160px"><col style="width:90px"><col style="width:auto"><col style="width:100px"><col style="width:120px"><col style="width:100px"><col style="width:80px"></colgroup>
      <thead><tr><th>Канал</th><th>Обращений</th><th>Конверсия</th><th>Ср. чек</th><th>CPL</th><th>Выручка</th><th>ROI</th></tr></thead>
      <tbody>
        ${ch.map(c=>{const rev=c.leads*c.conv/100*c.avgCheck;const cost=c.leads*c.cpl;const roi=cost?Math.round((rev-cost)/cost*100):0;return `<tr>
          <td><span class="pill ${c.cls}">${c.name}</span></td>
          <td style="text-align:center"><b>${c.leads}</b></td>
          <td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:14px;background:#F0F0F0;border-radius:2px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${c.conv}%;background:#1A6B30;opacity:.7;border-radius:2px"></div></div><b style="width:38px;text-align:right">${c.conv}%</b></div></td>
          <td style="text-align:right">${fmt(c.avgCheck)} ₽</td>
          <td style="text-align:right;${c.cpl>2000?'color:var(--red)':''}">${c.cpl?fmt(c.cpl)+' ₽':'—'}</td>
          <td style="text-align:right;font-weight:600">${fmt(rev)} ₽</td>
          <td style="text-align:right;color:${roi>200?'var(--green)':roi>50?'#222':'var(--red)'};font-weight:700">${cost?roi+'%':'∞'}</td>
        </tr>`;}).join('')}
      </tbody>
    </table>
    <div style="margin-top:10px;font-size:12px;color:#666;background:#F4F8FC;border:1px solid #D6E2EF;padding:10px 14px;border-radius:2px">
      <i class="ti ti-bulb" style="color:#7a5500"></i> <b>Рекомендация:</b> канал «Реклама» имеет CPL ${fmt(2800)} ₽ и конверсию 28% — рассмотреть перераспределение бюджета в «Рекомендации» (CPL=0, конв. 68%) через реферальную программу (FR Фаза 3).
    </div>
  `;
}
function renderAnalyticsCurators(){
  return `
    <h3 style="margin:0 0 4px;font-size:15px">Эффективность кураторов</h3>
    <div style="color:#666;font-size:12px;margin-bottom:14px">% выполнения задач · конверсия дожима · средний чек · время на пациента</div>
    <table class="t" style="margin:0">
      <colgroup><col style="width:200px"><col style="width:90px"><col style="width:auto"><col style="width:110px"><col style="width:110px"><col style="width:110px"><col style="width:110px"></colgroup>
      <thead><tr><th>Куратор</th><th>Пац.</th><th>% выполн. задач</th><th>Конв. дожима</th><th>Ср. чек</th><th>Время/пац.</th><th>Бонус</th></tr></thead>
      <tbody>
        ${CURATORS.map((c,i)=>{const pts=ST.patients.filter(p=>p.curatorId===c.id).length;const perf=[92,88,79][i];const conv=[34,28,22][i];const avg=[15800,13400,12200][i];const time=[28,32,38][i];const bonus=[42000,32000,18000][i];return `<tr>
          <td><span class="dot" style="background:${c.dot}"></span><b>${c.name}</b><div style="font-size:10px;color:#888;margin-left:13px">${c.full}</div></td>
          <td style="text-align:center"><b>${pts}</b></td>
          <td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:14px;background:#F0F0F0;border-radius:2px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${perf}%;background:${perf>=90?'#1A6B30':perf>=80?'#B7770D':'#C0392B'};opacity:.7;border-radius:2px"></div></div><b style="width:38px;text-align:right;color:${perf>=90?'var(--green)':perf>=80?'#222':'var(--red)'}">${perf}%</b></div></td>
          <td style="text-align:right;color:${conv>=25?'var(--green)':'#222'};font-weight:600">${conv}%</td>
          <td style="text-align:right">${fmt(avg)} ₽</td>
          <td style="text-align:right">${time} мин</td>
          <td style="text-align:right;font-weight:600">${fmt(bonus)} ₽</td>
        </tr>`;}).join('')}
      </tbody>
    </table>
    <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="group" style="margin:0">
        <div class="group-h"><span class="ch">▼</span>Топ-результаты месяца</div>
        <div style="padding:14px 16px;font-size:12.5px;line-height:1.7">
          🥇 <b>Аникина С.В.</b> — лучшая конверсия дожима <b style="color:var(--green)">34%</b><br>
          🥈 <b>Романова М.П.</b> — лучший средний чек <b>13 400 ₽</b><br>
          🥉 <b>Горбунов В.К.</b> — самый быстрый по приёмам (38 мин/пац)
        </div>
      </div>
      <div class="group" style="margin:0">
        <div class="group-h"><span class="ch">▼</span>Зоны роста</div>
        <div style="padding:14px 16px;font-size:12.5px;line-height:1.7;color:#444">
          ⚠ <b>Горбунов В.К.</b> — % выполнения 79% (цель ≥85%) → обучение по приоритизации<br>
          ⚠ Средняя конверсия дожима 28% (цель ≥35% на 6 мес)<br>
          ⚠ Время на пациента у двух кураторов выше нормы 30 мин
        </div>
      </div>
    </div>
  `;
}
function renderAnalyticsFunnel(){
  const stages = [
    {n:'Обращение',     v:120, color:'#808080'},
    {n:'Запись создана',v:96,  color:'#1565C0'},
    {n:'Визит',         v:78,  color:'#1565C0'},
    {n:'Приём',         v:72,  color:'#1A7A3A'},
    {n:'Предложение',   v:54,  color:'#0C6E56'},
    {n:'Частичная',     v:42,  color:'#B7770D'},
    {n:'Полная оплата', v:38,  color:'#0C6E56'},
    {n:'Лечение',       v:36,  color:'#1565C0'},
    {n:'Финал',         v:32,  color:'#6A3FAA'},
  ];
  const max = stages[0].v;
  return `
    <h3 style="margin:0 0 4px;font-size:15px">Конверсия воронки по 9 стадиям (FR-003)</h3>
    <div style="color:#666;font-size:12px;margin-bottom:18px">Шаги воронки и потери на каждом этапе. За период: 01.04.26 — 18.05.26</div>
    <div style="max-width:780px">
      ${stages.map((s,i)=>{const w=Math.round(s.v/max*100);const prev=i?stages[i-1].v:s.v;const conv=Math.round(s.v/prev*100);return `
        <div style="margin-bottom:6px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:130px;font-size:12.5px;color:#333;font-weight:600">${s.n}</div>
            <div style="flex:1;height:32px;background:#F0F0F0;border-radius:2px;position:relative">
              <div style="position:absolute;left:0;top:0;bottom:0;width:${w}%;background:${s.color};opacity:.85;border-radius:2px"></div>
              <div style="position:absolute;left:10px;top:8px;color:${w>20?'#fff':'#333'};font-weight:700;font-size:13px">${s.v}</div>
            </div>
            <div style="width:80px;text-align:right;font-size:11.5px;color:#666">${conv}% от пред.</div>
            <div style="width:80px;text-align:right;font-size:11.5px;color:#888">${Math.round(s.v/max*100)}% от верх.</div>
          </div>
        </div>`;}).join('')}
    </div>
    <div style="margin-top:18px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      <div class="kpi-card"><div class="kpi-k">Общая конверсия</div><div class="kpi-v" style="color:var(--green)">26,7%</div><div class="kpi-s">Обращение → Финал</div></div>
      <div class="kpi-card"><div class="kpi-k">Узкое место</div><div class="kpi-v" style="color:var(--red)">Запись → Визит</div><div class="kpi-s">81% · потеря 18 пац.</div></div>
      <div class="kpi-card"><div class="kpi-k">Конверсия оплаты</div><div class="kpi-v">70%</div><div class="kpi-s">Предложение → Частичная</div></div>
    </div>
  `;
}

// ============ SCREEN: Замещения (FR-014) ============
function renderSubstitutions(){
  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="addSubstitution()"><i class="ti ti-plus"></i> Создать замещение</button>
    <button class="tb"><i class="ti ti-history"></i> История</button>
    <div class="grow"></div>
    <span style="font-size:12px;color:#666">FR-014 · Замещение в отпуске · ответственность за пациента сохраняется</span>
  </div>

  <div style="background:var(--blue-soft);border-bottom:1px solid var(--blue-border);padding:8px 14px;font-size:12px;color:var(--blue);display:flex;align-items:center;gap:8px">
    <i class="ti ti-info-circle"></i>
    <span>Перед уходом куратора в отпуск назначьте замещающего. Задачи периода видны замещающему; <b>ответственный остаётся прежним</b> (для KPI и бонусов).</span>
  </div>

  <div style="flex:1;overflow:auto;padding:14px;background:#fff">
    <div class="group" style="margin:0 0 12px">
      <div class="group-h"><span class="ch">▼</span>Активные замещения · ${(ST.substitutions||[]).filter(s=>!s.archived).length}</div>
      ${(ST.substitutions||[]).filter(s=>!s.archived).length ? `<table class="t" style="margin:0">
        <colgroup><col style="width:auto"><col style="width:200px"><col style="width:200px"><col style="width:150px"><col style="width:140px"><col style="width:80px"></colgroup>
        <thead><tr><th>Куратор (в отпуске)</th><th>Замещающий</th><th>Период</th><th>Причина</th><th>Задач передано</th><th></th></tr></thead>
        <tbody>
          ${(ST.substitutions||[]).filter(s=>!s.archived).map((s,i)=>{const a=curatorOf(s.whoId);const b=curatorOf(s.byId);const cnt=ST.tasks.filter(t=>t.curatorId===s.whoId&&!t.done).length;return `<tr>
            <td><span class="dot" style="background:${a.dot}"></span><b>${a.full}</b></td>
            <td><span class="dot" style="background:${b.dot}"></span>${b.full}</td>
            <td>${s.from} — ${s.to}</td>
            <td>${s.reason}</td>
            <td style="text-align:center"><span class="pill p-blue">${cnt}</span></td>
            <td><button class="tb" onclick="endSubstitution(${i})" style="height:20px;font-size:11px"><i class="ti ti-x"></i></button></td>
          </tr>`;}).join('')}
        </tbody>
      </table>` : '<div style="padding:30px;text-align:center;color:#999">— активных замещений нет —</div>'}
    </div>

    <div class="group" style="margin:0 0 12px">
      <div class="group-h"><span class="ch">▼</span>Автоперераспределение при увольнении (FR-015)</div>
      <div style="padding:14px 16px;font-size:12.5px">
        <div style="margin-bottom:10px">При деактивации аккаунта куратора система автоматически перераспределит его открытые заказы между активными кураторами с учётом нагрузки. Приоритет: <b>ВИП / иногородние</b> — на опытных кураторов, <b>новые</b> — на менее загруженных.</div>
        <div style="display:flex;gap:8px;align-items:center;background:#FFF8E1;border:1px solid #E8C840;padding:10px 14px;border-radius:2px">
          <i class="ti ti-alert-triangle" style="color:#7a5500;font-size:18px"></i>
          <div style="flex:1">Деактивация аккаунта <b>безвозвратна</b> — задачи и заказы будут переназначены автоматически. Метрики прежнего куратора сохранятся в истории.</div>
          <button class="tb" onclick="showDeactivationModal()"><i class="ti ti-user-x"></i> Деактивировать куратора…</button>
        </div>
      </div>
    </div>
  </div>`;
}
ST.substitutions = ST.substitutions || [
  { whoId:1, byId:0, from:'15.05.26', to:'22.05.26', reason:'отпуск', archived:false },
];
function addSubstitution(){
  const newSub = { whoId:2, byId:0, from:'01.06.26', to:'10.06.26', reason:'отпуск', archived:false };
  ST.substitutions.push(newSub);
  toast('Замещение создано: '+curatorOf(newSub.whoId).name+' → '+curatorOf(newSub.byId).name, 'ok');
  renderAll();
}
function endSubstitution(idx){
  if (ST.substitutions[idx]){ ST.substitutions[idx].archived = true; toast('Замещение завершено','info'); renderAll(); }
}

// ============ SCREEN: Напоминания пациентам до визита (FR-021) ============
function renderReminders(){
  // Generate scheduled reminders for upcoming visits
  const reminders = [];
  ST.patients.forEach(p=>{
    if (p.nextContact && p.nextContact!=='—'){
      const channel = p.source==='WhatsApp'?'WhatsApp':p.source==='звонок'?'Звонок':p.geo==='иногородний'?'WhatsApp':'SMS';
      reminders.push({pid:p.id, p, when:'за 1 день · '+p.nextContact+' 09:00', channel, template:'pre_visit_'+(p.format||'визит'), status:Math.random()>.3?'queued':'sent'});
    }
  });

  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="toast('Расписание пересобрано','ok')"><i class="ti ti-refresh"></i> Пересобрать расписание</button>
    <button class="tb"><i class="ti ti-template"></i> Шаблоны</button>
    <button class="tb"><i class="ti ti-settings"></i> Настройки авто-отправки</button>
    <div class="grow"></div>
    <span style="font-size:12px;color:#666">FR-021 · Автонапоминания пациентам · цель no-show &lt;10%</span>
  </div>

  <div style="background:#FFFEF0;border-bottom:1px solid #E8C840;padding:8px 14px;font-size:12px;color:#7a5500;display:flex;align-items:center;gap:8px">
    <i class="ti ti-clock"></i>
    <span>Авто-уведомления отправляются за <b>24 часа</b> до визита через предпочтительный канал. При спец-назначениях (анализы, МРТ) добавляются инструкции из шаблона.</span>
  </div>

  <div style="display:grid;grid-template-columns:1fr 380px;gap:0;flex:1;min-height:0">
    <div style="overflow:auto;min-height:0">
      <table class="t" style="margin:0">
        <colgroup><col style="width:auto"><col style="width:150px"><col style="width:170px"><col style="width:100px"><col style="width:160px"><col style="width:100px"></colgroup>
        <thead><tr><th>Пациент</th><th>Дата визита</th><th>Когда отправить</th><th>Канал</th><th>Шаблон</th><th>Статус</th></tr></thead>
        <tbody>
          ${reminders.length? reminders.map(r=>`<tr>
            <td><a class="lk" onclick="openDealCard('${r.pid}')">${r.p.name}</a> ${pillForAbc(r.p.abc)}</td>
            <td>${r.p.nextContact}</td>
            <td>${r.when}</td>
            <td><i class="ti ti-${r.channel==='WhatsApp'?'brand-whatsapp':r.channel==='Звонок'?'phone':'message'}" style="color:#666"></i> ${r.channel}</td>
            <td><code style="font-size:11px;color:#666">${r.template}</code></td>
            <td>${r.status==='sent'?'<span class="pill p-green">отправлено</span>':'<span class="pill p-blue">в очереди</span>'}</td>
          </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:#999;padding:30px">— нет запланированных напоминаний —</td></tr>'}
        </tbody>
      </table>
    </div>
    <div style="border-left:1px solid var(--border-light);padding:14px;background:#FAFAFA;overflow:auto">
      <div style="font-weight:700;font-size:13px;margin-bottom:8px">Превью шаблона <code style="font-size:11px">pre_visit_визит</code></div>
      <div style="background:#fff;border:1px solid var(--border-light);padding:12px;font-size:12.5px;line-height:1.5;font-family:Arial">
        <div style="color:#666;margin-bottom:6px">📱 WhatsApp · ${new Date().toLocaleDateString('ru-RU')}</div>
        Здравствуйте, {ФИО пациента}!<br><br>
        Напоминаем о вашем визите в Институт Движения завтра, {дата} в {время}.<br><br>
        📍 {Адрес клиники}<br>
        👨‍⚕️ Врач: {ФИО врача}<br>
        🎫 Заказ: {Номер заказа}<br><br>
        Если планы изменились — ответьте на это сообщение или позвоните: {Телефон}.<br><br>
        Хорошего дня! ☀️<br>
        <span style="color:#999;font-size:11px">— Институт Движения</span>
      </div>
      <div style="margin-top:14px;font-weight:700;font-size:13px;margin-bottom:8px">Метрики</div>
      <div style="font-size:12.5px;line-height:1.7">
        Отправлено за неделю: <b>147</b><br>
        Прочитано: <b style="color:var(--green)">132 (90%)</b><br>
        Перенесли визит: <b>11</b><br>
        No-show: <b style="color:var(--green)">8 (5,4%)</b>
      </div>
    </div>
  </div>`;
}

// ============ SCREEN: Справочник источников (FR-020) ============
function renderSources(){
  const sources = [
    {name:'Сайт',          group:'Digital',  active:true,  utm:'utm_source=site',          leads:48, conv:42, cpl:1200},
    {name:'Рекомендация',  group:'Organic',  active:true,  utm:'',                          leads:32, conv:68, cpl:0},
    {name:'WhatsApp',      group:'Messenger',active:true,  utm:'utm_source=whatsapp',      leads:24, conv:55, cpl:340},
    {name:'Реклама',       group:'Paid',     active:true,  utm:'utm_source=yandex',         leads:38, conv:28, cpl:2800},
    {name:'Звонок',        group:'Inbound',  active:true,  utm:'',                          leads:18, conv:48, cpl:820},
    {name:'Сарафан',       group:'Organic',  active:true,  utm:'',                          leads:14, conv:71, cpl:0},
    {name:'Соцсети — VK',  group:'Social',   active:true,  utm:'utm_source=vk',             leads:9,  conv:32, cpl:1400},
    {name:'Соцсети — TG',  group:'Social',   active:false, utm:'utm_source=tg',             leads:0,  conv:0,  cpl:0},
    {name:'Колл-центр',    group:'Inbound',  active:true,  utm:'',                          leads:11, conv:52, cpl:600},
    {name:'Баннер',        group:'Paid',     active:false, utm:'utm_source=banner',         leads:0,  conv:0,  cpl:0},
  ];
  return `
  <div class="cmdbar">
    <button class="tb primary" onclick="toast('Создание источника (демо)','ok')"><i class="ti ti-plus"></i> Создать</button>
    <button class="tb"><i class="ti ti-edit"></i></button>
    <button class="tb"><i class="ti ti-trash"></i></button>
    <div class="tb-sep"></div>
    <button class="tb"><i class="ti ti-file-import"></i> Импорт UTM-меток</button>
    <div class="grow"></div>
    <span style="font-size:12px;color:#666">FR-020 · Справочник «Источники обращений»</span>
  </div>

  <div class="tablewrap">
    <table class="t">
      <colgroup><col style="width:30px"><col style="width:auto"><col style="width:120px"><col style="width:200px"><col style="width:90px"><col style="width:110px"><col style="width:90px"><col style="width:60px"></colgroup>
      <thead><tr><th></th><th>Источник</th><th>Группа</th><th>UTM-метка</th><th>Обращений</th><th>Конверсия</th><th>CPL</th><th></th></tr></thead>
      <tbody>
        ${sources.map(s=>`<tr style="${!s.active?'opacity:.5':''}">
          <td><input type="checkbox" ${s.active?'checked':''}></td>
          <td><b>${s.name}</b></td>
          <td><span class="pill ${s.group==='Digital'?'p-blue':s.group==='Organic'?'p-green':s.group==='Messenger'?'p-teal':s.group==='Paid'?'p-amber':s.group==='Social'?'p-purple':'p-gray'}">${s.group}</span></td>
          <td><code style="font-size:11px;color:#666">${s.utm||'—'}</code></td>
          <td style="text-align:center">${s.leads}</td>
          <td style="text-align:right">${s.conv}%</td>
          <td style="text-align:right">${s.cpl?fmt(s.cpl)+' ₽':'—'}</td>
          <td><i class="ti ti-dots-vertical" style="color:#888;cursor:pointer"></i></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}
