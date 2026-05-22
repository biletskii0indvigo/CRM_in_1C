# Пакет документов по проекту CRM Индвиго

**Версия:** v0.11
**Последнее обновление:** 2026-05-21

> **Изменения v0.11 vs v0.10 (приземление по `PROBLEM_ANALYSIS.md` §6):**
> - 📂 `RAW BR/` → переименована в **`backlog/`** (это идеи, не требования MVP).
> - 📂 `blueprint (forms and screen)/` → перенесена в **`concept/figma_mockup/`** + добавлен `DISCLAIMER.md` (не 1С-формы).
> - 📂 `reference/1С CRM/` → переименована в **`reference/1С CRM ПРОФ (другой продукт)/`** + `DISCLAIMER.md` (другой продукт фирмы 1С).
> - 📂 `roadmap/` — `Indvigo_CRM_Roadmap_v2.*`, `Roadmap_CRM_v2.*`, `03_roadmap_proekta_crm_indvigo.md` перенесены в **`roadmap/archive/`**.
> - 📂 `demo app/version 2/docs/` → переименована в **`docs_archive_v0.1.0/`** + `ARCHIVE_NOTE.md`.
> - 📝 Добавлены `STATUS_DISCLAIMER.md` в `docs/`, `params/`, `finance docs/`, `gap/`.
> - 🆕 Добавлен **`DISCOVERY_PLAN.md`** — подробный план обследования 1С:Медицина.Поликлиника.
>
> **Изменения v0.10 vs v0.9:**
> - Добавлен **`PROBLEM_ANALYSIS.md`** — критический разбор проблемных мест проекта и предложение по приземлению до реализуемого MVP.
> - Добавлены **`INDEX.md` в каждую подпапку**.
>
> **Изменения v0.9 vs v0.8:** Добавлен файл `MoM/Summary_Meet_0_to_8.md` (консолидированная сводка); обновлены ссылки и версии для GAP-анализа (v1.1), Roadmap (v3.1), README (v0.2.0), docs/TS и docs/INDEX (v0.2.0).

---

## ⚠️ Прочитать в первую очередь

| Документ | Назначение |
|----------|-----------|
| [`PROBLEM_ANALYSIS.md`](./PROBLEM_ANALYSIS.md) | **Критический разбор:** что не так в текущем пакете, какие нестыковки, какой реалистичный MVP, что делать дальше |
| [`MoM/Summary_Meet_0_to_8.md`](./MoM/Summary_Meet_0_to_8.md) | Доказательная сводка всех 9 встреч с заказчиком |
| [`gap/GAP_ANALYSIS_EXECUTIVE_SUMMARY.md`](./gap/GAP_ANALYSIS_EXECUTIVE_SUMMARY.md) | GAP-анализ — 68 расхождений между документами |

---

## 📁 Структура репозитория

### Корневые документы
| Файл | Описание |
|------|----------|
| `README.md` | Основная информация о проекте |
| `INDEX.md` | Индекс структуры репозитория |
| **`PROBLEM_ANALYSIS.md`** 🆕 | **Критический анализ проблем + предложение по реализуемому MVP** |
| `.gitignore` | Настройки игнорирования Git |

### Локальные INDEX-файлы по подпапкам

Каждая подпапка имеет свой `INDEX.md` с описанием состава, проблем и рекомендаций:

| Папка | Локальный индекс | Статус |
|-------|-----------------|--------|
| `MoM/` | [`MoM/INDEX.md`](./MoM/INDEX.md) | ✅ Канон (факты) |
| `FR from Business Stakeholder/` | [`FR from Business Stakeholder/INDEX.md`](./FR%20from%20Business%20Stakeholder/INDEX.md) | ⚠️ Гипотезы |
| `backlog/` 🔄 | [`backlog/INDEX.md`](./backlog/INDEX.md) + [`DISCLAIMER`](./backlog/DISCLAIMER.md) | 📦 Идеи (бывш. `RAW BR/`) |
| `roadmap/` | [`roadmap/INDEX.md`](./roadmap/INDEX.md) | v3 актуален, v2 → `roadmap/archive/` |
| `gap/` | [`gap/INDEX.md`](./gap/INDEX.md) + [`STATUS`](./gap/STATUS_DISCLAIMER.md) | ✅ Ценный артефакт, ждёт v1.2 |
| `concept/figma_mockup/` 🔄 | [`INDEX`](./concept/figma_mockup/INDEX.md) + [`DISCLAIMER`](./concept/figma_mockup/DISCLAIMER.md) | ⚠️ Не 1С-формы (бывш. `blueprint (forms and screen)/`) |
| `demo app/` | [`demo app/INDEX.md`](./demo%20app/INDEX.md) | Концепт-прототип |
| `finance docs/` | [`finance docs/INDEX.md`](./finance%20docs/INDEX.md) + [`STATUS`](./finance%20docs/STATUS_DISCLAIMER.md) | 🔴 Требует пересчёта |
| `project manifest/` | [`project manifest/INDEX.md`](./project%20manifest/INDEX.md) | Методология |
| `reference/` | [`reference/INDEX.md`](./reference/INDEX.md) | См. `reference/1С CRM ПРОФ (другой продукт)/DISCLAIMER.md` |
| `docs/` | [`docs/INDEX.md`](./docs/INDEX.md) + [`STATUS`](./docs/STATUS_DISCLAIMER.md) | ⚠️ «Первоначальная фиксация», не утв. ТЗ |
| `params/` | [`params/INDEX.md`](./params/INDEX.md) + [`STATUS`](./params/STATUS_DISCLAIMER.md) | 📦 Расширенный бэклог |

### 📂 Протоколы встреч (`MoM/`)
Документация по встречам с Заказчиком:

#### Общие документы
| Файл | Описание |
|------|----------|
| `Indvigo_CRM_Meeting_Analysis.docx` | Анализ встреч (DOCX) |
| `Indvigo_CRM_Meeting_Analysis.md` | Анализ встреч (Markdown) |
| `Summary_Meet_1_and_2.docx` | Сводное резюме встреч 1 и 2 (DOCX) — устаревшее |
| `Summary_Meet_1_and_2.md` | Сводное резюме встреч 1 и 2 (Markdown) — устаревшее |
| `Summary_Meet_0_to_8.md` 🆕 | **Консолидированное резюме всех 9 встреч (Meet 0–8) — актуальная сводка** |

#### Встреча 0 (2026 апрель 14)
- `Meet 0 _ 2026 April 14 (with SH)/`
  - `202160403 _ SUMMARY MEET.docx` — резюме встречи (DOCX)
  - `202160403 _ SUMMARY MEET.md` — резюме встречи (Markdown)
  - `CRM CHECK.docx` — чек-лист (DOCX)
  - `CRM CHECK.md` — чек-лист (Markdown)

#### Встреча 1 (2026 апрель 28)
- `Meet 1 _ 2026 April 28 (with SH)/`
  - `01_resume_vstrechi_1_indvigo_crm.md` — резюме встречи
  - `Indvigo_CRM_Meet1_Analyst.docx` — анализ встречи (DOCX)
  - `Indvigo_CRM_Meet1_Analyst.md` — анализ встречи (Markdown)
  - `indvigo_crm_meeting_1_protocol_tasks_transcript_v0_1/`
    - `01_predvaritelnyy_protokol_vstrechi_1_indvigo_crm.md` — предварительный протокол
    - `02_perechen_zadach_vstrechi_1_indvigo_crm.md` — перечень задач
    - `03_transkribaciya_vstrechi_1_indvigo_crm.md` — транскрибация
  - `video_2026-04-28_160328_indvigo-crm-1Meet.pdf` — видеозапись встречи (PDF)

#### Встреча 2 (2026 апрель 30)
- `Meet 2 _ 2026 April 30 (with SH)/`
  - `02_resume_vstrechi_2_indvigo_crm.md` — резюме встречи
  - `Indvigo_CRM_Summary_Meet2.docx` — резюме встречи (DOCX)
  - `Indvigo_CRM_Summary_Meet2.md` — резюме встречи (Markdown)
  - `Voice-260430_152844-discussion-crm.pdf` — аудиозапись обсуждения (PDF)

#### Встреча 3 (2026 май 05)
- `Meet 3 _ 2026 May 05 (with SH)/`
  - `0505.md` — протокол встречи

#### Встреча 4 (2026 май 08)
- `Meet 4 _ 2026 May 08 (with SH)/`
  - `screen_1778242529135.docx` — скриншот/материалы (DOCX)
  - `screen_1778242529135.md` — скриншот/материалы (Markdown)

#### Встреча 5 (2026 май 13)
- `Meet 5 _ 2026 May 13 (with SH)/`
  - `05141.docx` — материалы встречи (DOCX)
  - `05141.md` — материалы встречи (Markdown)

#### Встреча 6 (2026 май 14)
- `Meet 6 _ 2026 May 14 (with SH)/`
  - `voice-260514_142026-qa-CDoS.docx` — опрос/обсуждение (DOCX)
  - `voice-260514_142026-qa-CDoS.md` — опрос/обсуждение (Markdown)

#### Встреча 7 (2026 май 19)
- `Meet 7 _ 2026 May 19 (with SH)/`
  - `05201.docx` — материалы встречи (DOCX)
  - `05201.md` — материалы встречи (Markdown)

#### Встреча 8 (2026 май 20)
- `Meet 8 _ 2026 May 20 (with SH)/`
  - `video_2026-05-20_150904_индвигоmeet8-_-may-20.docx` — материалы встречи (DOCX)
  - `video_2026-05-20_150904_индвигоmeet8-_-may-20.md` — материалы встречи (Markdown)

### 📂 Функциональные требования (`FR from Business Stakeholder/`)
| Файл | Описание |
|------|----------|
| `04_functional_requirements_proekta_crm_indvigo.md` | Функциональные требования (Markdown) |
| `Indvigo_CRM_Functional Requirements_v02.docx` | Функциональные требования (DOCX, v02) |
| `Indvigo_CRM_Functional Requirements_v02.md` | Функциональные требования (Markdown, v02) |
| `e1cib/data/Functional Requirements_v0.2.docx` | Функциональные требования (DOCX, v0.2, данные 1С) |
| `e1cib/data/Functional Requirements_v0.2.md` | Функциональные требования (Markdown, v0.2, данные 1С) |

### 📂 Дорожная карта (`roadmap/`)
| Файл | Описание | Статус |
|------|----------|--------|
| `Indvigo_CRM_Roadmap_v3.md` | Роадмап (Markdown, v3) | ✅ Актуальный |
| `archive/03_roadmap_proekta_crm_indvigo.md` | Роадмап проекта (Markdown) | 🗄️ Архив |
| `archive/Indvigo_CRM_Roadmap_v2.docx` | Роадмап (DOCX, v2) | 🗄️ Архив |
| `archive/Indvigo_CRM_Roadmap_v2.md` | Роадмап (Markdown, v2) | 🗄️ Архив |
| `archive/Roadmap_CRM_v2.docx` | Роадмап (DOCX, v2) | 🗄️ Архив |
| `archive/Roadmap_CRM_v2.md` | Роадмап (Markdown, v2) | 🗄️ Архив |

### 📂 Бэклог идей (`backlog/`) 🔄 *бывшая `RAW BR/`*
| Файл | Описание |
|------|----------|
| `DISCLAIMER.md` 🆕 | Дисклеймер: идеи, не требования MVP |
| `Medical_CRM_Strategy_Checklist_RU.md` | Чек-лист стратегии медицинской CRM |

### 📂 Финансовые документы (`finance docs/`)
| Файл | Описание |
|------|----------|
| `Budget.xlsx` | Бюджет проекта (Excel) |
| `finance_budget_analysis.md` | Анализ бюджета (Markdown) |

### 📂 Анализ разрывов (`gap/`)
| Файл | Описание |
|------|----------|
| `GAP_ANALYSIS_EXECUTIVE_SUMMARY.md` | Резюме GAP-анализа для руководства |
| `GAP_ANALYSIS_README_vs_MoM_FR_BR.md` | Анализ разрывов между README, MoM, FR, BR |

### 📂 Манифест проекта (`project manifest/`)
| Файл | Описание |
|------|----------|
| `PROJECT LIFECYCLE FRAMEWORK — IT PROJECT.md` | Фреймворк жизненного цикла IT-проекта |

### 📂 Концепт-макеты (`concept/figma_mockup/`) 🔄 *бывшая `blueprint (forms and screen)/`*
| Файл | Описание |
|------|----------|
| `DISCLAIMER.md` 🆕 | Дисклеймер: это НЕ формы 1С, только концепт |
| `figma_blueprint_crm_1_c_medicine_module_v_1.md` | Blueprint CRM для медицины (Figma) |

> 📌 Будущая папка `blueprint_1c/` — для реальных скриншотов управляемых форм 1С (после Discovery).

### 📂 Справочные материалы (`reference/`)

> ⚠️ Папка `reference/1С CRM/` переименована в **`reference/1С CRM ПРОФ (другой продукт)/`** — это документация ДРУГОГО продукта (1С:CRM ПРОФ ≠ 1С:Медицина.Поликлиника). См. `DISCLAIMER.md` в этой папке.

#### 1С CRM ПРОФ — Управление обращениями и заявками клиентов (управление лидами)
- `ч.0 Оглавление.pdf`
- `ч.1 Форму обратной связи на сайте в решении 1С_CRM.pdf`
- `ч.2 Как настроить интеграцию 1C_CRM с Живосайтом для общения с клиентами на сайте.pdf`
- `ч.3 В программе 1C_CRM можно получать заявки от сервиса-ловца лидов Roistat.pdf`
- `ч.4 1C CRM – как в систему загрузить сделки, контакты и компании из amoCRM.pdf`
- `ч.5 Лиды – что такое и как с ним работать. Работа с лидами в 1C CRM.pdf`
- `ч.6 Как в программе 1C_CRM обрабатывать обращения и заявки от клиентов.pdf`
- `ч.7 1С_CRM – настройте правила автоматической обработки входящих email, сообщений в мессенджерах или заявок.pdf`
- `ч.8 1C CRM – инструкция по регистрации и обработке заявок в программе.pdf`
- `ч.9 Как в программе 1С_CRM управлять сроками обработки обращений.pdf`

#### 1С CRM — Управление сделками и продажами
- `ч.0 Оглавление.pdf`
- `ч.1 1С_CRM – как работать с интересами клиента в программе.pdf`
- `ч.2 Как настроить сценарии работы с Интересами клиентов в программе 1C_CRM, что такое Состояние интереса.pdf`
- `ч.3 Работа с карточкой Интерес клиента в программе 1C_CRM, какие задать настройки.pdf`
- `ч.4 1С_CRM, редакция 3.1 – новый инструмент для работы с интересом – чек-лист.pdf`
- `ч.5 Как в 1С_CRM задать триггеры для автоматизации стандартных операций.pdf`
- `ч.6 Пример 1. Типовая продажа (настройка сценария руководителем).pdf`
- `ч.7 Описание процесса работы менеджера по продажам в программе 1C CRM, типовая продажа.pdf`
- `ч.8 Пример автоматизации работы компании при помощи программы 1С_CRM, если есть продажи с доставкой.pdf`
- `ч.9 1C CRM – документ Интереса клиента для отражения запросов клиентов и последующих продаж.pdf`
- `ч.10 АРМ Мои продажи. Работа с Интересами в режиме Канбан.pdf`
- `ч.11 1C_CRM – работа менеджера по взаимодействиям с клиентами в программе crm.pdf`
- `ч.12 Формирование и печать коммерческих предложений.pdf`
- `ч.13 Как добавить соисполнителя и поменять ответственного за интерес в 1C CRM.pdf`
- `ч.14 Как вести учет договоров с клиентами в решении 1С_CRM, создание, заполнение и печать договора с контрагентом.pdf`
- `ч.15 Модуль Путь клиента в программе 1C_CRM – где расположен, что содержит, какие задачи выполняет и как с ним работать.pdf`
- `ч.16 Как выглядит отчет Воронка продаж в программе 1С_CRM и как с ним работать.pdf`
- `ч.17 Формирование плана продаж.pdf`
- `ч.18 1C_CRM – автоматизированное рабочее место Монитор руководителя в системе crm.pdf`
- `ч.19 Новая воронка продаж.pdf`
- `ч.20 Как настроить интеграцию 1С_CRM и магазина ВКонтакте.pdf`
- `ч.21 1C CRM – как происходит обмен данными системы с сайтом.pdf`
- `ч.22 Система 1С_CRM – возможности интеграции с 1С_Бухгалтерией предприятия, редакция 3.0.pdf`
- `ч.23 Настройка интеграции с 1С_Бухгалтерия предприятия.pdf`

#### HTML презентации (`html presentation/`)
| Файл | Описание |
|------|----------|
| `crm_1c_interactive.html` | Интерактивная презентация 1С CRM |
| `crm_1c_interactive (1).html` | Интерактивная презентация 1С CRM (копия) |
| `crm_1c_meditsina_figma_prototype.html` | Прототип Figma для 1С Медицина |
| `crm_1c_processing.html` | Обработка 1С CRM |
| `Demo.html` | Демонстрационная презентация |
| `Reference.html` | Реферальная программа |
| `gemini-code-1778660249911.html` | Код Gemini |

### 📂 Демо приложение (`demo app/`)

#### Версия 1 (`version 1/`)
| Файл | Описание |
|------|----------|
| `CRM Институт Движения.html` | HTML-демо интерфейса CRM |
| `app.js` | JavaScript логика демо приложения |
| `data.js` | Данные для демо приложения |

#### Версия 2 (`version 2/`)
| Файл | Описание |
|------|----------|
| `CRM Институт Движения.html` | HTML-демо интерфейса CRM v2 |
| `app.js` | JavaScript логика демо приложения v2 |
| `data.js` | Данные для демо приложения v2 |
| `delta1.js` | Delta 1 изменения |
| `delta3.js` | Delta 3 изменения |
| `screens_phase2.js` | Скрины фазы 2 |
| `docs_archive_v0.1.0/` 🔄 | 🗄️ **АРХИВ** v0.1.0 (бывш. `docs/`), не редактировать (см. `ARCHIVE_NOTE.md`) |
| `uploads/` | Медиафайлы (видео, изображения) |

##### Архивная документация (`demo app/version 2/docs_archive_v0.1.0/`) 🗄️
| Файл | Описание |
|------|----------|
| `INDEX.md` | Навигационный документ версии 2 |
| `TECHNICAL_SPECIFICATION.md` | Техническая спецификация |
| `FUNCTIONAL_REQUIREMENTS.md` | Функциональные требования |
| `DATA_MODEL.md` | Модель данных |
| `INTEGRATIONS.md` | Интеграции |
| `NON_FUNCTIONAL_REQUIREMENTS.md` | Нефункциональные требования |
| `WORK_ESTIMATION.md` | Оценка трудозатрат |
| `TEST_CASES.md` | Тест-кейсы |
| `OPEN_QUESTIONS.md` | Открытые вопросы |
| `REQUIREMENTS_TRACEABILITY_MATRIX.md` | Матрица трассировки требований |
| `CHANGELOG.md` | История изменений |
| `GAP_ANALYSIS_EXECUTIVE_SUMMARY.md` | Резюме GAP-анализа |
| `GAP_ANALYSIS_README_vs_MoM_FR_BR.md` | Анализ разрывов |
| `DELTA1_GAP_CLOSURE.md` | Закрытие разрывов Delta 1 |
| `DELTA2_TEST_GAP_REPORT.md` | Отчёт по тестированию Delta 2 |
| `DELTA3_GAP_CLOSURE.md` | Закрытие разрывов Delta 3 |
| `DELTA4_TASK_BP_REVIEW.md` | Обзор бизнес-процессов Delta 4 |
| `figma_blueprint_crm_1_c_medicine_module_v_1.md` | Blueprint Figma |
| `figma_blueprint_v2.md` | Blueprint v2 |

---

## 📂 Проектная документация (`docs/`)

Основной пакет проектной документации находится в директории [`docs/`](./docs/):

| Файл | Описание |
|------|----------|
| [docs/INDEX.md](./docs/INDEX.md) | Навигационный документ, карта документации |
| [docs/TECHNICAL_SPECIFICATION.md](./docs/TECHNICAL_SPECIFICATION.md) | Полная техническая спецификация |
| [docs/FUNCTIONAL_REQUIREMENTS.md](./docs/FUNCTIONAL_REQUIREMENTS.md) | Функциональные требования |
| [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) | Модель данных: метаданные 1С, объекты расширения |
| [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md) | Интеграции: 1С:Медицина, WhatsApp, Telegram, телефония |
| [docs/NON_FUNCTIONAL_REQUIREMENTS.md](./docs/NON_FUNCTIONAL_REQUIREMENTS.md) | НФТ: производительность, безопасность, масштабируемость |
| [docs/WORK_ESTIMATION.md](./docs/WORK_ESTIMATION.md) | Оценка трудозатрат по фазам и ролям |
| [docs/TEST_CASES.md](./docs/TEST_CASES.md) | Приёмочные тест-кейсы (BDD-формат) |
| [docs/OPEN_QUESTIONS.md](./docs/OPEN_QUESTIONS.md) | Открытые вопросы |
| [docs/REQUIREMENTS_TRACEABILITY_MATRIX.md](./docs/REQUIREMENTS_TRACEABILITY_MATRIX.md) | Матрица трассировки FR ↔ источники ↔ TC |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | История изменений документации |

> **Начните с [`docs/INDEX.md`](./docs/INDEX.md)** — там карта всей документации и рекомендуемый порядок чтения для разных ролей.
> ⚠️ См. [`docs/STATUS_DISCLAIMER.md`](./docs/STATUS_DISCLAIMER.md) — текущая версия `docs/` это «первоначальная фиксация», не утв. ТЗ.

---

## 🔍 Discovery 1С:Медицина.Поликлиника

| Документ | Описание |
|----------|----------|
| [`DISCOVERY_PLAN.md`](./DISCOVERY_PLAN.md) 🆕 | **Подробный план обследования** — что изучить, в какой последовательности, что задокументировать, что заскриншотить, что уточнить у заказчика, какие формы и списки нужны для blueprint |

---

## ℹ️ Примечания

- Документы являются рабочей версией. Перед передачей как финального протокола требуется ручная сверка транскриптов, имён, терминов и спорных фраз.
- Основание документов: PDF-транскрибации и AI-протоколы встреч.
- Актуальная версия проектной документации: **v0.2.0 (2026-05-21)** — TS и INDEX (docs/) обновлены для Meet 7–8; часть детальных документов (FR, DM, OQ, TC, RTM, WE) — на v0.1.0, обновление запланировано в Фазе 0.2 (см. `roadmap/Indvigo_CRM_Roadmap_v3.md` v3.1).
- Актуальная сводка встреч: `MoM/Summary_Meet_0_to_8.md`.
- Актуальный GAP-анализ: `gap/GAP_ANALYSIS_README_vs_MoM_FR_BR.md` v1.1.
