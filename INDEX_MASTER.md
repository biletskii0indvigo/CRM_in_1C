# INDEX MASTER — CRM Индвиго / Институт Движения

**Версия:** 1.0  
**Дата индексирования:** 2026-05-25  
**Составлено:** AI Index Architect  
**Репозиторий:** `CRM_in_1C` (`bitdenvic-sudo/CRM_in_1C`)

---

## Навигация по документам индексации

| Документ | Назначение |
|----------|-----------|
| [INDEX_MASTER.md](./INDEX_MASTER.md) | **Этот файл** — главный индекс, project overview, file index |
| [ENTITY_MAP.md](./ENTITY_MAP.md) | Карта сущностей: бизнес, технические, проектные |
| [RELATIONS.md](./RELATIONS.md) | Карта связей: файл↔файл, сущность↔процесс |
| [CONFLICTS.md](./CONFLICTS.md) | Конфликты и противоречия между документами |
| [RISKS.md](./RISKS.md) | Риски проекта по документации |
| [CHANGELOG_INDEX.md](./CHANGELOG_INDEX.md) | История изменений индексации |
| [MISSING_DATA.md](./MISSING_DATA.md) | Недостающие документы и данные |

---

## PROJECT OVERVIEW

### Предметная область

**CRM Индвиго** — проект автоматизации управления жизненным циклом пациента для сети клиник «Индвиго» (торговое название: «Институт Движения»). Медицинская клиника ортопедического/реабилитационного профиля.

**Суть проекта:** Разработка CRM-модуля в форме расширения конфигурации (`.cfe`) к 1С:Медицина.Поликлиника. Типовая конфигурация не изменяется.

### Основные системы

| Система | Роль в проекте |
|---------|---------------|
| 1С:Предприятие 8.3.25 | Целевая платформа |
| 1С:Медицина.Поликлиника | Базовая конфигурация (AS-IS) |
| Расширение CRM (.cfe) | Разрабатываемый модуль |
| WhatsApp / Telegram | Планируемые интеграции |
| Телефония (АТС) | Планируемая интеграция |

### Ключевые процессы

1. Управление воронкой заказов (9 статусов)
2. Ведение пациентов кураторами
3. Триггеры возврата (+3 дня, дожим 0-3-7-14-30)
4. ABC-сегментация пациентов
5. Управление абонементами
6. Замещение и перераспределение нагрузки
7. Дашборды РОП и куратора

### Ключевые участники

| Участник | Роль в проекте |
|----------|---------------|
| Вадим | IT клиники, финансы, архитектурные решения |
| Наташа | Бизнес-владелец, ключевые решения |
| Андрей | Аналитик проекта |
| Геннадий | Схема премирования |
| Диана | Отдел продаж |
| Елена | Бизнес-процессы (паспорт статусов) |

### Текущее состояние (на 2026-05-25)

| Показатель | Значение |
|-----------|---------|
| Фаза | Pre-development (Discovery не начат) |
| Версия документации | v0.2.0 (2026-05-21) |
| Встреч проведено | 10 (Meet 0–9, апрель–май 2026) |
| Open Questions | 27 (13 критических без ответа) |
| GAP-расхождений | 68 (56 закрыто в docs/ v0.1.0, 12 новых из Meet 7–8) |
| Оценка трудоёмкости | ~2 167 ч (базовая) |
| Бюджет Year 0 | 765 000 ₽ (КОНФЛИКТ с оценкой) |

### Общая зрелость документации

**СРЕДНЯЯ** — с критическими проблемами:
- Доказательная база (MoM) — **ВЫСОКАЯ** зрелость
- Проектная документация (docs/) — **НИЗКАЯ** зрелость, помечена самой командой как «гипотезы»
- Discovery не проведён: все требования — TO-BE, AS-IS неизвестен
- Финансовый конфликт: бюджет не покрывает оценку трудоёмкости в 4+ раза

---

## DOCUMENT TREE

### Business
- `reglaments docs/` — регламенты работы сотрудников клиники (9 файлов)
- `backlog/Medical_CRM_Strategy_Checklist_RU.md` — стратегический чек-лист LTV

### Technical
- `docs/TECHNICAL_SPECIFICATION.md` — главная техническая спецификация v0.2.0
- `docs/FUNCTIONAL_REQUIREMENTS.md` — функциональные требования v0.1.0 (FR-001…FR-026)
- `docs/DATA_MODEL.md` — модель данных (17 объектов 1С) v0.1.0
- `docs/INTEGRATIONS.md` — интеграции v0.1.0
- `docs/NON_FUNCTIONAL_REQUIREMENTS.md` — НФТ v0.1.0
- `params/PARAMETERS_REGISTER.md` — реестр 150 параметров
- `params/OBJECTS_MATRIX.md` — матрица 101 объект 1С

### Integrations
- `docs/INTEGRATIONS.md` — WhatsApp, Telegram, телефония, 1С:Медицина

### Analytics
- `gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md` — 68 расхождений v1.1
- `gap/GAP_ANALYSIS_EXECUTIVE_SUMMARY.md` — резюме для руководства
- `finance docs/finance_budget_analysis.md` — TCO-анализ

### Regulations
- `reglaments docs/Регламент ведения сделок(1).docx`
- `reglaments docs/Регламент работы с возражениями.docx`
- `reglaments docs/Регламент распределения пациентов.docx`
- `reglaments docs/Стандарт первичного контакта.docx`
- `reglaments docs/Правила и принципы работы с базой пациентов.docx`
- `reglaments docs/Коммуникации с первичным пациентом.docx`
- `reglaments docs/критерии хорошего помощника.docx`
- `reglaments docs/УСЛУГИ ЦЕНТРА таблица.docx`
- `reglaments docs/Путь пациента От А до Я.xlsx`

### Deploy
- *(отсутствует — Discovery не проведён)*

### User Guides
- `reglaments docs/Программа обучения кураторов.pptx`
- `reglaments docs/Скрипты.pptx`
- `reglaments docs/карьерный рост.pptx`

### Architecture
- `docs/TECHNICAL_SPECIFICATION.md`
- `DISCOVERY_PLAN.md`
- `params/METADATA_DRAFT.md`

### Meetings (MoM)
- `MoM/Meet 0 _ 2026 April 14/`
- `MoM/Meet 1 _ 2026 April 28/`
- `MoM/Meet 2 _ 2026 April 30/`
- `MoM/Meet 3 _ 2026 May 05/`
- `MoM/Meet 4 _ 2026 May 08/`
- `MoM/Meet 5 _ 2026 May 13/`
- `MoM/Meet 6 _ 2026 May 14/`
- `MoM/Meet 7 _ 2026 May 19/`
- `MoM/Meet 8 _ 2026 May 20/`
- `MoM/Meet 9 _ 2026 May 22/`
- `MoM/Summary_Meet_0_to_8.md` — консолидированная сводка

### Legacy / Archive
- `roadmap/archive/` — Roadmap v2 (устаревший)
- `demo app/version 2/docs_archive_v0.1.0/` — предыдущая версия docs/
- `MoM/Summary_Meet_1_and_2.md` — устаревшая частичная сводка
- `reference/1С CRM ПРОФ (другой продукт)/` — ДРУГОЙ продукт 1С

### Unknown / Prototype
- `demo app/` — HTML-прототип (не 1С)
- `concept/figma_mockup/` — Figma-концепт (не 1С)
- `reference/html presentation/` — HTML-презентации

---

## FILE INDEX

### README.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Business |
| **Purpose** | Главный входной документ репозитория, обзор проекта |
| **Summary** | Описывает платформу (1С:Предприятие 8.3.25), реализацию (.cfe к 1С:Медицина.Поликлиника), ключевые функциональные блоки, текущий статус, фазы разработки (~2167 ч), критические OQ, ссылки на все ключевые документы. Версия 0.2.0 на 2026-05-21. |
| **Key Entities** | Индвиго, Институт Движения, 1С:Медицина.Поликлиника, Фаза 0.2, OQ-005…OQ-027 |
| **Related Files** | INDEX.md, docs/INDEX.md, MoM/Summary_Meet_0_to_8.md, gap/, roadmap/ |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE |
| **Risks** | Описывает Фазу 1 с 16-дневным сроком при 730 ч — нереалистично без Discovery |
| **Missing Information** | AS-IS состояние системы, подтверждённый scope MVP |

---

### INDEX.md (корневой)

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Architecture |
| **Purpose** | Карта всего репозитория с описанием каждой подпапки и файла |
| **Summary** | Версия v0.11. Документирует все переименования (RAW BR→backlog, blueprint→concept, reference переименована). Ссылается на STATUS_DISCLAIMER-ы в каждой папке. Содержит хронологию встреч Meet 0–8 и перечень всех файлов. |
| **Key Entities** | PROBLEM_ANALYSIS, Summary_Meet_0_to_8, STATUS_DISCLAIMER |
| **Related Files** | Все подпапки |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE |
| **Risks** | — |
| **Missing Information** | Meet 9 не отражена в INDEX.md |

---

### PROBLEM_ANALYSIS.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Analytics |
| **Purpose** | Критический аналитический разбор текущего пакета документации |
| **Summary** | Выявляет 10 системных проблем (П-1…П-10): отсутствие Discovery, нет реальных форм 1С, конфликты в модели данных, нереалистичные сроки, финансовый разрыв, неотвеченные OQ, reference — другой продукт, дублирование, NFR без эмпирики, внешние документы не предоставлены. Содержит детальную таблицу конфликтов (7 конкретных расхождений между docs/ и params/). |
| **Key Entities** | П-1 Discovery, П-3 конфликты DM, П-5 финансы |
| **Related Files** | docs/DATA_MODEL.md, params/PARAMETERS_REGISTER.md, finance docs/, DISCOVERY_PLAN.md |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE |
| **Risks** | Сам является диагнозом — требует исполнения рекомендаций |
| **Missing Information** | — |

---

### DISCOVERY_PLAN.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Architecture |
| **Purpose** | Детальный план обследования 1С:Медицина.Поликлиника (5 рабочих дней) |
| **Summary** | Описывает 10 целей Discovery с артефактами на выходе, 5-дневный план, чек-листы для 8 документов (конфигурация, объекты, AS-IS процессы, гипотезы, NFR, объёмы данных, роли), 23 скриншота-минимума, опросники для 8 ролей (87 вопросов), структуру blueprint_1c/ (3 формы, 4 списка, 1 отчёт, 1 триггер, 1 роль). Бюджет ≈174 000 ₽ / 104 ч. |
| **Key Entities** | blueprint_1c/, discovery/, 10 артефактов, 8 ролей интервью |
| **Related Files** | PROBLEM_ANALYSIS.md, docs/DATA_MODEL.md, docs/OPEN_QUESTIONS.md |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (план не начат) |
| **Risks** | Discovery заблокирован до получения доступа к БД клиники |
| **Missing Information** | Дата старта Discovery не назначена |

---

### MoM/Summary_Meet_0_to_8.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Meetings |
| **Purpose** | Консолидированная сводка всех 9 встреч (Meet 0–8) |
| **Summary** | Хронология: 14.04–20.05.2026. Сводная таблица по встречам, объединённый список функциональных требований по блокам: сущности/модель данных, роли/права, триггеры/автозадачи, воронка, абонементы, дашборды/аналитика, интеграции. Ключевые решения: Заказ вместо Сделки, ортопедия как отдельный заказ, теги двух типов, дожим local/non-local, контроль взаимодействий 7/14 дней. |
| **Key Entities** | Куратор, Помощник, РОП, ЦОЗ, Заказ, дожим, ABC, теги, абонементы |
| **Related Files** | Все MoM/Meet X/, gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md, docs/FUNCTIONAL_REQUIREMENTS.md |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE |
| **Risks** | Meet 9 (0522) не включена в сводку |
| **Missing Information** | Транскрипты Meet 3, 4, 5, 6, 7 — только краткие протоколы |

---

### MoM/Meet 9 _ 2026 May 22/0522.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Meetings |
| **Purpose** | Протокол встречи 9 (22.05.2026) |
| **Summary** | Финализация типов сделок: ортопедия (всегда полный выкуп, без финальной консультации), МРТ/УЗИ (не записывать с улицы без назначения врача), узкие специалисты, комплексные. Дожим после частичной оплаты: местные 3 дня, иногородние 10 дней. Запрет на запись МРТ без назначения. Список дорогостоящих процедур для дополнительного курирования (ботулинотерапия, аджови). Срок финализации процессов — 25-е, финальная встреча — 26-е. |
| **Key Entities** | Ортопедия, МРТ, дожим, ботулинотерапия, Диана |
| **Related Files** | MoM/Summary_Meet_0_to_8.md, docs/FUNCTIONAL_REQUIREMENTS.md FR-002 |
| **Confidence** | MEDIUM (краткое резюме, нет транскрипта) |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE |
| **Risks** | Нет транскрипта |
| **Missing Information** | Протокол Meet 10 (26.05.2026) — планируется |

---

### docs/TECHNICAL_SPECIFICATION.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Полная техническая спецификация проекта (18 разделов) |
| **Summary** | v0.2.0 (21.05). Цели, KPI, scope (Фазы 1–4), стек (1С:Медицина.Поликлиника + .cfe), функциональные требования FR-001…FR-026, модель данных §7, интеграции §8–9, роли §11, NFR §12, риски §14, критерии приёмки Фазы 1 §15.2, OQ-001…OQ-027 §17. Обновлена по Meet 7–8: ортопедия, дожим, теги, контроль взаимодействий. |
| **Key Entities** | FR-001…FR-026, OQ-001…OQ-027, 7 ролей, KPI, Scope |
| **Related Files** | docs/FUNCTIONAL_REQUIREMENTS.md, docs/DATA_MODEL.md, gap/ |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (но «первоначальная фиксация», не утв. ТЗ) |
| **Risks** | Статус «на согласовании»; данные без Discovery — гипотезы |
| **Missing Information** | Версия 1С:Медицина (релиз), реальный scope после Discovery |

---

### docs/FUNCTIONAL_REQUIREMENTS.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Формализованные функциональные требования в BDD-формате |
| **Summary** | v0.1.0 (18.05). FR-001…FR-023. Каждое FR: ID, описание, бизнес-ценность, роли, приоритет (Must/Should/Could), preconditions, main flow, alternative flows, validation rules, 1С metadata objects, acceptance criteria (Given/When/Then), estimate. Не обновлено до v0.2.0 — не включает FR-024…FR-026, расширения FR-002/003/010. |
| **Key Entities** | FR-001 Карточка пациента, FR-002 Заказ, FR-003 Воронка, FR-007 +3 дня, FR-011 Помощник |
| **Related Files** | docs/REQUIREMENTS_TRACEABILITY_MATRIX.md, docs/TEST_CASES.md, gap/ |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (v0.1.0 — устарел по Meet 7–8) |
| **Risks** | Отстаёт от TS v0.2.0 — FR-024…FR-026 отсутствуют |
| **Missing Information** | FR-024 промежуточная консультация, FR-025 уведомления о переносах, FR-026 контроль взаимодействий |

---

### docs/DATA_MODEL.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Модель данных: объекты метаданных 1С расширения |
| **Summary** | v0.1.0 (18.05). Описывает 17 объектов: расширения типовых (ФизическиеЛица), новые справочники (CRM_Кураторы, CRM_ТипыВедения, CRM_ИсточникиОбращений), новые документы (CRM_Заказ, CRM_Задача, CRM_Взаимодействие), перечисления, регистры. Принципы: все новые объекты с суффиксом _CRM, типовая не изменяется. ВНИМАНИЕ: конфликт с params/ (17 объектов vs 101 объект). |
| **Key Entities** | ФизическиеЛица, CRM_Заказ, CRM_Кураторы, CRM_Задача |
| **Related Files** | params/PARAMETERS_REGISTER.md, params/OBJECTS_MATRIX.md, PROBLEM_ANALYSIS.md §П-3 |
| **Confidence** | MEDIUM |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (требует сверки после Discovery) |
| **Risks** | Конфликт с params/ по 7+ позициям; объекты не верифицированы против реальной 1С |
| **Missing Information** | Реальная структура типовых объектов (нужен Discovery) |

---

### docs/INTEGRATIONS.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Integrations |
| **Purpose** | Спецификация интеграций: 1С:Медицина, WhatsApp, Telegram, телефония |
| **Summary** | v0.1.0 (18.05). Архитектура: расширение в одной базе (предположение OQ-005). 7 точек синхронизации с 1С:Медицина. Телефония: вебхуки (OQ-008 не закрыт). WhatsApp/Telegram: через внешний сервис. Правила разрешения конфликтов данных. |
| **Key Entities** | OQ-005, OQ-008, WhatsApp, Telegram, расписание, оплата, абонементы |
| **Related Files** | docs/OPEN_QUESTIONS.md OQ-005, OQ-008, docs/TECHNICAL_SPECIFICATION.md |
| **Confidence** | MEDIUM |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (гипотеза до ответа на OQ-005) |
| **Risks** | OQ-005 (архитектура: одна БД vs HTTP) не закрыт; вся архитектура интеграции — предположение |
| **Missing Information** | Ответ на OQ-005 (срок 25.05.2026 просрочен), конкретный поставщик телефонии |

---

### docs/OPEN_QUESTIONS.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Analytics |
| **Purpose** | Реестр открытых вопросов, блокирующих разработку |
| **Summary** | v0.1.0 (18.05). OQ-001…OQ-027 (OQ-021…OQ-027 добавлены в roadmap, не в этом файле). Критические (🔴): OQ-001 источник финданных, OQ-002 алгоритм нормирования, OQ-003 юр. автодиктофон, OQ-004 электронный консультационный лист, OQ-005 архитектура интеграции, OQ-009 паспорт процесса. |
| **Key Entities** | OQ-005 архитектура, OQ-009 статусы, OQ-001 финансы, OQ-021…OQ-027 |
| **Related Files** | docs/TECHNICAL_SPECIFICATION.md §17, roadmap/Indvigo_CRM_Roadmap_v3.md |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (13 критических без ответа) |
| **Risks** | OQ-005 срок 25.05 просрочен |
| **Missing Information** | OQ-021…OQ-027 отсутствуют в самом файле (только в roadmap и README) |

---

### docs/WORK_ESTIMATION.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Analytics |
| **Purpose** | Оценка трудозатрат по фазам и задачам |
| **Summary** | v0.1.0 (18.05). Метод: экспертная оценка снизу вверх, уверенность ±25%. Фаза 0: 109 ч, Фаза 1 MVP: 730 ч (деком. по задачам), Фаза 2: 544 ч, Фаза 3: 204 ч, Интеграции: 232 ч. Итого: 1 806 ч базовых + 20% резерв = ~2 167 ч. |
| **Key Entities** | 2167 ч, Фазы 0/1/2/3, роли (аналитик, разработчик, QA) |
| **Related Files** | finance docs/finance_budget_analysis.md, roadmap/Indvigo_CRM_Roadmap_v3.md |
| **Confidence** | MEDIUM |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (критический конфликт с бюджетом) |
| **Risks** | При ставке 1500 ₽/ч = 3.25 млн ₽ против бюджета 765 000 ₽ — разрыв в 4,25x |
| **Missing Information** | Ставки исполнителей, уточнение Фазы 0.2 (~80 ч) |

---

### docs/TEST_CASES.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Приёмочные тест-кейсы в BDD-формате |
| **Summary** | v0.1.0 (18.05). Тест-кейсы TC-001…TC-N. Привязаны к FR через REQUIREMENTS_TRACEABILITY_MATRIX. |
| **Key Entities** | TC-001, TC-007 (триггер +3 дня), TC-010 (помощник) |
| **Related Files** | docs/FUNCTIONAL_REQUIREMENTS.md, docs/REQUIREMENTS_TRACEABILITY_MATRIX.md |
| **Confidence** | MEDIUM |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE (устарел — не покрывает FR-024…FR-026) |
| **Risks** | Тест-кейсы нельзя валидировать без реальных форм 1С |
| **Missing Information** | TC для FR-024…FR-026 |

---

### docs/REQUIREMENTS_TRACEABILITY_MATRIX.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Матрица трассировки FR ↔ источники ↔ TC ↔ фаза |
| **Summary** | v0.1.0. Покрывает FR-001…FR-023. Столбцы: FR ID, название, источники (FR_v02/M0…M6/BR/GAP/RMP), Test Cases, фаза, приоритет. RTM не обновлена под FR-024…FR-026. |
| **Key Entities** | FR ↔ MoM ↔ TC ↔ Phase |
| **Related Files** | docs/FUNCTIONAL_REQUIREMENTS.md, docs/TEST_CASES.md |
| **Confidence** | HIGH |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE (устарел — не покрывает Meet 7–8 FR) |
| **Risks** | — |
| **Missing Information** | Трассировка FR-024…FR-026 и расширений FR-002/003/010 |

---

### gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Analytics |
| **Purpose** | Детальный анализ 68 расхождений между документами |
| **Summary** | v1.1 (21.05). Сводная таблица: 18 пропущенных из MoM, 12 неверных параметров, 7 неверная логика, 8 логика сопровождения, 5 RAW данных, 6 несоответствий Meet 5-6, 12 новых из Meet 7–8. Детализация по каждой встрече. |
| **Key Entities** | 68 GAP, 12 новых (Meet 7–8), N1…N12 |
| **Related Files** | gap/GAP_ANALYSIS_EXECUTIVE_SUMMARY.md, MoM/, docs/ |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE (нужна v1.2 для Meet 9) |
| **Risks** | Не обновлён под Meet 9 (0522) |
| **Missing Information** | Meet 9 расхождения; ответы на закрытые OQ |

---

### gap/GAP_ANALYSIS_EXECUTIVE_SUMMARY.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Analytics |
| **Purpose** | Краткое резюме GAP-анализа для руководства |
| **Summary** | v1.1 (21.05). Общая картина: docs/ v0.1.0 закрывает 56 GAP из Meet 0–6, но 12 новых из Meet 7–8. Таблица N1…N12 с приоритетами. Исходные P1.1…P1.9, P2.1…P2.16, P3.x. |
| **Key Entities** | N1…N12, P1.1…P1.9, 56+12 GAP |
| **Related Files** | gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md |
| **Confidence** | HIGH |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE |
| **Risks** | — |
| **Missing Information** | Meet 9 GAP |

---

### roadmap/Indvigo_CRM_Roadmap_v3.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Business |
| **Purpose** | Дорожная карта проекта с задачами по фазам |
| **Summary** | v3.1 (21.05). Фазы: 0 (закрыта 18.05, 109 ч), 0.2 (21–30.05, ~80 ч, 12 задач), 1 MVP (30.05–14.06, 730 ч), 2 (15.06–15.07, 544 ч), 3 (16.07–31.08, 204 ч), Интеграции (сквозно, 232 ч). Легенда статусов. Новые OQ-021…OQ-027. |
| **Key Entities** | Фаза 0.2, Фаза 1, OQ-021…OQ-027, задачи 0.11…0.22 |
| **Related Files** | docs/WORK_ESTIMATION.md, gap/, README.md |
| **Confidence** | HIGH |
| **Importance** | CRITICAL |
| **Status** | ACTIVE |
| **Risks** | Сроки Фазы 1 (16 дней, 730 ч) нереалистичны |
| **Missing Information** | Roadmap v4.0 (запланирован после Discovery) |

---

### params/PARAMETERS_REGISTER.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Реестр 150 параметров CRM в 11 функциональных блоках |
| **Summary** | 150 параметров с атрибутами: объект 1С, тип данных, обязательность, источник, MoSCoW, уверенность, документ-источник. Использует `Справочник.Пациенты` — КОНФЛИКТ с DATA_MODEL.md. Содержит Документ.Сделка — УСТАРЕВШИЙ термин (должен быть Заказ). |
| **Key Entities** | 150 параметров, 11 блоков, Справочник.Пациенты |
| **Related Files** | docs/DATA_MODEL.md (КОНФЛИКТ), params/OBJECTS_MATRIX.md |
| **Confidence** | MEDIUM |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE (несовместим с docs/) |
| **Risks** | Конфликт по именам объектов с DATA_MODEL.md; термин «Сделка» не обновлён на «Заказ» |
| **Missing Information** | Сопоставление с FR (матрица параметр → FR) |

---

### params/OBJECTS_MATRIX.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Technical |
| **Purpose** | Матрица: 150 параметров → 101 объект метаданных 1С |
| **Summary** | 101 уникальный объект (справочники, документы, перечисления, регистры). Содержит Документ.Сделка (устаревший термин). Разрыв с DATA_MODEL.md (17 объектов vs 101). Документирует нестандартные объекты: ОценкаЗвонка, ОценкаПомощника, СписокНаОбзвон, ЧекЛистыПрослушки. |
| **Key Entities** | 101 объект, Документ.Сделка (устар.), Справочник.Пациенты |
| **Related Files** | docs/DATA_MODEL.md (КОНФЛИКТ), params/PARAMETERS_REGISTER.md |
| **Confidence** | MEDIUM |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE (устарело по части терминологии) |
| **Risks** | Документ.Сделка — устаревший термин; объём несовместим с DATA_MODEL |
| **Missing Information** | Соответствие со структурой реальной 1С:Медицина.Поликлиника |

---

### finance docs/finance_budget_analysis.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Analytics |
| **Purpose** | TCO-анализ проекта на 5 лет |
| **Summary** | Реалистичный TCO снижен с 16.5 млн до 5.5–7.0 млн за 5 лет. Year 0: 765 000 ₽ (разработка 300 000, миграция 80 000, тестирование 50 000, обучение 50 000 + 30 000, документация 30 000, PM 75 000, compliance 30 000, лицензии 150 000). |
| **Key Entities** | 765 000 ₽ Year 0, TCO 5.5–7.0 млн, разработка 300 000 |
| **Related Files** | docs/WORK_ESTIMATION.md (КОНФЛИКТ), finance docs/Budget.xlsx |
| **Confidence** | MEDIUM |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE (требует пересчёта) |
| **Risks** | КРИТИЧЕСКИЙ КОНФЛИКТ: 300 000 ₽ на разработку vs 2167 ч × ~1500–3000 ₽/ч = 3.25–6.5 млн ₽ |
| **Missing Information** | Реальные ставки разработчиков, уточнённый scope после Discovery |

---

### backlog/Medical_CRM_Strategy_Checklist_RU.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Business |
| **Purpose** | Стратегический чек-лист по развитию LTV и среднего чека |
| **Summary** | v1.0 (29.04). Кросс-продажи, пакетные предложения, реферальная программа, программа лояльности, NPS, реактивация. Содержит идеи, которые **не являются MVP-требованиями**. Помечен как backlog (бывш. RAW BR). |
| **Key Entities** | LTV, кросс-продажи, программа лояльности, NPS, реактивация |
| **Related Files** | docs/FUNCTIONAL_REQUIREMENTS.md (Фаза 3) |
| **Confidence** | HIGH |
| **Importance** | OPTIONAL |
| **Status** | ACTIVE (как источник идей для backlog) |
| **Risks** | Без DISCLAIMER легко спутать с MVP-требованиями |
| **Missing Information** | — |

---

### concept/figma_mockup/figma_blueprint_crm_1_c_medicine_module_v_1.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Architecture |
| **Purpose** | UX/UI blueprint CRM-модуля (концептуальный, не 1С) |
| **Summary** | Figma-описание информационной архитектуры, структуры проекта в Figma, путь пациента (CJM), CRM-процессы. Основан на FR v0.2 и Meet 1–2. Не содержит скриншотов управляемых форм 1С — это концептуальный UI. |
| **Key Entities** | CJM, информационная архитектура, Figma |
| **Related Files** | FR from Business Stakeholder/, docs/FUNCTIONAL_REQUIREMENTS.md |
| **Confidence** | MEDIUM |
| **Importance** | OPTIONAL |
| **Status** | ACTIVE (как концепт, не как ТЗ) |
| **Risks** | Не привязан к 1С:Медицина — прямой перенос невозможен |
| **Missing Information** | Реальные формы 1С (planned in blueprint_1c/ после Discovery) |

---

### reference/1С CRM ПРОФ (другой продукт)/

| Поле | Значение |
|------|---------|
| **Type** | PDF (32 документа) |
| **Category** | Legacy |
| **Purpose** | Документация другого продукта 1С:CRM ПРОФ |
| **Summary** | 2 раздела: «Управление обращениями» (9 PDF) и «Управление сделками и продажами» (23 PDF). ВАЖНО: 1С:CRM ПРОФ — совершенно иной продукт, не 1С:Медицина.Поликлиника. Прямой перенос требований невозможен. |
| **Key Entities** | 1С:CRM ПРОФ, лиды, сделки, канбан, воронка продаж |
| **Related Files** | — |
| **Confidence** | HIGH (для своего продукта) |
| **Importance** | OPTIONAL (только для идей) |
| **Status** | LEGACY (другой продукт) |
| **Risks** | Риск непреднамеренного переноса требований с чужого продукта |
| **Missing Information** | — |

---

### demo app/version 2/docs_archive_v0.1.0/

| Поле | Значение |
|------|---------|
| **Type** | Markdown (18 файлов) |
| **Category** | Legacy |
| **Purpose** | Архивная копия первой версии docs/ |
| **Summary** | Полная копия docs/ до актуализации: TS, FR, DM, INT, NFR, WE, TC, OQ, RTM, CHANGELOG + GAP, DELTA1–4, figma blueprints. Расходится с текущей docs/ по версиям и содержанию. Помечена ARCHIVE_NOTE.md. |
| **Key Entities** | — |
| **Related Files** | docs/ (текущая версия) |
| **Confidence** | HIGH (как архив) |
| **Importance** | OPTIONAL |
| **Status** | LEGACY |
| **Risks** | Дублирование вводит в заблуждение новых участников |
| **Missing Information** | — |

---

### project manifest/PROJECT LIFECYCLE FRAMEWORK — IT PROJECT.md

| Поле | Значение |
|------|---------|
| **Type** | Markdown |
| **Category** | Architecture |
| **Purpose** | Универсальный фреймворк жизненного цикла IT-проекта |
| **Summary** | v1.0 Draft. 8 фаз: Discovery, Planning, Design, Development, QA, Release, Operations, Evolution. Core Roles, Governance Model. Помечен [✅ GENERATED] — AI-сгенерированный шаблон. |
| **Key Entities** | PLC-01…PLC-08, 8 фаз жизненного цикла |
| **Related Files** | DISCOVERY_PLAN.md, roadmap/ |
| **Confidence** | HIGH |
| **Importance** | OPTIONAL |
| **Status** | ACTIVE (методологический) |
| **Risks** | — |
| **Missing Information** | — |

---

### FR from Business Stakeholder/ (группа файлов)

| Поле | Значение |
|------|---------|
| **Type** | MD + DOCX |
| **Category** | Business |
| **Purpose** | Функциональные требования от бизнес-заказчика v0.2 |
| **Summary** | 3 копии одного документа: `Indvigo_CRM_Functional Requirements_v02.md`, `04_functional_requirements_proekta_crm_indvigo.md`, `e1cib/data/Functional Requirements_v0.2.md`. Нет указания «канонической» версии. Содержит ФТ-01…ФТ-xx + 5 открытых вопросов. Дата 30.04.2026. |
| **Key Entities** | ФТ-01…ФТ-N, источник → docs/FR |
| **Related Files** | docs/FUNCTIONAL_REQUIREMENTS.md (производный), docs/REQUIREMENTS_TRACEABILITY_MATRIX.md |
| **Confidence** | HIGH |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE (первоисточник бизнес-требований) |
| **Risks** | 3 версии одного документа без метки «канон» |
| **Missing Information** | Указание канонической копии |

---

### reglaments docs/ (группа файлов)

| Поле | Значение |
|------|---------|
| **Type** | DOCX, PPTX, XLSX |
| **Category** | Regulations |
| **Purpose** | Внутренние регламенты клиники по работе с пациентами |
| **Summary** | 9 бизнес-регламентов: Регламент ведения сделок, Регламент работы с возражениями, Регламент распределения пациентов, Стандарт первичного контакта, Коммуникации с первичным пациентом, Правила работы с базой пациентов, Путь пациента (xlsx), Программа обучения кураторов (pptx), Скрипты (pptx), Карьерный рост (pptx), критерии хорошего помощника, УСЛУГИ ЦЕНТРА. |
| **Key Entities** | Куратор, помощник, пациент, путь пациента, возражения, скрипты |
| **Related Files** | MoM/, docs/FUNCTIONAL_REQUIREMENTS.md |
| **Confidence** | HIGH (AS-IS документы клиники) |
| **Importance** | IMPORTANT |
| **Status** | ACTIVE |
| **Risks** | Нет индексации их содержания (бинарные форматы) |
| **Missing Information** | Текстовые версии для AI-обработки |

---

## КРИТИЧЕСКИ ВАЖНЫЕ ДОКУМЕНТЫ

1. `PROBLEM_ANALYSIS.md` — диагноз всех проблем проекта
2. `DISCOVERY_PLAN.md` — блокирующий артефакт: без Discovery нельзя двигаться
3. `MoM/Summary_Meet_0_to_8.md` — единственный достоверный источник решений заказчика
4. `docs/TECHNICAL_SPECIFICATION.md` v0.2.0 — текущее наилучшее приближение к ТЗ
5. `docs/OPEN_QUESTIONS.md` — 13 критических вопросов, блокирующих Фазу 1
6. `gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md` v1.1 — карта 68 расхождений
7. `roadmap/Indvigo_CRM_Roadmap_v3.md` v3.1 — актуальный план

## УСТАРЕВШИЕ ДОКУМЕНТЫ

1. `MoM/Summary_Meet_1_and_2.md` — заменён на `Summary_Meet_0_to_8.md`
2. `roadmap/archive/Indvigo_CRM_Roadmap_v2.*` — заменён v3.1
3. `roadmap/archive/Roadmap_CRM_v2.*` — дублирует v2
4. `roadmap/archive/03_roadmap_proekta_crm_indvigo.md` — заменён v3.1
5. `demo app/version 2/docs_archive_v0.1.0/` — архивная версия docs/
6. `reference/1С CRM ПРОФ/` — другой продукт, применимость ограничена

## РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ СТРУКТУРЫ АРХИВА

1. **Немедленно:** Создать `discovery/` папку и начать Discovery 1С:Медицина.Поликлиника
2. **До 30.05:** Обновить `docs/FUNCTIONAL_REQUIREMENTS.md` до v0.2.0 (добавить FR-024…FR-026)
3. **До 30.05:** Добавить OQ-021…OQ-027 в `docs/OPEN_QUESTIONS.md`
4. **До 30.05:** Создать `MoM/Meet 9/` краткий протокол как отдельный `MoM/Meet 10 _ 2026 May 26/`
5. **До 30.05:** Обновить `MoM/Summary_Meet_0_to_8.md` до `Summary_Meet_0_to_9.md`
6. **После Discovery:** Переписать `docs/DATA_MODEL.md` v0.3.0 от реальных объектов 1С
7. **После Discovery:** Синхронизировать `params/PARAMETERS_REGISTER.md` с `docs/DATA_MODEL.md`
8. **После Discovery:** Пересчитать `docs/WORK_ESTIMATION.md` и `finance docs/`
9. **Постоянно:** Для каждой встречи создавать транскрипт (сейчас только у Meet 1 и частично Meet 3)
10. **Архив:** Удалить `reference/html presentation/gemini-code-*.html` — происхождение неясно

---

*INDEX_MASTER.md | CRM Индвиго | 2026-05-25 | v1.0*
