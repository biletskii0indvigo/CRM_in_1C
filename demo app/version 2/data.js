// ============ DEMO DATA ============
const CURATORS = [
  { id: 0, name: 'Аникина С.В.',  full: 'Аникина Светлана Вячеславовна', short: 'АС', dot: '#1565C0', role:'curator' },
  { id: 1, name: 'Романова М.П.', full: 'Романова Марина Петровна',       short: 'РМ', dot: '#1A7A3A', role:'curator' },
  { id: 2, name: 'Горбунов В.К.', full: 'Горбунов Виктор Кириллович',     short: 'ГВ', dot: '#6A3FAA', role:'curator' },
];
// ============ ПОМОЩНИКИ КУРАТОРОВ (новая роль по ТЗ v0.1.0) ============
const ASSISTANTS = [
  { id:10, name:'Иванова Н.А.',  full:'Иванова Наталья Андреевна', short:'ИН', dot:'#9E9E9E', role:'assist', forCuratorId:0 },
  { id:11, name:'Сергеев Д.К.',  full:'Сергеев Дмитрий Константинович', short:'СД', dot:'#9E9E9E', role:'assist', forCuratorId:1 },
];
// Замещения (отпуск/больничный)
const SUBSTITUTIONS = [
  // { whoId:1, byId:0, from:'15.05.26', to:'22.05.26', reason:'отпуск' }
];

const STAGES = [
  { id:'lead',      name:'Лид',           strip:'#808080' },
  { id:'booked',    name:'Записан',       strip:'#1565C0' },
  { id:'treatment', name:'В лечении',     strip:'#1565C0' },
  { id:'final',     name:'Финальная',     strip:'#0C6E56' },
  { id:'waiting',   name:'Ожидание',      strip:'#6A3FAA' },
  { id:'react',     name:'Реактивация',   strip:'#B7770D' },
];

// ============ 9 СТАТУСОВ ВОРОНКИ ЗАКАЗА (по ТЗ v0.1.0) ============
const ORDER_STATUSES_9 = [
  { id:'new',           name:'Новый',                cls:'p-gray' },
  { id:'proposed',      name:'Сделано предложение',  cls:'p-blue' },
  { id:'partial',       name:'Оплачено частично',    cls:'p-amber' },
  { id:'paid',          name:'Оплачено полностью',   cls:'p-green' },
  { id:'inprogress',    name:'В работе',             cls:'p-blue' },
  { id:'final-pending', name:'Ожидает финалки',      cls:'p-amber' },
  { id:'completed',     name:'Завершён',             cls:'p-teal' },
  { id:'rejected',      name:'Отказ',                cls:'p-red' },
  { id:'cancelled',     name:'Отменён',              cls:'p-red' },
];
const statusOf9 = (id)=>ORDER_STATUSES_9.find(s=>s.id===id) || ORDER_STATUSES_9[0];

// ============ 4 ТИПА ПРИЁМА ============
const RECEPTION_TYPES = ['Первичный','Повторный','Промежуточный','Финальный'];

// ============ ABC-СЕГМЕНТАЦИЯ ============
const ABC_SEGMENTS = [
  { id:'A',   name:'A',         desc:'Топ 20% — высокий LTV',     cls:'p-green'  },
  { id:'B',   name:'B',         desc:'Средний LTV',                cls:'p-amber'  },
  { id:'C',   name:'C',         desc:'Низкий LTV',                 cls:'p-gray'   },
  { id:'VIP', name:'ВИП',       desc:'Особый сервис',              cls:'p-purple' },
  { id:'REA', name:'Реанимация',desc:'Срочное удержание',          cls:'p-red'    },
];
const abcOf = (id)=>ABC_SEGMENTS.find(s=>s.id===id) || ABC_SEGMENTS[2];

// ============ ТИПЫ ЦИКЛА ЛЕЧЕНИЯ ============
const CYCLE_TYPES = ['Острый','Хронический','Профилактический','Реабилитационный'];

// ============ ДОЖИМ 0-3-7-14-30 ============
const DOZHIM_STAGES = ['день 0','день 3','день 7','день 14','день 30','эскалация'];

// Patients / deals (22)
const PATIENTS_RAW = [
  ['Лютина Екатерина Сергеевна','000-0054396','03.03.26','03.03.26','10.03.26','final',null,'Отказ','Первичная','С','Контрольный визит','тревожный','местный','звонок','визит','день 3',5440,'Курс ЛФК завершён, на ведение не записалась.'],
  ['Смирнова Ольга Петровна','000-0054402','04.03.26','08.03.26','11.03.26','treatment',0,'В работе','Первичная','А','Контрольный визит','решительный','местный','сайт','визит','день 0',32500,'Курс реабилитации после операции на колене.'],
  ['Кузнецов Андрей Викторович','000-0054411','04.03.26','06.03.26','09.03.26','booked',0,'Новый','Первичная','А','—','исследователь','иногородний','рекомендация','диагностика',null,18200,'Запись на МРТ + консультацию ортопеда.'],
  ['Зайцева Марина Владимировна','000-0054415','05.03.26','09.03.26','12.03.26','final',1,'Выполнен','Повторная','В','Поддерживающее лечение','экономный','местный','WhatsApp','процедура','день 0',12800,'Окончен курс массажа. Запись на физио через 3 мес.'],
  ['Орлов Дмитрий Алексеевич','000-0054419','05.03.26','—','06.03.26','lead',null,'Новый','Первичная','С','—','тревожный','местный','реклама','визит',null,0,'Не дозвонились, второй контакт назначен.'],
  ['Беляева Анна Игоревна','000-0054423','05.03.26','11.03.26','12.03.26','final',2,'Ожидание','Первичная','А','Контроль диагностики','решительный','иногородний','рекомендация','диагностика','день 3',9600,'Контроль МРТ через 6 месяцев.'],
  ['Соколов Кирилл Максимович','000-0054428','06.03.26','—','—','react',2,'Реактивация','Реактивация','В','Поддерживающее лечение','экономный','местный','звонок','процедура','эскалация',7300,'Не появлялся 9 мес. Скидка 10% активирована.'],
  ['Иванов Михаил Сергеевич','000-0054433','06.03.26','06.03.26','13.03.26','treatment',1,'В работе','Первичная','А','—','решительный','местный','сайт','визит',null,28400,'Реабилитация после травмы плеча.'],
  ['Фёдорова Татьяна Юрьевна','000-0054436','07.03.26','12.03.26','14.03.26','final',1,'Выполнен','Первичная','В','Комбинированное','тревожный','иногородний','рекомендация','диагностика','день 0',21500,'План: визит + процедура каждые 3 недели.'],
  ['Поляков Артём Владимирович','000-0054441','07.03.26','—','08.03.26','booked',null,'Новый','Первичная','С','—','исследователь','местный','сайт','визит',null,0,'Запись через сайт, ждёт подтверждения.'],
  ['Никитина Лариса Олеговна','000-0054445','07.03.26','13.03.26','15.03.26','final',0,'В работе','Повторная','А','Поддерживающее лечение','решительный','местный','WhatsApp','процедура','день 0',14700,'Поддерживающие сеансы — пн/чт.'],
  ['Романовский Игорь Петрович','000-0054449','08.03.26','—','09.03.26','lead',null,'Новый','Первичная','В','—','тревожный','иногородний','реклама','визит',null,0,'Перезвонить после 10:00.'],
  ['Симонова Юлия Андреевна','000-0054452','08.03.26','08.03.26','14.03.26','treatment',2,'В работе','Первичная','А','—','решительный','местный','рекомендация','процедура',null,19800,'Курс физиопроцедур — 10 сеансов.'],
  ['Тихонов Валерий Михайлович','000-0054456','09.03.26','15.03.26','17.03.26','final',null,'Отказ','Первичная','С','Контрольный визит','экономный','местный','звонок','визит','день 7',6200,'Отказался от продолжения. Эскалация РОП.'],
  ['Журавлёва Светлана Ивановна','000-0054461','09.03.26','—','10.03.26','booked',1,'Новый','Повторная','В','—','исследователь','местный','WhatsApp','визит',null,0,'Возврат через 4 мес после первого курса.'],
  ['Алексеев Павел Геннадьевич','000-0054466','09.03.26','11.03.26','13.03.26','treatment',0,'В работе','Первичная','А','—','решительный','иногородний','сайт','диагностика',null,24600,'Иногородний — оплата 100% авансом.'],
  ['Богданова Виктория Аркадьевна','000-0054470','10.03.26','15.03.26','16.03.26','final',2,'Выполнен','Первичная','В','Контрольный визит','тревожный','местный','рекомендация','визит','день 3',8900,'Контроль через 3 месяца — забронировать.'],
  ['Чернов Степан Владимирович','000-0054473','10.03.26','—','11.03.26','lead',null,'Новый','Первичная','С','—','экономный','местный','реклама','визит',null,0,'Запрос с лендинга по акции «Весна-2026».'],
  ['Лебедева Алёна Сергеевна','000-0054477','10.03.26','16.03.26','18.03.26','waiting',0,'Ожидание','Повторная','А','Поддерживающее лечение','решительный','местный','звонок','процедура','день 0',16400,'Пауза 2 недели по согласованию.'],
  ['Григорьев Олег Викторович','000-0054481','11.03.26','12.03.26','19.03.26','treatment',2,'В работе','Первичная','А','—','исследователь','местный','сайт','визит',null,31200,'Комплексная программа «Спина-про».'],
  ['Маркова Дарья Александровна','000-0054485','11.03.26','—','12.03.26','booked',1,'Новый','Первичная','В','—','тревожный','иногородний','WhatsApp','диагностика',null,0,'УЗИ суставов + консультация.'],
  ['Соловьёв Антон Эдуардович','000-0054489','12.03.26','17.03.26','20.03.26','final',null,'Выполнен','Первичная','С','Комбинированное','решительный','местный','рекомендация','процедура','день 3',13800,'Финал курса. Назначено: ЛФК + физио.'],
];
const initials = (n)=>{const p=n.split(' ');return (p[0]?.[0]||'')+(p[1]?.[0]||'')};
// Deterministic ABC/cycle distribution by index
const _ABC_DIST = ['A','B','C','A','C','VIP','REA','A','B','C','A','C','A','REA','B','A','B','C','B','A','B','VIP'];
const _CYC_TYPE = ['Острый','Хронический','Острый','Реабилитационный','Острый','Хронический','Реабилитационный','Острый','Острый','Острый','Хронический','Острый','Острый','Острый','Хронический','Острый','Профилактический','Острый','Хронический','Острый','Острый','Реабилитационный'];
const _CYC_NUM  = [1,1,1,2,1,1,3,1,1,1,2,1,1,2,2,1,1,1,2,1,1,1];
const _DMS      = [false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,true,false];
const _DO_NOT_CONTACT = [false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false];

const _AGE      = ['30-50','50-70','<30','30-50','70+','30-50','50-70','<30','30-50','<30','50-70','30-50','<30','70+','50-70','30-50','<30','50-70','30-50','30-50','<30','50-70'];
const _FIN      = ['собств','собств','ДМС','УМС','собств','собств','собств','собств','ДМС','собств','собств','собств','собств','собств','собств','ДМС','собств','собств','собств','собств','ДМС','собств'];
// Some patients have already changed curators — track history (max 2 per FR-001/P2.8)
const _CUR_HIST = [[null],[0],[0],[1],[null],[2],[2,1],[1],[1],[null],[0],[null],[2],[null],[1],[0],[2],[null],[0],[2],[1],[null]];

const PATIENTS = PATIENTS_RAW.map((r,i)=>({
  id:'p'+i, name:r[0], initials:initials(r[0]), num:r[1], date:r[2], payDate:r[3], nextContact:r[4],
  stage:r[5], curatorId:r[6], status:r[7], type:r[8], priority:r[9],
  vedenie:r[10]||'', psycho:r[11], geo:r[12], source:r[13], format:r[14], dozhim:r[15],
  sum:r[16], comment:r[17],
  abc: _ABC_DIST[i] || 'C',
  cycleNum: _CYC_NUM[i] || 1,
  cycleType: _CYC_TYPE[i] || 'Острый',
  dms: _DMS[i] || false,
  doNotContact: _DO_NOT_CONTACT[i] || false,
  abonement: i%5===0 ? { total:10, used: 6+(i%4) } : null,
  // === Δ1 поля ===
  ageCat: _AGE[i] || '30-50',             // FR-004: возрастная категория
  finance: _FIN[i] || 'собств',           // FR-004: ДМС / УМС / собств
  curatorHistory: _CUR_HIST[i] || [],     // FR-001 P2.8: история кураторов (макс 2)
  orders: [],
}));

// ============ ORDERS (Заказы) per patient ============
const SERVICE_POOL = [
  ['МРТ',                       ['МРТ поясничного отдела позвоночника',6800],['МРТ коленного сустава',5400],['МРТ головного мозга',7200]],
  ['ПРИЁМ СПЕЦИАЛИСТОВ',        ['Приём ортопеда-травматолога первичный',2800],['Приём невролога первичный',2600],['Приём ревматолога повторный',2300],['Приём остеопата первичный',3400],['Приём мануального терапевта',3100]],
  ['УЗ-ДИАГНОСТИКА',            ['УЗИ коленного сустава',1800],['УЗИ плечевого сустава',1800],['УЗИ мягких тканей',1500]],
  ['ФИЗИОТЕРАПИЯ',              ['Магнитотерапия (1 сеанс)',850],['УВТ (1 сеанс)',1900],['Электрофорез (1 сеанс)',650]],
  ['РЕАБИЛИТАЦИЯ',              ['Занятие ЛФК с инструктором',2100],['Курс ЛФК 12 занятий',22800],['Кинезиотейпирование',1200]],
  ['ПРОЦЕДУРЫ',                 ['Лечебный массаж спины (1 сеанс)',2200],['Внутрисуставная инъекция',4800],['Блокада паравертебральная',3600]],
  ['ЛАБОРАТОРИЯ',               ['Биохимия крови (расширенная)',2890],['Общий анализ крови',490],['Взятие крови из вены',350]],
  ['ДИАГНОСТИКА',               ['Денситометрия',3800],['Биомеханический анализ ходьбы',4500],['ЭНМГ верхних конечностей',4200]],
];
const ORDER_STATUSES = ['Активен','Активен','Активен','Оплачен','Активен','Частично оплачен','Отменён'];
// Deterministic pseudo-random
let _seed = 7919;
function _rnd(){ _seed = (_seed*9301+49297) % 233280; return _seed/233280; }
function _pick(arr){ return arr[Math.floor(_rnd()*arr.length)]; }

PATIENTS.forEach((p,pi)=>{
  // 1-3 orders per patient. Patients with sum=0 get 0-1 (just inquiry) orders
  const nOrders = p.sum===0 ? (pi%2===0?0:1) : (pi%3===0?3:pi%2===0?2:1);
  let remaining = p.sum || (5000 + (pi*1313)%18000);
  for (let oi=0; oi<nOrders; oi++){
    const isLast = oi===nOrders-1;
    const orderSum = isLast ? remaining : Math.round(remaining * (0.35 + _rnd()*0.3) / 100)*100;
    remaining -= orderSum;
    // services for this order
    const cat = SERVICE_POOL[(pi+oi)%SERVICE_POOL.length];
    const catName = cat[0];
    const numItems = 1 + Math.floor(_rnd()*3);
    const services = [];
    let svcTotal = 0;
    for (let si=0; si<numItems; si++){
      const svc = cat[1 + Math.floor(_rnd()*(cat.length-1))];
      const qty = (catName==='ФИЗИОТЕРАПИЯ'||catName==='ПРОЦЕДУРЫ') ? (3 + Math.floor(_rnd()*8)) : 1;
      services.push({ name: svc[0], qty, price: svc[1], sum: svc[1]*qty });
      svcTotal += svc[1]*qty;
    }
    // Scale prices proportionally so order sums roughly match
    const scale = orderSum>0 ? orderSum/Math.max(svcTotal,1) : 1;
    services.forEach(s=>{ s.price = Math.round(s.price*scale/10)*10; s.sum = s.price*s.qty; });
    const finalSum = services.reduce((a,s)=>a+s.sum,0);
    // Status
    let status = p.sum===0 ? 'Активен' : ORDER_STATUSES[(pi*3+oi)%ORDER_STATUSES.length];
    if (p.stage==='final' && oi===0) status = 'Оплачен';
    if (p.stage==='lead') status = 'Активен';
    if (p.stage==='waiting') status = oi===0?'Оплачен':'Активен';
    const paid = status==='Оплачен' ? finalSum : status==='Частично оплачен' ? Math.round(finalSum*0.5/100)*100 : status==='Отменён' ? 0 : Math.round(finalSum*0.3/100)*100;
    const orderId = 'o'+pi+'_'+oi;
    const dateOffset = oi*2;
    p.orders.push({
      id: orderId,
      num: 'КПМП-' + String(26500 + pi*7 + oi).padStart(7,'0'),
      patientId: p.id,
      date: p.date, // visually same
      category: catName,
      services,
      sum: finalSum,
      paid: paid,
      status,
      // === Поля по ТЗ v0.1.0 ===
      status9: (status==='Активен' ? (oi===0?'inprogress':'proposed') : status==='Оплачен' ? 'completed' : status==='Частично оплачен' ? 'partial' : 'cancelled'),
      receptionType: oi===0 ? (p.type==='Первичная'?'Первичный':p.type==='Повторная'?'Повторный':'Промежуточный') : (oi===nOrders-1 && p.stage==='final' ? 'Финальный' : 'Промежуточный'),
      // === Δ1: МРТ в динамике (FR-017 P2.4) ===
      isDynamicMRT: (catName==='МРТ' && oi>0),
      curatorId: p.curatorId,
      nextContact: oi===0 ? p.nextContact : null,
      dozhim: oi===0 ? p.dozhim : null,
      format: oi===0 ? p.format : (_rnd()<.5?'процедура':'диагностика'),
    });
  }
});

// Aggregates on patient (recomputed)
function recomputePatient(p){
  p.activeOrders = p.orders.filter(o=>o.status==='Активен'||o.status==='Частично оплачен').length;
  p.ordersCount = p.orders.length;
  p.sumOrders = p.orders.reduce((a,o)=>a+o.sum,0);
  p.sumPaid = p.orders.reduce((a,o)=>a+o.paid,0);
  p.sumDue = p.sumOrders - p.sumPaid;
  p.sumCancelled = p.orders.filter(o=>o.status==='Отменён').reduce((a,o)=>a+o.sum,0);
}
PATIENTS.forEach(recomputePatient);

// Tasks (13) — bound to Заказ (orderId) or Пациент (pid only)
// Helper: pick first order id of a patient, or null
function _firstOrderId(pi){ return PATIENTS[pi]?.orders?.[0]?.id || null; }
function _lastOrderId(pi){ const arr = PATIENTS[pi]?.orders||[]; return arr.length?arr[arr.length-1].id:null; }
const TASKS = [
  { id:'t0', curatorId:0, title:'Позвонить Смирновой О.П. — оплата заказа',    patient:'Смирнова Ольга П.',           pid:'p1',  orderId:_firstOrderId(1),  meta:'14.05.26 10:00', urgency:'high', done:false, type:'Дожим день 0',  tags:['день 0','звонок','первичный'],            status:'Открыта' },
  { id:'t1', curatorId:0, title:'WhatsApp Лютиной Е.С. (шаблон day3_sms)',     patient:'Лютина Екатерина С.',         pid:'p0',  orderId:_firstOrderId(0),  meta:'14.05.26 12:30', urgency:'med',  done:false, type:'Дожим день 3',  tags:['день 3','WhatsApp','тревожный'],          status:'Открыта' },
  { id:'t2', curatorId:0, title:'Согласовать контрольный визит (3 мес)',       patient:'Никитина Лариса О.',          pid:'p10', orderId:null,              meta:'15.05.26 09:00', urgency:'med',  done:false, type:'Ведение',       tags:['Ведение','финальная','звонок'],           status:'Открыта' },
  { id:'t3', curatorId:0, title:'NPS-опрос после курса',                       patient:'Зайцева Марина В.',           pid:'p3',  orderId:_lastOrderId(3),   meta:'13.05.26 16:00', urgency:'low',  done:true,  type:'NPS опрос',     tags:['NPS','WhatsApp'],                          status:'Выполнена' },
  { id:'t4', curatorId:1, title:'Эскалация: Тихонов В.М. не отвечает 7 дней',  patient:'Тихонов Валерий М.',          pid:'p13', orderId:_firstOrderId(13), meta:'12.05.26 18:00', urgency:'overdue', done:false, type:'Эскалация', tags:['день 7','эскалация','звонок'],            status:'Просрочена' },
  { id:'t5', curatorId:1, title:'Подтвердить заезд иногороднего · заказ МРТ',  patient:'Фёдорова Татьяна Ю.',         pid:'p8',  orderId:_firstOrderId(8),  meta:'14.05.26 11:00', urgency:'high', done:false, type:'Авто-задача',   tags:['иногородний','звонок','первичный'],       status:'Открыта' },
  { id:'t6', curatorId:1, title:'Перезвонить — записать на УЗИ',               patient:'Маркова Дарья А.',            pid:'p20', orderId:null,              meta:'14.05.26 14:00', urgency:'med',  done:false, type:'Дожим день 0',  tags:['день 0','звонок','иногородний'],          status:'Открыта' },
  { id:'t7', curatorId:1, title:'Напоминание: визит 12.03',                    patient:'Журавлёва Светлана И.',       pid:'p14', orderId:_firstOrderId(14), meta:'11.03.26 09:00', urgency:'low',  done:false, type:'Напоминание',   tags:['WhatsApp','повторный'],                   status:'Открыта' },
  { id:'t8', curatorId:2, title:'Реактивация: Соколов К.М.',                   patient:'Соколов Кирилл М.',           pid:'p6',  orderId:null,              meta:'14.05.26 15:30', urgency:'high', done:false, type:'Реактивация',   tags:['реактивированный','звонок','эскалация'],  status:'Открыта' },
  { id:'t9', curatorId:2, title:'WhatsApp — план процедур по заказу',          patient:'Беляева Анна И.',             pid:'p5',  orderId:_firstOrderId(5),  meta:'15.05.26 13:00', urgency:'med',  done:false, type:'Ведение',       tags:['Ведение','WhatsApp','иногородний'],       status:'Открыта' },
  { id:'t10',curatorId:2, title:'Контроль МРТ через 6 мес',                    patient:'Симонова Юлия А.',            pid:'p12', orderId:_lastOrderId(12),  meta:'18.05.26 10:00', urgency:'low',  done:false, type:'Ведение',       tags:['Ведение','финальная'],                    status:'Запланирована' },
  { id:'t11',curatorId:0, title:'Согласовать счёт по заказу',                  patient:'Богданова Виктория А.',       pid:'p16', orderId:_firstOrderId(16), meta:'13.05.26 17:00', urgency:'overdue', done:false, type:'Дожим день 7', tags:['день 7','эскалация','звонок'],         status:'Просрочена' },
  { id:'t12',curatorId:1, title:'NPS-опрос: Соловьёв А.Э.',                    patient:'Соловьёв Антон Э.',           pid:'p21', orderId:_firstOrderId(21), meta:'17.05.26 11:00', urgency:'low',  done:false, type:'NPS опрос',     tags:['NPS','WhatsApp','финальная'],             status:'Открыта' },
];

// Tag groups (for deals + kanban + tasks)
const TAG_GROUPS = [
  { key:'type',    label:'Тип пациента',  tags:['первичный','повторный','реактивированный'] },
  { key:'vedenie', label:'Тип ведения',   tags:['контрольный визит','поддерживающее лечение','контроль диагностики','комбинированное'] },
  { key:'geo',     label:'География',     tags:['местный','иногородний'] },
  { key:'psycho',  label:'Психотип',      tags:['экономный','тревожный','решительный','исследователь'] },
  { key:'source',  label:'Источник',      tags:['сайт','звонок','WhatsApp','рекомендация','реклама'] },
  { key:'format',  label:'Формат',        tags:['визит','процедура','диагностика'] },
  { key:'dozhim',  label:'Дожим',         tags:['день 0','день 3','день 7','эскалация'] },
];
const TASK_TAGS = ['день 0','день 3','день 7','эскалация','звонок','WhatsApp','иногородний','реактивированный','тревожный','Ведение','финальная','NPS','первичный','повторный'];

// Report data (responsible -> nomenclature group -> deal)
const REPORT = [
  { resp:'Аникина Светлана Вячеславовна', groups:[
    { name:'МРТ', deals:[
      { name:'Разовые МРТ-исследования',          k:42, sum:512000, price:482000, paidAll:38, revAll:485600, revIdNew:412800, revNew:432000, conv:6.28, revAllTime:1820400, convAllTime:14.5 },
    ]},
    { name:'ПРИЁМ СПЕЦИАЛИСТОВ', deals:[
      { name:'Приём ревматолога',                 k:28, sum:182400, price:178200, paidAll:24, revAll:172800, revIdNew:148000, revNew:158400, conv:4.92, revAllTime:982400, convAllTime:11.2 },
      { name:'Приём ортопеда-травматолога',       k:36, sum:248400, price:238000, paidAll:33, revAll:226800, revIdNew:198000, revNew:208400, conv:7.14, revAllTime:1142800, convAllTime:13.8 },
    ]},
    { name:'УЛЬТРАЗВУКОВАЯ ДИАГНОСТИКА', deals:[
      { name:'УЗИ суставов',                      k:19, sum:97400,  price:92000,  paidAll:18, revAll:91200,  revIdNew:78000,  revNew:84400,  conv:3.18, revAllTime:512400, convAllTime:8.4 },
    ]},
  ]},
  { resp:'Романова Марина Петровна', groups:[
    { name:'ПРИЁМ СПЕЦИАЛИСТОВ', deals:[
      { name:'Приём невролога',                   k:31, sum:218000, price:208400, paidAll:28, revAll:198000, revIdNew:172400, revNew:186800, conv:5.84, revAllTime:1198400, convAllTime:12.6 },
      { name:'Приём мануального терапевта',       k:24, sum:184000, price:178200, paidAll:22, revAll:172400, revIdNew:148000, revNew:158600, conv:6.12, revAllTime:982400, convAllTime:11.8 },
    ]},
    { name:'ФИЗИОТЕРАПИЯ', deals:[
      { name:'Магнитотерапия (курс 10 сеансов)',  k:18, sum:142200, price:138400, paidAll:17, revAll:131000, revIdNew:118400, revNew:124800, conv:4.42, revAllTime:782400, convAllTime:10.4 },
    ]},
    { name:'РЕАБИЛИТАЦИЯ', deals:[
      { name:'Курс ЛФК (12 занятий)',             k:22, sum:198400, price:188400, paidAll:21, revAll:188400, revIdNew:168000, revNew:178400, conv:5.92, revAllTime:1124000, convAllTime:13.2 },
    ]},
  ]},
  { resp:'Горбунов Виктор Кириллович', groups:[
    { name:'ПРИЁМ СПЕЦИАЛИСТОВ', deals:[
      { name:'Приём остеопата',                   k:26, sum:198400, price:188200, paidAll:24, revAll:184000, revIdNew:158400, revNew:172400, conv:5.42, revAllTime:1042400, convAllTime:12.4 },
    ]},
    { name:'ДИАГНОСТИКА', deals:[
      { name:'Денситометрия',                     k:14, sum:84200,  price:78400,  paidAll:13, revAll:78200,  revIdNew:68400,  revNew:72800,  conv:2.92, revAllTime:412400, convAllTime:7.8 },
      { name:'Биомеханический анализ ходьбы',     k:11, sum:98400,  price:92000,  paidAll:10, revAll:88400,  revIdNew:78200,  revNew:84200,  conv:3.18, revAllTime:312000, convAllTime:6.4 },
    ]},
  ]},
];

const fmt = (n)=>n==null||isNaN(n)?'':Number(n).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtInt = (n)=>n==null||isNaN(n)?'':Number(n).toLocaleString('ru-RU');
const fmtPct = (n)=>n==null||isNaN(n)?'':n.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
