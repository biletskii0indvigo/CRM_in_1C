// ============================================================
// Δ1 — GAP closure: FR-001 P2.8, FR-004, FR-006, FR-007,
//                    FR-013, FR-015, FR-016, FR-017 P2.4
// ============================================================

// ============ FR-004: pill helpers for age / finance ============
function pillForAge(age){
  const cls = age==='<30'?'p-green':age==='30-50'?'p-blue':age==='50-70'?'p-amber':age==='70+'?'p-red':'p-gray';
  return `<span class="pill ${cls}" title="Возраст: ${age}">${age}</span>`;
}
function pillForFinance(f){
  const map = {'ДМС':{cls:'p-amber',label:'ДМС'},'УМС':{cls:'p-purple',label:'УМС'},'собств':{cls:'p-gray',label:'Собств.'}};
  const m = map[f] || map['собств'];
  return `<span class="pill ${m.cls}" title="Финансирование: ${m.label}">${m.label}</span>`;
}

// ============ FR-007: Триггер +3 рабочих дня ============
function plusBusinessDays(ds, days){
  const m = ds.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
  if (!m) return '';
  let y = parseInt(m[3]); if (y<100) y+=2000;
  const d = new Date(y, parseInt(m[2])-1, parseInt(m[1]));
  let added = 0;
  while (added < days){
    d.setDate(d.getDate()+1);
    const dow = d.getDay();
    if (dow!==0 && dow!==6) added++;
  }
  return ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+String(d.getFullYear()).slice(-2);
}
function trigger3DayTask(orderId){
  const r = orderOf(orderId); if (!r) return;
  const {order:o, patient:p} = r;
  if (o._triggered) { toast('Триггер +3 дня уже был запущен по этому заказу','info'); return; }
  const due = plusBusinessDays('18.05.26', 3);
  const newT = {
    id:'t'+ST.tasks.length, curatorId: p.curatorId ?? 0,
    title: `Связаться с ${p.name.split(' ').slice(0,2).join(' ')} — уточнить решение после первичного приёма`,
    patient:p.name, pid:p.id, orderId: o.id,
    meta: due+' 10:00', urgency:'med', done:false, type:'Авто-задача',
    tags:['+3 дня','звонок','первичный','FR-007'], status:'Запланирована',
    desc:'Автоматический контакт куратора через +3 рабочих дня после первичного приёма. Стандартный регламент Индвиго.'
  };
  ST.tasks.unshift(newT);
  o._triggered = true;
  o.status9 = 'proposed';
  toast(`FR-007 · Авто-задача создана на ${due} · куратор ${curatorOf(newT.curatorId).name}`,'ok');
  renderAll();
}

// ============ FR-016: Симуляция занятия абонемента ============
function abonementVisit(pid){
  const p = patientOf(pid); if (!p || !p.abonement) return;
  if (p.abonement.used >= p.abonement.total){
    toast('Абонемент полностью израсходован — предложите продление','info');
    return;
  }
  p.abonement.used += 1;
  const remaining = p.abonement.total - p.abonement.used;
  if (remaining === 1){
    // Triggered on penultimate visit
    const newT = {
      id:'t'+ST.tasks.length, curatorId: p.curatorId ?? 0,
      title: `Продление абонемента: ${p.name} (осталось ${remaining} занятие)`,
      patient:p.name, pid:p.id, orderId: p.orders?.[0]?.id || null,
      meta:'19.05.26 10:00', urgency:'high', done:false, type:'Авто-задача',
      tags:['абонемент','продление','FR-016'], status:'Открыта',
      desc:'Связаться с пациентом, запланировать приём врача ЛФК, подтвердить динамику, предложить продление абонемента.'
    };
    ST.tasks.unshift(newT);
    toast(`FR-016 · Предпоследнее занятие! Создана авто-задача продления`,'ok');
  } else if (remaining === 0){
    toast(`Абонемент завершён · ${p.abonement.used}/${p.abonement.total}`,'info');
  } else {
    toast(`Занятие отмечено · ${p.abonement.used}/${p.abonement.total}`,'ok');
  }
  renderAll();
}

// ============ FR-006: модалка обязательного комментария при выполнении ============
let _pendingCloseTaskId = null;
function showCloseModal(taskId){
  const t = ST.tasks.find(x=>x.id===taskId); if (!t) return;
  const isOrtho = t.tags.includes('ортопедия') || t.type.includes('Ортопед');
  if (isOrtho){
    // FR-006 exception — orthopedy can close without comment
    t.done = true; t.status = 'Выполнена';
    toast('Задача закрыта (исключение: ортопедия — без комментария)','ok');
    renderAll();
    return;
  }
  _pendingCloseTaskId = taskId;
  const m = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = 'Закрытие задачи · комментарий обязателен';
  document.getElementById('modalBody').innerHTML = `
    <div style="font-size:12.5px;line-height:1.5;margin-bottom:10px">
      <b>Задача:</b> ${t.title}<br>
      <b>Пациент:</b> ${t.patient}
    </div>
    <div style="background:#FFFEF0;border:1px solid #E8C840;padding:8px 12px;font-size:11.5px;color:#7a5500;margin-bottom:10px;border-radius:2px">
      <i class="ti ti-alert-triangle"></i> По FR-006 закрытие задачи без комментария запрещено (исключение — тип «Ортопедия»). Минимум 5 символов.
    </div>
    <textarea id="closeComment" style="width:100%;min-height:100px;border:1px solid var(--border);font:12.5px Arial;padding:6px 8px;resize:vertical;outline:none" placeholder="Опишите результат выполнения задачи (обязательно, мин. 5 символов)…" oninput="document.getElementById('confirmCloseBtn').disabled=this.value.trim().length<5;document.getElementById('confirmCloseBtn').style.opacity=this.value.trim().length<5?.5:1"></textarea>
    <div style="margin-top:8px;font-size:11px;color:#666">Дополнительно (необязательно):</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
      ${['Дозвонился, согласился','Дозвонился, отказ','Не взял трубку','Неверный номер','Перенести +1 день'].map(r=>`<span class="tag" onclick="document.getElementById('closeComment').value=(document.getElementById('closeComment').value?document.getElementById('closeComment').value+' · ':'')+'${r}';document.getElementById('closeComment').dispatchEvent(new Event('input'))">${r}</span>`).join('')}
    </div>
  `;
  // Replace footer buttons
  const f = m.querySelector('.modal-f');
  f.innerHTML = `<button class="tb" onclick="closeModal()">Отмена</button>
    <button class="tb blue" id="confirmCloseBtn" disabled style="opacity:.5" onclick="confirmCloseTask()"><i class="ti ti-check"></i> Закрыть с комментарием</button>`;
  m.classList.add('show');
  setTimeout(()=>document.getElementById('closeComment')?.focus(),50);
}
function confirmCloseTask(){
  const txt = document.getElementById('closeComment')?.value.trim();
  if (!txt || txt.length<5){ toast('Введите минимум 5 символов комментария','err'); return; }
  const t = ST.tasks.find(x=>x.id===_pendingCloseTaskId); if (!t){ closeModal(); return; }
  t.done = true; t.status='Выполнена'; t.desc = txt;
  toast('Задача закрыта · комментарий записан (FR-006)','ok');
  _pendingCloseTaskId = null;
  closeModal();
  // Restore footer
  document.querySelector('#modal .modal-f').innerHTML = `<button class="tb" onclick="closeModal()">Отмена</button><button class="tb primary" onclick="closeModal()">OK</button>`;
  renderAll();
}

// ============ FR-015: Полноценная модалка деактивации куратора ============
function showDeactivationModal(curatorId){
  curatorId = curatorId != null ? curatorId : (ST.curatorOnlyForRole != null ? ST.curatorOnlyForRole : 1);
  const cur = curatorOf(curatorId);
  const myPts = ST.patients.filter(p=>p.curatorId===curatorId);
  const myTasks = ST.tasks.filter(t=>t.curatorId===curatorId && !t.done);
  const others = CURATORS.filter(c=>c.id!==curatorId);

  // FR-015 rules: ВИП/Реанимация → опытным (max курaторов); первичные/иногородние → опытным; новые → менее загруженным
  const loadOf = (cid) => ST.patients.filter(p=>p.curatorId===cid).length;
  const sortedByLoad = others.slice().sort((a,b)=>loadOf(a.id)-loadOf(b.id));
  const experienced = others[0]; // most experienced = first

  // Pre-compute redistribution
  const dist = myPts.map(p=>{
    let target;
    if (p.abc==='VIP' || p.abc==='REA' || p.geo==='иногородний'){
      target = experienced;
    } else if (p.type==='Первичная'){
      target = sortedByLoad[0];
    } else {
      target = sortedByLoad[0];
    }
    return { p, target };
  });
  // Counts per target
  const counts = {};
  dist.forEach(d=>{ counts[d.target.id] = (counts[d.target.id]||0)+1; });

  const m = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = `FR-015 · Деактивация куратора: ${cur.full}`;
  // Make wider modal
  m.querySelector('.modal').style.width = '720px';
  document.getElementById('modalBody').innerHTML = `
    <div style="background:var(--red-bg);border:1px solid var(--red-border);padding:10px 14px;border-radius:2px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
      <i class="ti ti-alert-triangle" style="color:var(--red);font-size:20px"></i>
      <div style="flex:1;font-size:12.5px">
        <b>Внимание!</b> Деактивация безвозвратна. ${myPts.length} пациентов и ${myTasks.length} активных задач будут переназначены автоматически.
        Метрики и история ${cur.full} сохранятся.
      </div>
    </div>

    <div style="font-weight:700;font-size:12.5px;margin-bottom:6px">Правила перераспределения:</div>
    <ul style="font-size:12px;color:#444;margin:0 0 12px;padding-left:22px;line-height:1.5">
      <li><b>ВИП / Реанимация / Иногородние</b> → передаются <b>опытному</b> куратору (с макс. сроком работы)</li>
      <li><b>Первичные / новые</b> → передаются <b>менее загруженному</b> куратору</li>
      <li><b>Повторные / реактивированные</b> → балансировка по нагрузке</li>
    </ul>

    <div style="font-weight:700;font-size:12.5px;margin-bottom:6px">Предпросмотр распределения ${myPts.length} пациентов:</div>
    <div style="max-height:240px;overflow:auto;border:1px solid var(--border-light)">
      <table class="t" style="margin:0">
        <colgroup><col style="width:auto"><col style="width:60px"><col style="width:90px"><col style="width:200px"><col style="width:120px"></colgroup>
        <thead><tr><th>Пациент</th><th>ABC</th><th>Гео</th><th>→ Новый куратор</th><th>Причина</th></tr></thead>
        <tbody>
          ${dist.map(d=>`<tr>
            <td>${d.p.name}</td>
            <td style="text-align:center">${pillForAbc(d.p.abc)}</td>
            <td style="font-size:11px">${d.p.geo}</td>
            <td><span class="dot" style="background:${d.target.dot}"></span>${d.target.name}</td>
            <td style="font-size:11px;color:#666">${d.p.abc==='VIP'||d.p.abc==='REA'?'ВИП/Реанимация':d.p.geo==='иногородний'?'Иногородний':d.p.type==='Первичная'?'Новый':'Балансировка'}</td>
          </tr>`).join('')||'<tr><td colspan="5" style="padding:14px;text-align:center;color:#999">— пациентов нет —</td></tr>'}
        </tbody>
      </table>
    </div>

    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
      ${Object.entries(counts).map(([cid,n])=>{const c=curatorOf(parseInt(cid));return `<div style="background:#F4F8FC;border:1px solid #D6E2EF;padding:6px 12px;border-radius:14px;font-size:12px"><span class="dot" style="background:${c.dot}"></span><b>${c.name}</b>: получит <b>${n}</b> пац.</div>`;}).join('')}
    </div>

    <div style="margin-top:12px;font-size:11.5px;color:#888"><i class="ti ti-info-circle"></i> После подтверждения уведомления получат все 2 куратора. Журнал деактивации сохранится в Аудите.</div>
  `;
  const f = m.querySelector('.modal-f');
  f.innerHTML = `<button class="tb" onclick="closeModal();document.querySelector('#modal .modal').style.width='520px'">Отмена</button>
    <button class="tb" style="background:var(--red);color:#fff;border-color:#8a2a20" onclick="confirmDeactivate(${curatorId})"><i class="ti ti-user-x"></i> Деактивировать и распределить</button>`;
  m.classList.add('show');
}
function confirmDeactivate(curatorId){
  const cur = curatorOf(curatorId);
  const myPts = ST.patients.filter(p=>p.curatorId===curatorId);
  const others = CURATORS.filter(c=>c.id!==curatorId);
  const loadOf = (cid) => ST.patients.filter(p=>p.curatorId===cid).length;

  myPts.forEach(p=>{
    let target;
    const sortedByLoad = others.slice().sort((a,b)=>loadOf(a.id)-loadOf(b.id));
    if (p.abc==='VIP'||p.abc==='REA'||p.geo==='иногородний') target = others[0];
    else target = sortedByLoad[0];
    if (!p.curatorHistory.includes(target.id)) p.curatorHistory.push(target.id);
    p.curatorId = target.id;
  });
  ST.tasks.filter(t=>t.curatorId===curatorId && !t.done).forEach(t=>{
    const p = patientOf(t.pid);
    if (p) t.curatorId = p.curatorId;
  });
  closeModal();
  document.querySelector('#modal .modal').style.width='520px';
  document.querySelector('#modal .modal-f').innerHTML = `<button class="tb" onclick="closeModal()">Отмена</button><button class="tb primary" onclick="closeModal()">OK</button>`;
  toast(`FR-015 · ${cur.full} деактивирован · ${myPts.length} пациентов перераспределено`,'ok');
  renderAll();
}

// ============ FR-001 P2.8: лимит 2 куратора ============
function tryChangeCurator(pid, newCurId){
  const p = patientOf(pid); if (!p) return false;
  if (newCurId === '' || newCurId == null){
    p.curatorId = null;
    toast('Куратор снят','info');
    renderAll();
    return true;
  }
  newCurId = parseInt(newCurId);
  if (p.curatorId === newCurId){ return true; }
  // Check if already in history
  if (!p.curatorHistory.includes(newCurId)){
    const uniqHistory = p.curatorHistory.filter(c=>c!=null);
    if (uniqHistory.length >= 2){
      // Block
      const m = document.getElementById('modal');
      document.getElementById('modalTitle').textContent = 'FR-001 P2.8 · Лимит кураторов';
      document.getElementById('modalBody').innerHTML = `
        <div style="background:var(--red-bg);border:1px solid var(--red-border);padding:12px 16px;border-radius:2px;margin-bottom:10px;display:flex;align-items:center;gap:10px">
          <i class="ti ti-alert-triangle" style="color:var(--red);font-size:22px"></i>
          <div style="flex:1;font-size:13px">
            <b>Превышен лимит:</b> пациент уже работал с 2 кураторами максимум.
          </div>
        </div>
        <div style="font-size:12.5px;line-height:1.6">
          <b>Пациент:</b> ${p.name}<br>
          <b>Текущий куратор:</b> ${p.curatorId!=null?curatorOf(p.curatorId).full:'— нет —'}<br>
          <b>История кураторов:</b><br>
          ${uniqHistory.map(c=>`&nbsp;&nbsp;• ${curatorOf(c).full}`).join('<br>')}<br>
          <b>Запрошенный новый:</b> <span style="color:var(--red)">${curatorOf(newCurId).full}</span>
        </div>
        <div style="margin-top:12px;font-size:11.5px;color:#666">
          <i class="ti ti-info-circle"></i> По FR-001 P2.8 один пациент не может работать более чем с 2 кураторами для сохранения преемственности. Эскалируйте РОП — он может разрешить исключение.
        </div>
      `;
      document.querySelector('#modal .modal-f').innerHTML = `<button class="tb" onclick="closeModal()">Понятно</button><button class="tb blue" onclick="forceChangeCuratorByRop('${pid}',${newCurId})">Эскалировать РОП</button>`;
      m.classList.add('show');
      return false;
    }
  }
  // Allow
  if (!p.curatorHistory.includes(newCurId)) p.curatorHistory.push(newCurId);
  p.curatorId = newCurId;
  toast(`Куратор изменён: ${curatorOf(newCurId).name}`,'ok');
  renderAll();
  return true;
}
function forceChangeCuratorByRop(pid, newCurId){
  const p = patientOf(pid); if (!p) return;
  if (!p.curatorHistory.includes(newCurId)) p.curatorHistory.push(newCurId);
  p.curatorId = newCurId;
  closeModal();
  toast('РОП одобрил исключение · куратор изменён','ok');
  renderAll();
}

// ============ Wire abonement + workflow buttons into existing screens ============
// Patch: render abonement controls + Δ1 attributes into patient card via DOM hook
function delta1_renderAbonementControls(p){
  if (!p.abonement) return '';
  const rem = p.abonement.total - p.abonement.used;
  return `<div style="background:#FFF8E1;border:1px solid #E8C840;padding:10px 14px;border-radius:2px;margin:10px 0;display:flex;align-items:center;gap:10px">
    <i class="ti ti-ticket" style="color:#7a5500;font-size:22px"></i>
    <div style="flex:1">
      <div style="font-weight:700;font-size:13px">Абонемент · занятий ${p.abonement.used} из ${p.abonement.total}</div>
      <div style="font-size:11.5px;color:#7a5500">Осталось <b>${rem}</b> · ${rem===1?'<span style="color:var(--red)">⚠ Предпоследнее — авто-задача продления создастся при отметке</span>':rem<=3?'скоро завершение':'в работе'}</div>
      <div style="height:8px;background:#fff;border:1px solid #D9C66B;border-radius:4px;margin-top:5px;position:relative;overflow:hidden">
        <div style="position:absolute;left:0;top:0;bottom:0;width:${Math.round(p.abonement.used/p.abonement.total*100)}%;background:linear-gradient(to right,#1A6B30,#B7770D);"></div>
      </div>
    </div>
    <button class="tb primary" onclick="abonementVisit('${p.id}')"><i class="ti ti-circle-check"></i> Отметить занятие</button>
  </div>`;
}

// ============ FR-013: load counter for morning planning lanes ============
// Норма куратора: 8 часов / 35 минут на пациента ≈ 14 пациентов в день
const NORM_MINUTES_PER_PATIENT = 35;
const NORM_DAY_MINUTES = 8*60;
function curatorLoadHtml(curatorId){
  const list = ST.patients.filter(p=>p.curatorId===curatorId);
  const mins = list.length * NORM_MINUTES_PER_PATIENT;
  const hours = (mins/60).toFixed(1);
  const pct = Math.min(100, Math.round(mins/NORM_DAY_MINUTES*100));
  const over = mins > NORM_DAY_MINUTES;
  return `<div style="display:flex;align-items:center;gap:6px;margin-left:8px;font-size:11px;${over?'color:var(--red);font-weight:700':'color:#666'}">
    <i class="ti ti-clock" style="font-size:13px"></i>
    <span><b>${hours} ч</b> / 8 ч норма</span>
    <div style="width:80px;height:6px;background:#E0E0E0;border-radius:3px;position:relative;overflow:hidden">
      <div style="position:absolute;left:0;top:0;bottom:0;width:${pct}%;background:${over?'var(--red)':pct>80?'#B7770D':'#1A6B30'}"></div>
    </div>
    ${over?'<span class="pill p-red" style="font-size:9px">перегрузка</span>':''}
  </div>`;
}

// ============ Inject Δ1 columns into Patients list ============
// Called from renderDeals via a hook
function delta1_extraRowCells(p){
  return `<td style="text-align:center">${pillForAge(p.ageCat)}</td><td style="text-align:center">${pillForFinance(p.finance)}</td>`;
}

// ============ FR-017 P2.4: МРТ в динамике badge for orders ============
function dynamicMrtBadge(o){
  if (!o.isDynamicMRT) return '';
  return ` <span class="pill p-purple" title="FR-017 P2.4: исключён из текущей конверсии воронки"><i class="ti ti-activity"></i> МРТ в динамике</span>`;
}

console.log('Δ1 module loaded · FR-001/004/006/007/013/015/016/017 P2 patches available');
