# RELATIONS MAP — CRM Индвиго

**Версия:** 1.0  
**Дата:** 2026-05-25  
**Источник:** AI Index Architect

---

## 1. Файл → Файл

| Source | Relation | Target | Confidence |
|--------|----------|--------|-----------|
| README.md | ссылается на / описывает | docs/INDEX.md | HIGH |
| README.md | ссылается на | MoM/Summary_Meet_0_to_8.md | HIGH |
| README.md | ссылается на | gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md | HIGH |
| README.md | ссылается на | roadmap/Indvigo_CRM_Roadmap_v3.md | HIGH |
| README.md | ссылается на | docs/OPEN_QUESTIONS.md | HIGH |
| INDEX.md (корневой) | описывает состав | Все подпапки репозитория | HIGH |
| PROBLEM_ANALYSIS.md | диагностирует | docs/DATA_MODEL.md (П-3) | HIGH |
| PROBLEM_ANALYSIS.md | диагностирует | finance docs/finance_budget_analysis.md (П-5) | HIGH |
| PROBLEM_ANALYSIS.md | диагностирует | reference/1С CRM ПРОФ/ (П-7) | HIGH |
| PROBLEM_ANALYSIS.md | диагностирует | docs/WORK_ESTIMATION.md (П-4) | HIGH |
| PROBLEM_ANALYSIS.md | порождает | DISCOVERY_PLAN.md | HIGH |
| DISCOVERY_PLAN.md | заменит | concept/figma_mockup/ | HIGH |
| DISCOVERY_PLAN.md | создаст | blueprint_1c/ (не существует) | HIGH |
| DISCOVERY_PLAN.md | обновит | docs/DATA_MODEL.md (→ v0.3.0) | HIGH |
| MoM/Summary_Meet_0_to_8.md | заменяет | MoM/Summary_Meet_1_and_2.md | HIGH |
| MoM/Summary_Meet_0_to_8.md | консолидирует | MoM/Meet 0/…Meet 8/ | HIGH |
| MoM/Meet 0…9/ | является источником для | gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md | HIGH |
| MoM/Meet 0…9/ | является источником для | docs/FUNCTIONAL_REQUIREMENTS.md | HIGH |
| FR from Business Stakeholder/FR_v02.md | является источником для | docs/FUNCTIONAL_REQUIREMENTS.md | HIGH |
| FR from Business Stakeholder/FR_v02.md | является источником для | docs/REQUIREMENTS_TRACEABILITY_MATRIX.md | HIGH |
| gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md | породил | roadmap/Indvigo_CRM_Roadmap_v3.md Фаза 0.2 | HIGH |
| gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md | суммирован в | gap/GAP_ANALYSIS_EXECUTIVE_SUMMARY.md | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md | трассируется в | docs/REQUIREMENTS_TRACEABILITY_MATRIX.md | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md | проверяется через | docs/TEST_CASES.md | HIGH |
| docs/DATA_MODEL.md | КОНФЛИКТУЕТ с | params/PARAMETERS_REGISTER.md | HIGH |
| docs/DATA_MODEL.md | КОНФЛИКТУЕТ с | params/OBJECTS_MATRIX.md | HIGH |
| docs/WORK_ESTIMATION.md | КОНФЛИКТУЕТ с | finance docs/finance_budget_analysis.md | HIGH |
| docs/TECHNICAL_SPECIFICATION.md | включает | docs/FUNCTIONAL_REQUIREMENTS.md (§6) | HIGH |
| docs/TECHNICAL_SPECIFICATION.md | включает | docs/DATA_MODEL.md (§7) | HIGH |
| docs/TECHNICAL_SPECIFICATION.md | включает | docs/INTEGRATIONS.md (§8–9) | HIGH |
| docs/OPEN_QUESTIONS.md | блокирует | docs/INTEGRATIONS.md (OQ-005) | HIGH |
| docs/OPEN_QUESTIONS.md | блокирует | finance docs/ (OQ-001) | HIGH |
| roadmap/Indvigo_CRM_Roadmap_v3.md | планирует обновление | docs/ (→ v0.3.0 после Discovery) | HIGH |
| roadmap/archive/ | заменён | roadmap/Indvigo_CRM_Roadmap_v3.md | HIGH |
| demo app/version 2/docs_archive_v0.1.0/ | архивная копия | docs/ (текущая) | HIGH |
| backlog/Medical_CRM_Strategy_Checklist_RU.md | источник идей для | docs/FR (Фаза 3) | MEDIUM |
| concept/figma_mockup/ | концептуальный UI для | docs/TECHNICAL_SPECIFICATION.md | MEDIUM |
| reference/1С CRM ПРОФ/ | не применимо напрямую к | docs/FUNCTIONAL_REQUIREMENTS.md | HIGH |
| reglaments docs/ | AS-IS процессы → основа для | DISCOVERY_PLAN.md §3.3 | MEDIUM |
| project manifest/PLF.md | методология для | DISCOVERY_PLAN.md | LOW |

---

## 2. Файл → Сущность

| Source | Relation | Target | Confidence |
|--------|----------|--------|-----------|
| docs/FUNCTIONAL_REQUIREMENTS.md FR-001 | определяет | Пациент (Карточка пациента) | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-002 | определяет | CRM_Заказ | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-003 | определяет | Воронка продаж (9 статусов) | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-004 | определяет | Теги пациента (предопределённые + личные) | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-005 | определяет | ABC-сегментация | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-006 | определяет | CRM_Задача | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-007 | определяет | Триггер +3 дня | HIGH |
| docs/FUNCTIONAL_REQUIREMENTS.md FR-011 | определяет | Помощник куратора (роль) | HIGH |
| docs/DATA_MODEL.md | моделирует | CRM_Заказ, ФизическиеЛица, CRM_Кураторы | HIGH |
| params/PARAMETERS_REGISTER.md | описывает атрибуты | Справочник.Пациенты (КОНФЛИКТ) | HIGH |
| params/OBJECTS_MATRIX.md | перечисляет | 101 объект 1С (включая устаревший Документ.Сделка) | HIGH |
| MoM/Meet 4/ | вводит | Помощник куратора (роль) | HIGH |
| MoM/Meet 5/ | вводит | Заказ (замена Сделке) | HIGH |
| MoM/Meet 7/ | вводит | Ортопедия как отдельный заказ | HIGH |
| MoM/Meet 8/ | вводит | Теги: предопределённые + личные | HIGH |
| MoM/Meet 9/ | уточняет | Дожим (местные 3 дн / иногородние 10 дн) | HIGH |

---

## 3. Сущность → Сущность

| Source | Relation | Target | Confidence |
|--------|----------|--------|-----------|
| Куратор | ведёт | Пациент | HIGH |
| Куратор | создаёт | CRM_Заказ | HIGH |
| Куратор | выполняет | CRM_Задача | HIGH |
| Помощник куратора | работает под | Куратор | HIGH |
| Помощник куратора | исключает | ДМС-пациенты | HIGH |
| РОП | контролирует | Куратор | HIGH |
| РОП | управляет | Распределение нагрузки | HIGH |
| Врач | создаёт | Консультационный лист → CRM_Заказ | MEDIUM |
| ЦОЗ | отправляет напоминания | Пациент (без обсуждения оплаты) | HIGH |
| CRM_Заказ | привязан к | Пациент (ФизическиеЛица) | HIGH |
| CRM_Заказ | имеет | Статус воронки (CRM_СтатусыЗаказа) | HIGH |
| CRM_Заказ | имеет | Тип приёма (первичный/повторный/промежуточный/финальный) | HIGH |
| CRM_Заказ (ортопедия) | отдельен от | CRM_Заказ (основной) | HIGH |
| CRM_Задача | создаётся триггером | +3 дня после первичного | HIGH |
| CRM_Задача | создаётся триггером | +6 мес. после финальной консультации | HIGH |
| ABC-сегментация | категоризирует | Пациент | HIGH |
| Теги | описывают | Пациент | HIGH |
| Абонемент | привязан к | Пациент | HIGH |
| Дожим | применяется к | Пациент (по географии) | HIGH |

---

## 4. Процесс → Система

| Process | System | Details | Confidence |
|---------|--------|---------|-----------|
| Запись пациента | 1С:Медицина.Поликлиника | Расписание, типовые объекты | HIGH |
| Ведение заказа | CRM расширение (.cfe) | CRM_Заказ, статусы, задачи | HIGH |
| Дожим (местные) | CRM задачи + звонок | +3 дня после приёма | HIGH |
| Дожим (иногородние) | CRM задачи + WhatsApp | +10 дней после приёма | HIGH |
| Оплата | 1С:Медицина или 1С:Бухгалтерия | OQ-001 не закрыт | MEDIUM |
| ABC-сегментация | CRM расширение | Ручная или автоматическая? | MEDIUM |
| Напоминания | WhatsApp / Telegram | Провайдер не выбран | MEDIUM |
| QR-оплата иногородним | Внешний эквайринг | OQ неопределён | LOW |

---

## 5. Проблема → Решение → Риск

| Problem | Solution | Risk |
|---------|----------|------|
| Нет Discovery (П-1) | DISCOVERY_PLAN.md — 5 дней, 104 ч | Нет доступа к продуктивной БД |
| Нет форм 1С (П-2) | blueprint_1c/ после Discovery | Реальная структура форм неизвестна |
| Конфликт DM vs params/ (П-3) | Единый канон — docs/DM после Discovery | До Discovery — два несовместимых документа |
| Нереалистичные сроки (П-4) | Пересчёт после Discovery, MVP-приземление | Заказчик ожидает MVP в June |
| Финансовый разрыв 4x (П-5) | Пересчёт трудоёмкости, сокращение scope | Разрыв бюджет/оценка может заблокировать проект |
| 13 критических OQ (П-6) | Интервью Discovery (87 вопросов) | Часть OQ требует решения бизнеса, не только Discovery |
| Reference — другой продукт (П-7) | DISCLAIMER.md добавлен | Риск остаточного влияния на дизайн |
| Дублирование документов (П-8) | Архивирование (docs_archive_v0.1.0, roadmap/archive) | Требует постоянного контроля |

---

*RELATIONS.md | CRM Индвиго | 2026-05-25 | v1.0*
