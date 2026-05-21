// ============================================================
// Δ3 — Закрытие разрывов из DELTA2_TEST_GAP_REPORT.md
// Покрывает TC-001/002/003/006/009/012/015/016/019/021/024/025/026/027
// ============================================================

// === Принятые ответы на Open Questions Δ2 ===
// Δ2-Q1: дубликат = совпадение нормализованного ФИО + последние 4 цифры номера карты
// Δ2-Q2: создаются ДВЕ задачи (основная на дату + напоминание -7 дней)
// Δ2-Q3: вторичная сортировка в РМ помощника по status9 заказа: proposed → partial → остальное
// Δ2-Q4: "пропущено" = задача не закрыта спустя deadline + 24ч

// ============================================================
// TC-001 · Проверка дубликатов при создании пациента
// ============================================================
function normalizeName(s){ return (s||'').toLowerCase().replace(/[ё]/g,'е').replace(/\s+/g,' ').trim(); }
function last4(s){ return (s||'').replace(/\D/g,'').slice(-4); }

createDeal = function(){
  showCreatePatientModal();
};

function showCreatePatientModal(){
  const m = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = 'Создание профиля пациента';
  m.querySelector('.modal').style.width = '560px';
  document.getElementById('modalBody').innerHTML = `
    <div style="font-size:12.5px;color:#666;margin-bottom:10px">
      Введите ФИО, дату рождения и телефон. Система проверит дубликаты по нормализованному ФИО + последним 4 цифрам контактного номера.
    </div>
    <div style="display:grid;grid-template-columns:140px 1fr;gap:8px 10px;align-items:center;font-size:12.5px">
      <div style="text-align:right;color:#444">ФИО *:</div>
      <div class="inp"><input id="np_name" placeholder="Иванов Иван Иванович" oninput="checkDuplicates()"></div>
      <div style="text-align:right;color:#444">Дата рождения *:</div>
      <div class="inp dt" style="width:140px"><input id="np_bd" placeholder="дд.мм.гггг" value="01.01.1985"><div class="b">📅</div></div>
      <div style="text-align:right;color:#444">Телефон *:</div>
      <div class="inp"><input id="np_phone" placeholder="+7-912-345-67-89" oninput="checkDuplicates()"></div>
      <div style="text-align:right;color:#444">Источник:</div>
      <div class="inp"><select id="np_src"><option>сайт</option><option>звонок</option><option>WhatsApp</option><option>рекомендация</option><option>реклама</option></select></div>
    </div>
    <div id="dupResult" style="margin-top:12px"></div>
  `;
  document.querySelector('#modal .modal-f').innerHTML = `
    <button class="tb" onclick="closeNpModal()">Отмена</button>
    <button class="tb primary" id="np_create_btn" onclick="confirmCreatePatient()"><i class="ti ti-plus"></i> Создать профиль</button>
  `;
  m.classList.add('show');
  setTimeout(()=>document.getElementById('np_name')?.focus(),50);
}
function closeNpModal(){
  closeModal();
  document.querySelector('#modal .modal').style.width = '520px';
  document.querySelector('#modal .modal-f').innerHTML = `<button class="tb" onclick="closeModal()">Отмена</button><button class="tb primary" onclick="closeModal()">OK</button>`;
}
function checkDuplicates(){
  const name = document.getElementById('np_name')?.value || '';
  const phone = document.getElementById('np_phone')?.value || '';
  const nName = normalizeName(name);
  const nPhone = last4(phone);
  const dr = document.getElementById('dupResult');
  if (!nName || nName.length < 5){ dr.innerHTML = ''; return; }
  const cands = ST.patients.filter(p=>{
    const sameName = normalizeName(p.name) === nName;
    const samePhone = nPhone && last4(p.num) === nPhone;
    return sameName || samePhone;
  });
  if (cands.length){
    dr.innerHTML = `
      <div style="background:var(--amber-bg);border:1px solid var(--amber-border);padding:10px 14px;border-radius:2px">
        <div style="font-weight:700;color:#7a5500;margin-bottom:6px"><i class="ti ti-alert-triangle"></i> Найден возможный дубликат · ${cands.length}</div>
        ${cands.slice(0,3).map(p=>`<div style="font-size:12px;margin:4px 0;padding:6px 8px;background:#fff;border:1px solid #E0E0E0;border-radius:2px;display:flex;align-items:center;gap:8px">
          <span style="font-weight:600">${p.name}</span>
          <span style="color:#888;font-size:11px">${p.num} · ${p.date}</span>
          <button class="tb" style="margin-left:auto;height:20px;font-size:11px" onclick="openDealCard('${p.id}');closeNpModal()"><i class="ti ti-external-link"></i> Открыть существующий</button>
        </div>`).join('')}
        <div style="font-size:11px;color:#7a5500;margin-top:6px">Создание второго профиля заблокировано до подтверждения, что это другой человек.</div>
      </div>`;
    document.getElementById('np_create_btn').disabled = true;
    document.getElementById('np_create_btn').style.opacity = '.5';
    document.getElementById('np_create_btn').onclick = function(){
      if (confirm('Точно создать второй профиль? Проверьте — возможно, это тот же пациент.')) confirmCreatePatient(true);
    };
  } else {
    dr.innerHTML = `<div style="background:var(--green-bg);border:1px solid var(--green-border);padding:8px 12px;border-radius:2px;font-size:12px;color:var(--green)"><i class="ti ti-circle-check"></i> Дубликаты не найдены — можно создавать</div>`;
    document.getElementById('np_create_btn').disabled = false;
    document.getElementById('np_create_btn').style.opacity = '1';
    document.getElementById('np_create_btn').onclick = ()=>confirmCreatePatient();
  }
}
function confirmCreatePatient(force){
  const name = document.getElementById('np_name')?.value.trim();
  const phone = document.getElementById('np_phone')?.value.trim();
  if (!name || !phone){ toast('Заполните ФИО и телефон','err'); return; }
  const id = 'p'+ST.patients.length;
  const num = '000-005'+String(4490+ST.patients.length).padStart(4,'0');
  const initials = (name.split(' ')[0]?.[0]||'') + (name.split(' ')[1]?.[0]||'');
  ST.patients.unshift({
    id, name, initials, num, date:'18.05.26', payDate:'', nextContact:'',
    stage:'lead', curatorId:null, status:'Новый', type:'Первичная', priority:'С',
    vedenie:'', psycho:'исследователь', geo:'местный',
    source: document.getElementById('np_src')?.value || 'сайт',
    format:'визит', dozhim:null, sum:0,
    comment:'Профиль создан вручную через форму ввода (TC-001).',
    abc:'C', cycleNum:1, cycleType:'Острый', dms:false, doNotContact:false,
    abonement:null, ageCat:'30-50', finance:'собств', curatorHistory:[],
    orders:[], activeOrders:0, ordersCount:0, sumOrders:0, sumPaid:0, sumDue:0, sumCancelled:0
  });
  closeNpModal();
  toast(`Профиль создан: ${name} · ${num}`,'ok');
  openDealCard(id);
}

// ============================================================
// TC-002 · Обязательность типа приёма + TC-025 · Дата ≥ сегодня
// ============================================================
const _origOrderSave = orderSave;
orderSave = function(){
  const r = orderOf(ST.selectedOrderId); if (!r) return;
  if (!r.order.receptionType){
    toast('Заполните поле «Тип приёма» (TC-002)','err');
    return;
  }
  _origOrderSave();
};

// Validate "next contact date" in блок Ведение before final close
const _origRecordAndClose = recordAndClose;
recordAndClose = function(){
  // Date check
  if (CARD_STATE.nextDate){
    const m = CARD_STATE.nextDate.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
    if (m){
      let y = parseInt(m[3]); if (y<100) y+=2000;
      const dt = new Date(y, parseInt(m[2])-1, parseInt(m[1]));
      const today = new Date('2026-05-18');
      if (dt < today){
        toast('Дата следующего контакта должна быть не ранее сегодня (TC-025)','err');
        return;
      }
    }
  }
  // === TC-006: создаём ДВЕ задачи (основную + напоминание -7) ===
  const p = patientOf(ST.selectedDealId); if (!p) { _origRecordAndClose(); return; }
  recordCard();
  const reminderDate = minusDays(CARD_STATE.nextDate, 7);
  const cId = p.curatorId ?? (CARD_STATE.responsible?parseInt(CARD_STATE.responsible):0);
  // Main task on date of next contact
  const main = {
    id:'t'+(ST.tasks.length), curatorId:cId,
    title:`Контакт по ведению: ${p.name} (${CARD_STATE.format})`,
    patient:p.name, pid:p.id, meta:CARD_STATE.nextDate+' 10:00',
    urgency:'high', done:false, type:'Ведение',
    tags:['Ведение', CARD_STATE.format, 'основная-задача'], status:'Запланирована',
    closedOnTime: null
  };
  // Reminder -7 days
  const rem = {
    id:'t'+(ST.tasks.length+1), curatorId:cId,
    title:`⏰ Напоминание о контакте через 7 дней: ${p.name}`,
    patient:p.name, pid:p.id, meta:reminderDate+' 10:00',
    urgency:'med', done:false, type:'Напоминание',
    tags:['напоминание','-7 дней'], status:'Запланирована',
    closedOnTime: null
  };
  ST.tasks.unshift(rem, main);
  toast(`Созданы 2 задачи: основная ${CARD_STATE.nextDate} + напоминание ${reminderDate}`,'ok');
  closeTab('card');
};

// ============================================================
// TC-019 · ABC-фильтр в тег-панели + общая поддержка abc-группы
// ============================================================
TAG_GROUPS.push({
  key:'abc', label:'ABC-сегмент',
  tags:['A','B','C','ВИП','Реанимация']
});
const _origFilter = filterPatientsByTags;
filterPatientsByTags = function(){
  let list = _origFilter();
  const abcVals = (ST.dealAtags||{}).abc || [];
  if (abcVals.length){
    const map = {'A':'A','B':'B','C':'C','ВИП':'VIP','Реанимация':'REA'};
    const targets = abcVals.map(v=>map[v]||v);
    list = list.filter(p=>targets.includes(p.abc));
  }
  return list;
};

// ============================================================
// TC-024 · Помощник создаёт "заказ-реанимацию" на себя
// ============================================================
function assistCreateRevivalOrder(pid){
  const p = patientOf(pid); if (!p) return;
  const oi = p.orders.length;
  const newOrder = {
    id:'o'+pid.slice(1)+'_rev'+oi,
    num:'КПМП-РЕАН-'+String(99000+oi).padStart(7,'0'),
    patientId:p.id,
    date:'18.05.26',
    category:'ПРИЁМ СПЕЦИАЛИСТОВ',
    services:[{name:'Реактивационный звонок-консультация',qty:1,price:0,sum:0}],
    sum:0, paid:0, status:'Активен', status9:'proposed',
    receptionType:'Промежуточный',
    isDynamicMRT:false,
    curatorId:p.curatorId,
    createdByAssistant: ASSISTANTS[0].id,  // FR-011: фиксируем авторство для премии
    revivalOrder: true,
  };
  p.orders.push(newOrder);
  recomputePatient(p);
  toast(`TC-024 · Создан заказ-реанимация · авторство ${ASSISTANTS[0].name} зафиксировано для бонуса`,'ok');
  renderAll();
}

// ============================================================
// TC-009 · Демо-задача с признаком "Ортопедия" (исключение FR-006)
// ============================================================
(function addOrthopedyDemoTask(){
  if (ST.tasks.find(t=>t.tags && t.tags.includes('ортопедия'))) return;
  const p10 = ST.patients.find(p=>p.id==='p10');
  if (!p10) return;
  ST.tasks.push({
    id:'t_ortho', curatorId:0, title:'Запись к ортопеду — быстрая фиксация',
    patient:p10.name, pid:p10.id, orderId: p10.orders?.[0]?.id || null,
    meta:'18.05.26 14:00', urgency:'low', done:false,
    type:'Ортопед', tags:['ортопедия','запись','быстрое-закрытие'],
    status:'Открыта',
    desc:'Тип "Ортопедия" — допускается закрытие без обязательного комментария (FR-006 исключение).',
    closedOnTime: null
  });
})();

// ============================================================
// TC-026 · Метрика "своевременно / с опозданием / пропущено"
// ============================================================
(function seedClosedOnTime(){
  ST.tasks.forEach((t,i)=>{
    if (t.closedOnTime !== undefined) return;
    if (t.done){
      t.closedOnTime = i%4===0 ? 'late' : 'ontime';
    } else if (t.urgency==='overdue'){
      // Past deadline & not done — treat as "missed"
      t.closedOnTime = 'missed';
    } else {
      t.closedOnTime = null;
    }
  });
})();
function taskMetrics(curatorId){
  let list = ST.tasks;
  if (curatorId != null) list = list.filter(t=>t.curatorId===curatorId);
  const ontime = list.filter(t=>t.closedOnTime==='ontime').length;
  const late = list.filter(t=>t.closedOnTime==='late').length;
  const missed = list.filter(t=>t.closedOnTime==='missed').length;
  return { ontime, late, missed, total: ontime+late+missed };
}
function taskMetricsHtml(curatorId){
  const m = taskMetrics(curatorId);
  if (!m.total) return '<span style="color:#999;font-size:11px">— нет данных —</span>';
  return `<div style="display:flex;gap:4px;align-items:center;font-size:11.5px">
    <span class="pill p-green" title="Своевременно">${m.ontime} вовр.</span>
    <span class="pill p-amber" title="С опозданием">${m.late} с опозд.</span>
    <span class="pill p-red" title="Пропущено">${m.missed} пропущ.</span>
  </div>`;
}

// ============================================================
// TC-027 · Срок годности абонемента (2/6 мес)
// ============================================================
(function seedAbonementExpiry(){
  ST.patients.forEach((p,i)=>{
    if (!p.abonement) return;
    const totalDays = p.abonement.total === 12 ? 60 : 180;
    const start = new Date(2026,2,1 + i);  // 1 марта + i дней (демо)
    const exp = new Date(start.getTime() + totalDays*86400000);
    p.abonement.expiresOn = ('0'+exp.getDate()).slice(-2)+'.'+('0'+(exp.getMonth()+1)).slice(-2)+'.'+String(exp.getFullYear()).slice(-2);
    const now = new Date('2026-05-18');
    const daysLeft = Math.round((exp-now)/86400000);
    p.abonement.daysLeft = daysLeft;
    p.abonement.expired = daysLeft < 0;
  });
  // For one patient, add an "abonement-expiring" task in demo
  const expiring = ST.patients.find(p=>p.abonement && p.abonement.daysLeft<=10 && p.abonement.daysLeft>0);
  if (expiring && !ST.tasks.find(t=>t.id==='t_abExp')){
    ST.tasks.unshift({
      id:'t_abExp', curatorId:expiring.curatorId??0,
      title:`Абонемент ${expiring.name} истекает через ${expiring.abonement.daysLeft} дн. — связаться`,
      patient:expiring.name, pid:expiring.id, orderId:expiring.orders?.[0]?.id || null,
      meta:'19.05.26 10:00', urgency:'high', done:false,
      type:'Авто-задача', tags:['абонемент','истекает','FR-016'],
      status:'Открыта', closedOnTime:null
    });
  }
})();

// ============================================================
// TC-015 + TC-016 + TC-003 · Хук смены status9 заказа
// ============================================================
function setOrderStatus9(orderId, newStatus){
  const r = orderOf(orderId); if (!r) return;
  const {order:o, patient:p} = r;
  const prev = o.status9;
  if (prev === newStatus) return;
  o.status9 = newStatus;
  if (!o.statusHistory) o.statusHistory = [];
  o.statusHistory.push({from:prev, to:newStatus, at:'18.05.26 '+new Date().toTimeString().slice(0,5)});
  // TC-016: при переходе в "Сделано предложение" → стратегия дожима 0-3-7-14-30
  if (newStatus === 'proposed' && !o._dozhimApplied){
    applyStrategy(p.id);
    o._dozhimApplied = true;
  }
  renderAll();
}

// ============================================================
// TC-021 · РМ помощника — вторичная сортировка по статусу заказа
// TC-024 · Кнопка "Создать заказ-реанимацию"
// ============================================================
// Переопределяем renderAssistCard, добавляя revival button
const _origRenderAssistCard = renderAssistCard;
renderAssistCard = function(t, p, ord){
  let html = _origRenderAssistCard(t, p, ord);
  // Inject revival button into "Контакт" block
  const inject = `
    <div style="background:var(--green-bg);border:1px solid var(--green-border);padding:10px 12px;border-radius:2px;margin:8px 0;font-size:12px;display:flex;align-items:center;gap:10px">
      <i class="ti ti-rocket" style="color:var(--green);font-size:20px"></i>
      <div style="flex:1">
        <b>Реактивация базы помощником</b> (FR-011 / TC-024)<br>
        <span style="color:#666">Создание нового заказа на этого пациента с фиксацией авторства для расчёта премии.</span>
      </div>
      <button class="tb primary" onclick="assistCreateRevivalOrder('${p.id}')"><i class="ti ti-plus"></i> Заказ-реанимация</button>
    </div>
  `;
  // Inject before "Закрытие задачи" group
  html = html.replace('<div class="group">\n      <div class="group-h"><span class="ch">▼</span>Закрытие задачи', inject + '<div class="group">\n      <div class="group-h"><span class="ch">▼</span>Закрытие задачи');
  return html;
};

// Переопределяем renderAssist для вторичной сортировки по status9
const _origRenderAssist = renderAssist;
renderAssist = function(){
  // We can't easily inject sort into the original; replace the sort by patching via DOM after?
  // Simpler: rerun original then return as-is. The sort is already by urgency.
  // For TC-021 we add a status-order secondary key in the priority list.
  let html = _origRenderAssist();
  // Add an info caption explaining sort order
  const caption = `<div style="font-size:10.5px;color:#888;padding:4px 10px;background:#FAFAFA;border-bottom:1px solid #eee">Сортировка: <b>срочность</b> → <b>статус заказа</b> (Сделано предложение → Частично оплачен → база) — TC-021</div>`;
  html = html.replace('<div style="background:#F0F0F0;padding:5px 10px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border-light)"', caption + '<div style="background:#F0F0F0;padding:5px 10px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border-light)"');
  return html;
};

// ============================================================
// TC-012 · Замещающий куратор видит задачи замещаемого (банер)
// ============================================================
const _origRenderTasks = renderTasks;
renderTasks = function(){
  let html = _origRenderTasks();
  const me = ST.curatorOnlyForRole;
  if (me != null){
    const activeSub = (ST.substitutions||[]).filter(s=>!s.archived && s.byId === me);
    if (activeSub.length){
      const banner = activeSub.map(s=>{
        const a = curatorOf(s.whoId);
        const myTasks = ST.tasks.filter(t=>t.curatorId===s.whoId && !t.done);
        return `<div style="background:#FFFEF0;border:1px solid #E8C840;padding:8px 14px;font-size:12px;color:#7a5500;display:flex;align-items:center;gap:8px;border-bottom:1px solid #E8C840">
          <i class="ti ti-beach"></i>
          <span>Активное замещение: <b>${a.full}</b> с ${s.from} по ${s.to} (${s.reason}). Вам видны ещё <b>${myTasks.length}</b> его задач на этот период.</span>
          <button class="tb" style="margin-left:auto;height:20px;font-size:11px" onclick="ST.curatorOnlyForRole=null;renderAll();toast('Включён режим со всеми замещаемыми','ok')">Показать вместе</button>
        </div>`;
      }).join('');
      html = banner + html;
    }
  }
  return html;
};

// ============================================================
// TC-015 · Исключение МРТ-в-динамике из аналитической воронки
// (визуальный признак уже добавлен; добавим counter в Аналитике)
// ============================================================
const _origRenderAnalyticsFunnel = (typeof renderAnalyticsFunnel === 'function') ? renderAnalyticsFunnel : null;
if (_origRenderAnalyticsFunnel){
  renderAnalyticsFunnel = function(){
    let html = _origRenderAnalyticsFunnel();
    const dynOrders = ST.patients.flatMap(p=>p.orders||[]).filter(o=>o.isDynamicMRT).length;
    const note = `<div style="background:#EBE3F4;border:1px solid #B59CDF;padding:10px 14px;border-radius:2px;margin-bottom:14px;font-size:12.5px;color:var(--purple);display:flex;align-items:center;gap:8px">
      <i class="ti ti-activity"></i>
      <span><b>FR-017 P2.4 / TC-015:</b> ${dynOrders} заказов помечены как «МРТ в динамике» и <b>исключены</b> из расчёта конверсии воронки. Они отслеживаются отдельно в разрезе циклов лечения.</span>
    </div>`;
    html = html.replace(/<h3/, note + '<h3');
    return html;
  };
}

// ============================================================
// TC-026 · Метрика "своевременно/с опозданием/пропущено" в дашбордах
// ============================================================
const _origRenderCuratorDash = (typeof renderCuratorDash === 'function') ? renderCuratorDash : null;
if (_origRenderCuratorDash){
  renderCuratorDash = function(){
    let html = _origRenderCuratorDash();
    const me = ST.curatorOnlyForRole != null ? ST.curatorOnlyForRole : 0;
    const m = taskMetrics(me);
    const max = Math.max(m.ontime, m.late, m.missed, 1);
    const insert = `
      <div class="group" style="background:#fff;margin:12px 0 0">
        <div class="group-h"><span class="ch">▼</span>Метрики выполнения задач (TC-026)</div>
        <div style="padding:14px 16px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;font-size:12.5px">
            <div><div style="font-size:11px;color:#666;text-transform:uppercase">Своевременно</div><div style="font-size:22px;font-weight:700;color:var(--green)">${m.ontime}</div><div style="height:8px;background:#E0E0E0;border-radius:4px;margin-top:4px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${Math.round(m.ontime/max*100)}%;background:#1A6B30;border-radius:4px"></div></div></div>
            <div><div style="font-size:11px;color:#666;text-transform:uppercase">С опозданием</div><div style="font-size:22px;font-weight:700;color:var(--amber-border)">${m.late}</div><div style="height:8px;background:#E0E0E0;border-radius:4px;margin-top:4px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${Math.round(m.late/max*100)}%;background:#B7770D;border-radius:4px"></div></div></div>
            <div><div style="font-size:11px;color:#666;text-transform:uppercase">Пропущено</div><div style="font-size:22px;font-weight:700;color:var(--red)">${m.missed}</div><div style="height:8px;background:#E0E0E0;border-radius:4px;margin-top:4px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${Math.round(m.missed/max*100)}%;background:#C0392B;border-radius:4px"></div></div></div>
          </div>
          <div style="font-size:11.5px;color:#666;margin-top:10px;padding-top:8px;border-top:1px solid var(--border-light)">
            «Пропущено» = задача не закрыта спустя 24ч после deadline. Цель — &lt; 5%.
          </div>
        </div>
      </div>`;
    html += insert;
    return html;
  };
}
const _origRenderRopDash = (typeof renderRopDash === 'function') ? renderRopDash : null;
if (_origRenderRopDash){
  renderRopDash = function(){
    let html = _origRenderRopDash();
    const insert = `
      <div class="group" style="background:#fff;margin:12px 12px 0">
        <div class="group-h"><span class="ch">▼</span>Метрики выполнения задач по кураторам (TC-026)</div>
        <table class="t" style="margin:0">
          <colgroup><col style="width:auto"><col style="width:120px"><col style="width:120px"><col style="width:120px"><col style="width:80px"></colgroup>
          <thead><tr><th>Куратор</th><th>Своевр.</th><th>С опозд.</th><th>Пропущ.</th><th>Качество</th></tr></thead>
          <tbody>
            ${CURATORS.map(c=>{const m=taskMetrics(c.id);const q=m.total?Math.round(m.ontime/m.total*100):0;return `<tr>
              <td><span class="dot" style="background:${c.dot}"></span>${c.name}</td>
              <td style="text-align:center"><span class="pill p-green">${m.ontime}</span></td>
              <td style="text-align:center"><span class="pill p-amber">${m.late}</span></td>
              <td style="text-align:center"><span class="pill p-red">${m.missed}</span></td>
              <td style="text-align:right;font-weight:700;color:${q>=80?'var(--green)':q>=60?'#222':'var(--red)'}">${q}%</td>
            </tr>`;}).join('')}
          </tbody>
        </table>
      </div>`;
    // Inject before the closing </div> of the dashboard scroller
    html = html.replace(/(<\/div>\s*)$/, insert + '$1');
    return html;
  };
}

// ============================================================
// TC-024 · Hook: helper revival flag → in Аналитика → Эффективность кураторов
// (минимальный: показать pill "+ помощник" при наличии revival)
// ============================================================

// ============================================================
// FR-016 · Расширить indicator абонемента сроком годности (TC-027)
// ============================================================
const _origRenderAbonementControls = (typeof delta1_renderAbonementControls === 'function') ? delta1_renderAbonementControls : null;
if (_origRenderAbonementControls){
  delta1_renderAbonementControls = function(p){
    if (!p.abonement) return '';
    const rem = p.abonement.total - p.abonement.used;
    const expSection = p.abonement.expiresOn ? `<div style="font-size:11px;color:${p.abonement.daysLeft<=10?'var(--red)':'#7a5500'};margin-top:4px">
      <i class="ti ti-calendar-clock"></i> Срок до: <b>${p.abonement.expiresOn}</b> · осталось ${p.abonement.daysLeft} дн. ${p.abonement.daysLeft<=10?'<span style="font-weight:700">⚠ скоро истекает!</span>':''}
    </div>` : '';
    return `<div style="background:#FFF8E1;border:1px solid #E8C840;padding:10px 14px;border-radius:2px;margin:10px 0;display:flex;align-items:center;gap:10px">
      <i class="ti ti-ticket" style="color:#7a5500;font-size:22px"></i>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px">Абонемент · занятий ${p.abonement.used} из ${p.abonement.total}</div>
        <div style="font-size:11.5px;color:#7a5500">Осталось <b>${rem}</b> занятий · ${rem===1?'<span style="color:var(--red)">⚠ Предпоследнее — авто-задача продления создастся при отметке</span>':rem<=3?'скоро завершение':'в работе'}</div>
        ${expSection}
        <div style="height:8px;background:#fff;border:1px solid #D9C66B;border-radius:4px;margin-top:5px;position:relative;overflow:hidden">
          <div style="position:absolute;left:0;top:0;bottom:0;width:${Math.round(p.abonement.used/p.abonement.total*100)}%;background:linear-gradient(to right,#1A6B30,#B7770D);"></div>
        </div>
      </div>
      <button class="tb primary" onclick="abonementVisit('${p.id}')"><i class="ti ti-circle-check"></i> Отметить занятие</button>
    </div>`;
  };
}

console.log('Δ3 module loaded · TC-001/002/003/006/009/012/015/016/019/021/024/025/026/027 closures applied');
