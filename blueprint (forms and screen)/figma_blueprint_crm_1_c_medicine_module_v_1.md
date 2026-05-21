# 📥 FULL-LIFECYCLE — Figma Blueprint для CRM-модуля в 1С:Медицина

[✅ GENERATED]

# 1. 📐 Архитектура UX/UI и границы CRM-модуля

## 1.1 Цель Figma-представления

Создать единый UX/UI blueprint CRM-модуля для медицинской клиники на базе 1С:Медицина, покрывающий:

- путь пациента (CJM);
- CRM-процессы продаж и сопровождения;
- медицинские сущности;
- задачи операторов и кураторов;
- управленческую аналитику;
- интеграционные сценарии.

Основа требований:

- [REF: 04_functional_requirements_proekta_crm_indvigo.md#1-5]
- [REF: MoM/Meet1]
- [REF: MoM/Meet2]

---

# 2. 🧩 Информационная архитектура Figma

## 2.1 Структура проекта в Figma

| Раздел | Назначение | Артефакт | Размер |
|---|---|---|---|
| 00_Cover | Обложка и навигация | Project Map | XS |
| 01_Product_Map | Архитектура продукта | User Flow + Sitemap | S |
| 02_Design_System | UI Kit | Tokens + Components | L |
| 03_CJM | Customer Journey | Patient Lifecycle | M |
| 04_Wireframes | Low-fidelity screens | UX skeleton | XL |
| 05_UI_Screens | High-fidelity UI | Production-ready layouts | XL |
| 06_Interactive | Clickable prototype | Demo flow | L |
| 07_Analytics | Dashboards & Reports | BI layouts | M |
| 08_Integrations | External integrations | Sequence diagrams | M |
| 09_Admin | RBAC + settings | Admin console | M |
| 10_Dev_Handoff | Dev specifications | Auto-layout + annotations | M |

---

# 3. 🏥 Основные бизнес-сущности CRM

## 3.1 Карта сущностей

```text
Пациент
 ├── Обращение
 │    ├── Источник
 │    ├── Канал
 │    └── Ответственный
 │
 ├── Визиты
 │    ├── Приём
 │    ├── Диагностика
 │    └── Назначения
 │
 ├── План лечения
 │    ├── Этапы
 │    ├── Услуги
 │    └── Стоимость
 │
 ├── Сделки
 │    ├── Воронка
 │    ├── Оплата
 │    └── Статусы
 │
 ├── Коммуникации
 │    ├── Звонки
 │    ├── WhatsApp
 │    ├── Telegram
 │    └── Email
 │
 └── Аналитика
      ├── LTV
      ├── Conversion
      ├── NPS
      └── Retention
```

[REF: functional_requirements#Основные сущности данных]

---

# 4. 🧭 User Flow для Figma

## 4.1 Главный сценарий пациента

```text
Реклама / Сайт / Call-center
        ↓
Создание обращения
        ↓
Создание карточки пациента
        ↓
Запись на приём
        ↓
Подтверждение визита
        ↓
Консультация врача
        ↓
План лечения
        ↓
Передача куратору
        ↓
Сделка / Оплата
        ↓
Лечение
        ↓
Follow-up / Повторная продажа
```

---

# 5. 🖥 Основные экраны Figma

# 5.1 Dashboard руководителя

[REQ-ID: UI-001]

## Блоки

- KPI cards
- Воронка продаж
- Конверсия по этапам
- Загрузка врачей
- Просроченные задачи
- План/факт выручки
- Источники лидов
- Повторные продажи

## Компоненты

| Компонент | Тип |
|---|---|
| KPI Card | reusable |
| Funnel Widget | chart |
| Task Table | data grid |
| Revenue Graph | line chart |
| Source Pie | pie chart |

## Acceptance Criteria

- пользователь видит KPI за период;
- фильтры работают без reload;
- доступны drill-down сценарии.

---

# 5.2 Карточка пациента

[REQ-ID: UI-002]

## Структура экрана

```text
-------------------------------------------------
 Header
-------------------------------------------------
 Фото | ФИО | ID | Статус | Ответственный
-------------------------------------------------
 Tabs:
 [Общее]
 [История]
 [План лечения]
 [Сделки]
 [Документы]
 [Коммуникации]
 [Оплаты]
 [Задачи]
-------------------------------------------------
 Timeline справа
-------------------------------------------------
```

## UX-требования

- sticky patient summary;
- быстрый переход к оплате;
- timeline всех действий;
- визуальный статус этапа лечения.

## Figma Components

| Компонент | Variant |
|---|---|
| Patient Header | compact/full |
| Timeline Item | success/warning/error |
| Medical Status Badge | active/pending/completed |
| Payment Widget | paid/partial/overdue |

---

# 5.3 Воронка продаж

[REQ-ID: UI-003]

## Этапы

1. Новое обращение
2. Запись создана
3. Визит подтверждён
4. Консультация проведена
5. План лечения создан
6. Коммерческое предложение
7. Частичная оплата
8. Полная оплата
9. Лечение
10. Повторная продажа

## Представления

| Вид | Назначение |
|---|---|
| Kanban | работа менеджеров |
| Table | bulk operations |
| Timeline | SLA контроль |
| Funnel analytics | conversion |

---

# 5.4 Модуль задач

[REQ-ID: UI-004]

## Основные сценарии

- follow-up звонок;
- напоминание;
- контроль оплаты;
- повторный контакт;
- назначение консультации.

## UX-паттерны

- inbox-zero workflow;
- SLA coloring;
- smart reminders;
- bulk reassignment.

---

# 5.5 План лечения

[REQ-ID: UI-005]

## Структура

```text
План лечения
 ├── Диагноз
 ├── Этапы лечения
 ├── Услуги
 ├── Стоимость
 ├── Назначения
 ├── Согласование
 └── Финансовый план
```

## Компоненты

| Компонент | Тип |
|---|---|
| Treatment Stage | accordion |
| Procedure Card | reusable |
| Cost Summary | financial widget |
| Approval Status | badge |

---

# 5.6 Коммуникационный центр

[REQ-ID: UI-006]

## Каналы

- телефония;
- WhatsApp;
- Telegram;
- email;
- сайт;
- чат.

## Layout

```text
--------------------------------------
 Channels Sidebar
--------------------------------------
 Chat/Call Feed
--------------------------------------
 AI Summary
--------------------------------------
 Actions Panel
--------------------------------------
```

## UX особенности

- omnichannel timeline;
- быстрые шаблоны ответов;
- AI summary звонков;
- speech-to-text notes.

---

# 5.7 Аналитика

[REQ-ID: UI-007]

## Дашборды

| Dashboard | Метрики |
|---|---|
| Sales | conversion, revenue |
| Medical | visits, load |
| Finance | payments, debt |
| Marketing | CAC, channels |
| Support | SLA, response time |

## Визуализации

- line chart;
- cohort;
- funnel;
- heatmap;
- stacked bars;
- geo analytics.

---

# 6. 🎨 Design System

## 6.1 Цветовая система

| Token | Назначение |
|---|---|
| Primary Blue | медицинский бренд |
| Success Green | успешные этапы |
| Warning Orange | ожидание |
| Error Red | просрочки |
| Neutral Gray | фон |

---

## 6.2 Typography

| Token | Размер |
|---|---|
| H1 | 32 |
| H2 | 24 |
| H3 | 20 |
| Body | 14 |
| Caption | 12 |

---

## 6.3 UI Components

| Component | Статус |
|---|---|
| Buttons | required |
| Inputs | required |
| Selects | required |
| Tables | required |
| Charts | required |
| Modal windows | required |
| Tabs | required |
| Timeline | required |
| Kanban cards | required |
| Calendar | required |
| Upload widget | required |

---

# 7. 📱 Адаптивность

## Поддерживаемые форматы

| Формат | Размер |
|---|---|
| Desktop | 1440 |
| Laptop | 1280 |
| Tablet | 768 |
| Mobile | 390 |

## Приоритет

Desktop-first.

[ASSUMPTION]
Мобильная версия предназначена только для:

- просмотра задач;
- быстрых контактов;
- подтверждения визитов;
- просмотра карточки пациента.

---

# 8. 🔐 RBAC и безопасность интерфейса

## Роли

| Роль | Ограничения |
|---|---|
| Врач | только мед. данные |
| Куратор | сделки и задачи |
| Администратор | записи и документы |
| Руководитель | аналитика и контроль |
| IT | настройки и интеграции |

## UI ограничения

- скрытие финансов;
- скрытие диагнозов;
- audit labels;
- masked PII;
- secure session timeout.

---

# 9. 🔄 Интеграционные экраны

## Интеграции

| Система | Экран |
|---|---|
| Телефония | call popup |
| WhatsApp API | chat center |
| Telegram | messaging feed |
| Сайт | lead source dashboard |
| 1С Бухгалтерия | payment sync |
| BI | analytics export |

---

# 10. 🧪 UX Validation

## Сценарии тестирования прототипа

| Сценарий | Участник |
|---|---|
| Создать пациента | администратор |
| Записать на приём | call-center |
| Провести продажу | куратор |
| Оформить план лечения | врач |
| Найти просроченные оплаты | руководитель |
| Ответить в WhatsApp | оператор |

---

# 11. 📦 План реализации Figma

## Этап 1 — Discovery

| Задача | Ответственный | Size |
|---|---|---|
| Анализ FR | BA | S |
| Карта ролей | UX | S |
| CJM | UX | M |
| Sitemap | UX | M |

## DoD

- согласована карта экранов;
- согласованы роли;
- утверждён MVP scope.

---

## Этап 2 — Wireframes

| Задача | Ответственный | Size |
|---|---|---|
| Dashboard wireframe | UX | M |
| Patient card | UX | L |
| Funnel | UX | M |
| Tasks | UX | M |
| Analytics | UX | M |

## DoD

- покрыты все ключевые сценарии;
- утверждены пользовательские потоки.

---

## Этап 3 — UI Kit

| Задача | Ответственный | Size |
|---|---|---|
| Tokens | UI Designer | S |
| Components | UI Designer | L |
| Auto-layout | UI Designer | M |
| Responsive rules | UI Designer | M |

## DoD

- компоненты reusable;
- есть variants/states;
- используется naming convention.

---

## Этап 4 — High Fidelity

| Задача | Ответственный | Size |
|---|---|---|
| Desktop screens | UI | XL |
| Tablet screens | UI | M |
| Prototype flows | UX | M |
| Design QA | Lead UX | S |

## DoD

- prototype clickable;
- dev-ready spacing;
- tokenized styles.

---

## Этап 5 — Dev Handoff

| Задача | Ответственный | Size |
|---|---|---|
| Specs export | UI | S |
| Component mapping | Frontend Lead | M |
| Storybook sync | Frontend | M |
| Jira mapping | BA | S |

## DoD

- разработчики могут начать реализацию без уточнений.

---

# 12. 🛠 Рекомендованный стек

| Компонент | Технология | Причина |
|---|---|---|
| Design | Figma | industry standard |
| UI Kit | Variables + AutoLayout | scalability |
| Documentation | FigJam + Confluence | traceability |
| Prototype | Smart Animate | UX demo |
| Icons | Lucide | consistency |
| Charts | Apache ECharts patterns | BI support |

---

# 13. 📊 Метрики качества дизайна

| Метрика | Цель |
|---|---|
| Time-to-action | < 3 кликов |
| Search latency | < 2 сек |
| New patient creation | < 60 сек |
| Appointment booking | < 45 сек |
| Error rate | < 2% |

---

# 14. ⚠️ НЕЯСНОСТИ/РИСКИ

| Проблема | Влияние | Вариант A | Вариант B | Рекомендация |
|---|---|---|---|---|
| Нет финального списка ролей | RBAC конфликт | минимальный RBAC | granular RBAC | начать с MVP RBAC |
| Не определён бренд-гайд | UI inconsistency | временный UI kit | полноценный брендбук | временный design token set |
| Нет API-контрактов | невозможно финализировать формы | mock API | reverse engineering | mock contracts |
| Нет согласованных KPI | dashboard rework | базовые KPI | workshop | провести analytics workshop |
| Не утверждён mobile scope | redesign cost | desktop-first | adaptive-first | desktop-first MVP |

---

# 15. 📖 Структура Figma проекта

```text
CRM-1C-Medicine/
 ├── Cover
 ├── Flows
 ├── Design System
 ├── Wireframes
 ├── UI Desktop
 ├── UI Tablet
 ├── UI Mobile
 ├── Prototype
 ├── Analytics
 ├── Integrations
 ├── Admin
 └── Dev Handoff
```

---

# 16. ✅ ГОТОВНОСТЬ К СТАРТУ

## Pre-Flight Checklist

- [ ] Утверждён MVP scope
- [ ] Утверждены роли пользователей
- [ ] Подтверждены бизнес-процессы
- [ ] Есть список интеграций
- [ ] Есть owner по медицинским процессам
- [ ] Определены KPI dashboard
- [ ] Согласованы требования безопасности

---

# [QC-REPORT]

| Проверка | Статус |
|---|---|
| Coverage функциональных требований | PASS |
| Консистентность сущностей | PASS |
| UX flows определены | PASS |
| RBAC учтён | PASS |
| Mobile scope определён | PARTIAL |
| BI requirements финализированы | PARTIAL |
| API contracts доступны | FAIL |

---

# [TRACEABILITY-MATRIX]

| REQ-ID | Экран/Артефакт | Статус |
|---|---|---|
| FR-01 | CJM + Patient Timeline | mapped |
| FR-02 | Lead Sources Dashboard | mapped |
| UI-001 | Executive Dashboard | designed |
| UI-002 | Patient Card | designed |
| UI-003 | Sales Funnel | designed |
| UI-004 | Tasks Module | designed |
| UI-005 | Treatment Plan | designed |
| UI-006 | Communication Center | designed |
| UI-007 | Analytics | designed |

---

# [NEXT-ACTIONS]

| Действие | Ответственный | Deadline |
|---|---|---|
| Провести workshop по ролям и KPI | Product Owner + BA | T+3 days |
| Утвердить sitemap и wireframes | UX Lead | T+5 days |
| Создать UI Kit и design tokens | UI Designer | T+7 days |

