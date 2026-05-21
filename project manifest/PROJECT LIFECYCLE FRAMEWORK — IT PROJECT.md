# PROJECT LIFECYCLE FRAMEWORK — IT PROJECT DELIVERY OPERATING MODEL

**Version:** 1.0
**Status:** Draft Baseline
**Audience:** Founders, PM, BA, Architect, Engineering, QA, DevOps, Delivery, Operations
**Scope:** Универсальный жизненный цикл IT-проекта от идеи до эксплуатации и масштабирования

---

# [✅ GENERATED] PROJECT LIFECYCLE OVERVIEW

## Lifecycle Map

| Phase ID | Phase             | Goal                                          | Primary Outputs                | Exit Criteria                    |
| -------- | ----------------- | --------------------------------------------- | ------------------------------ | -------------------------------- |
| PLC-01   | Discovery         | Понять проблему и бизнес-ценность             | Vision, Scope, Stakeholders    | Problem/Solution Fit validated   |
| PLC-02   | Planning          | Спланировать delivery и architecture baseline | PRD, Roadmap, Estimates        | Approved delivery plan           |
| PLC-03   | Design            | Спроектировать систему и контракты            | Architecture, ADR, API, DB     | Design approved                  |
| PLC-04   | Development       | Реализовать функциональность                  | Code, CI/CD, Docs              | Feature-complete increment       |
| PLC-05   | Quality Assurance | Подтвердить качество и readiness              | Test Reports, QA Signoff       | Release candidate approved       |
| PLC-06   | Release           | Выпустить систему                             | Deployment, Release Notes      | Production deployment successful |
| PLC-07   | Operations        | Поддерживать SLA/SLO                          | Monitoring, Runbooks           | Stable operations                |
| PLC-08   | Evolution         | Масштабировать и развивать продукт            | Backlog, Metrics, Improvements | Next iteration planned           |

---

# [✅ GENERATED] HIGH-LEVEL GOVERNANCE MODEL

## Core Roles

| Role               | Responsibility                |
| ------------------ | ----------------------------- |
| Sponsor            | Бизнес-решения, бюджет        |
| Product Owner      | Product backlog, приоритеты   |
| Project Manager    | Delivery, сроки, коммуникации |
| Business Analyst   | Requirements management       |
| Solution Architect | Architecture & tech decisions |
| Engineering Lead   | Technical execution           |
| QA Lead            | Quality strategy              |
| DevOps/SRE         | Infrastructure & operations   |
| Security Officer   | Compliance & security         |
| UX/UI              | User experience               |
| Support Team       | Incident handling             |

---

# [✅ GENERATED] DELIVERY OPERATING PRINCIPLES

## Recommended Principles

### Delivery

* Iterative delivery (Scrum/Kanban/Hybrid)
* Small incremental releases
* Continuous validation
* Early risk detection

### Technical

* API-first
* Infrastructure-as-Code
* CI/CD mandatory
* Observability-first
* Automated testing baseline

### Organizational

* Single source of truth
* Traceability mandatory
* Decision logging (ADR)
* Shift-left QA/Security

---

# [✅ GENERATED] PHASE DETAILS

---

# PLC-01 — DISCOVERY

## Objective

Определить:

* бизнес-проблему
* целевую аудиторию
* KPI успеха
* ограничения
* feasibility

---

## Inputs

| Input            | Source             |
| ---------------- | ------------------ |
| Business idea    | Sponsor            |
| Market analysis  | Product/BA         |
| User interviews  | UX/BA              |
| Existing systems | Architecture       |
| Constraints      | Compliance/Finance |

---

## Activities

| Activity ID | Activity                   | Owner      |
| ----------- | -------------------------- | ---------- |
| DSC-01      | Stakeholder identification | PM/BA      |
| DSC-02      | Problem definition         | Product    |
| DSC-03      | Scope definition           | BA         |
| DSC-04      | Feasibility assessment     | Architect  |
| DSC-05      | Initial risk assessment    | PM         |
| DSC-06      | KPI definition             | Product    |
| DSC-07      | Budget estimation          | PM/Finance |

---

## Deliverables

| Artifact              | Description             |
| --------------------- | ----------------------- |
| Vision Document       | Product vision          |
| Stakeholder Matrix    | Stakeholder mapping     |
| Scope Statement       | In/Out of scope         |
| Business Requirements | High-level requirements |
| Risk Register         | Initial risks           |
| Glossary              | Unified terminology     |

---

## Decision Gates

| Gate  | Criteria                 |
| ----- | ------------------------ |
| DG-01 | Business value validated |
| DG-02 | Budget approved          |
| DG-03 | Feasibility acceptable   |

---

## Outputs

| Output | Consumer          |
| ------ | ----------------- |
| Vision | Planning          |
| Scope  | Planning          |
| Risks  | PMO               |
| KPI    | Product/Analytics |

---

# PLC-02 — PLANNING

## Objective

Подготовить delivery strategy и execution plan.

---

## Inputs

| Input  | Source    |
| ------ | --------- |
| Vision | Discovery |
| Scope  | Discovery |
| Budget | Sponsor   |
| Risks  | Discovery |

---

## Activities

| Activity ID | Activity                      |
| ----------- | ----------------------------- |
| PLN-01      | Requirements elaboration      |
| PLN-02      | Roadmap creation              |
| PLN-03      | Resource planning             |
| PLN-04      | Sprint/release planning       |
| PLN-05      | Technology selection          |
| PLN-06      | Security/compliance planning  |
| PLN-07      | Definition of Done definition |
| PLN-08      | CI/CD planning                |

---

## Deliverables

| Artifact             | Description          |
| -------------------- | -------------------- |
| PRD                  | Product requirements |
| Delivery Roadmap     | Timeline             |
| Estimation Model     | Budget/time          |
| Staffing Plan        | Team allocation      |
| Compliance Matrix    | Regulatory mapping   |
| Initial Backlog      | Epics/features       |
| Risk Mitigation Plan | Risk handling        |

---

## Recommendations

### Recommended Planning Horizon

| Project Type       | Planning Window |
| ------------------ | --------------- |
| Startup MVP        | 1–3 months      |
| Enterprise Product | 6–12 months     |
| Platform/Infra     | 12–24 months    |

---

## Exit Criteria

* Approved roadmap
* Approved budget
* Approved architecture direction
* Delivery model selected

---

# PLC-03 — DESIGN

## Objective

Создать технический blueprint системы.

---

## Inputs

| Input                 | Source     |
| --------------------- | ---------- |
| PRD                   | Planning   |
| NFR                   | Planning   |
| Security requirements | Compliance |

---

## Activities

| Activity ID | Activity                |
| ----------- | ----------------------- |
| DSG-01      | System decomposition    |
| DSG-02      | Architecture definition |
| DSG-03      | API contract design     |
| DSG-04      | Database modeling       |
| DSG-05      | Security design         |
| DSG-06      | Infrastructure design   |
| DSG-07      | ADR creation            |

---

## Deliverables

| Artifact              | Description             |
| --------------------- | ----------------------- |
| Solution Architecture | System overview         |
| ADRs                  | Architecture decisions  |
| API Contracts         | REST/gRPC/Event schemas |
| DB Schema             | Data model              |
| Sequence Diagrams     | Interactions            |
| Threat Model          | Security analysis       |
| Deployment Topology   | Infra layout            |

---

## Recommended Standards

| Area         | Recommendation    |
| ------------ | ----------------- |
| APIs         | OpenAPI           |
| Architecture | C4 Model          |
| Infra        | Terraform         |
| Containers   | Docker/Kubernetes |
| Security     | OWASP ASVS        |
| Auth         | OAuth2/OIDC       |

---

## Exit Criteria

* Architecture review completed
* Security review approved
* API contracts frozen for iteration

---

# PLC-04 — DEVELOPMENT

## Objective

Реализовать продукт с контролируемым quality baseline.

---

## Inputs

| Input         | Source   |
| ------------- | -------- |
| Architecture  | Design   |
| Backlog       | Planning |
| API contracts | Design   |

---

## Activities

| Activity ID | Activity               |
| ----------- | ---------------------- |
| DEV-01      | Environment setup      |
| DEV-02      | Feature implementation |
| DEV-03      | Code review            |
| DEV-04      | CI/CD integration      |
| DEV-05      | Unit testing           |
| DEV-06      | Documentation update   |
| DEV-07      | Security scanning      |

---

## Deliverables

| Artifact                | Description      |
| ----------------------- | ---------------- |
| Source Code             | Application code |
| Infrastructure Code     | IaC              |
| Unit Tests              | Automated tests  |
| Pipelines               | CI/CD            |
| Technical Documentation | Dev docs         |

---

## Recommended Repository Structure

```text
repo/
├── docs/
├── src/
├── tests/
├── infra/
├── scripts/
├── .github/
├── README.md
├── CODEOWNERS
└── CONTRIBUTING.md
```

---

## Development Policies

| Policy    | Recommendation        |
| --------- | --------------------- |
| Branching | Trunk-based/GitFlow   |
| Reviews   | Mandatory PR review   |
| Coverage  | ≥70% unit baseline    |
| Secrets   | Vault/Secrets Manager |
| Linting   | Mandatory             |
| SAST      | Mandatory             |

---

## Exit Criteria

* Feature complete
* CI green
* No critical defects

---

# PLC-05 — QUALITY ASSURANCE

## Objective

Подтвердить соответствие требованиям и quality gates.

---

## Inputs

| Input            | Source      |
| ---------------- | ----------- |
| Source code      | Development |
| Requirements     | Planning    |
| Test environment | DevOps      |

---

## Activities

| Activity ID | Activity            |
| ----------- | ------------------- |
| QA-01       | Test planning       |
| QA-02       | Test case design    |
| QA-03       | Functional testing  |
| QA-04       | Regression testing  |
| QA-05       | Security testing    |
| QA-06       | Performance testing |
| QA-07       | UAT support         |

---

## Deliverables

| Artifact            | Description            |
| ------------------- | ---------------------- |
| Test Plan           | QA strategy            |
| Test Cases          | Verification scenarios |
| Bug Reports         | Defect tracking        |
| QA Metrics          | Quality KPIs           |
| Test Summary Report | Release recommendation |

---

## Recommended Testing Pyramid

| Layer              | Coverage   |
| ------------------ | ---------- |
| Unit               | High       |
| Integration        | Medium     |
| E2E                | Selective  |
| Manual Exploratory | Risk-based |

---

## Exit Criteria

* Critical defects resolved
* UAT approved
* Regression passed

---

# PLC-06 — RELEASE

## Objective

Безопасный и контролируемый production rollout.

---

## Inputs

| Input             | Source     |
| ----------------- | ---------- |
| Release candidate | QA         |
| Infra readiness   | DevOps     |
| Rollback plan     | Operations |

---

## Activities

| Activity ID | Activity                  |
| ----------- | ------------------------- |
| REL-01      | Release validation        |
| REL-02      | Backup creation           |
| REL-03      | Deployment                |
| REL-04      | Smoke testing             |
| REL-05      | Monitoring activation     |
| REL-06      | Stakeholder communication |

---

## Deliverables

| Artifact             | Description         |
| -------------------- | ------------------- |
| Release Notes        | Release summary     |
| Deployment Logs      | Deployment evidence |
| Rollback Plan        | Recovery strategy   |
| Production Checklist | Go-live readiness   |

---

## Recommended Deployment Strategies

| Strategy      | Usage               |
| ------------- | ------------------- |
| Blue-Green    | Low downtime        |
| Canary        | Risk reduction      |
| Rolling       | Kubernetes standard |
| Feature Flags | Controlled rollout  |

---

## Exit Criteria

* Smoke tests passed
* Monitoring stable
* Rollback validated

---

# PLC-07 — OPERATIONS

## Objective

Поддержка стабильной эксплуатации.

---

## Activities

| Activity ID | Activity            |
| ----------- | ------------------- |
| OPS-01      | Monitoring          |
| OPS-02      | Incident management |
| OPS-03      | Capacity management |
| OPS-04      | Backup verification |
| OPS-05      | SLA tracking        |
| OPS-06      | Security patching   |

---

## Deliverables

| Artifact              | Description            |
| --------------------- | ---------------------- |
| Runbooks              | Operational procedures |
| Monitoring Dashboards | Observability          |
| Incident Reports      | RCA                    |
| SLA Reports           | Availability metrics   |

---

## Recommended SRE Metrics

| Metric       | Purpose             |
| ------------ | ------------------- |
| Availability | SLA                 |
| Error Rate   | Reliability         |
| Latency      | UX                  |
| MTTR         | Incident efficiency |
| MTBF         | Stability           |

---

# PLC-08 — EVOLUTION

## Objective

Непрерывное улучшение и масштабирование.

---

## Activities

| Activity ID | Activity                 |
| ----------- | ------------------------ |
| EVO-01      | Product analytics        |
| EVO-02      | Technical debt reduction |
| EVO-03      | Architecture evolution   |
| EVO-04      | Cost optimization        |
| EVO-05      | Scaling initiatives      |

---

## Deliverables

| Artifact            | Description     |
| ------------------- | --------------- |
| Product Insights    | Analytics       |
| Improvement Backlog | Optimizations   |
| Scaling Plan        | Growth strategy |

---

# [✅ GENERATED] CROSS-PHASE ARTIFACT FLOW

| Artifact      | Produced In | Consumed In |
| ------------- | ----------- | ----------- |
| Vision        | Discovery   | Planning    |
| PRD           | Planning    | Design/QA   |
| ADR           | Design      | Development |
| API Contracts | Design      | Dev/QA      |
| Test Cases    | QA          | Release     |
| Runbooks      | Operations  | Support     |
| Metrics       | Operations  | Evolution   |

---

# [✅ GENERATED] QUALITY GATES

| Gate              | Validation                      |
| ----------------- | ------------------------------- |
| Requirements Gate | Scope approved                  |
| Architecture Gate | Design review passed            |
| Security Gate     | Critical vulnerabilities absent |
| QA Gate           | Regression passed               |
| Release Gate      | Go-live checklist completed     |
| Operations Gate   | Monitoring operational          |

---

# [✅ GENERATED] RISK MANAGEMENT MODEL

## Common IT Project Risks

| Risk                   | Mitigation          |
| ---------------------- | ------------------- |
| Scope creep            | Change management   |
| Unclear requirements   | Discovery workshops |
| Technical debt         | ADR + code reviews  |
| Environment drift      | IaC                 |
| Knowledge silos        | Documentation       |
| Production instability | Observability       |

---

# [✅ GENERATED] RECOMMENDED TOOLCHAIN

| Domain             | Recommended Tools            |
| ------------------ | ---------------------------- |
| Project Management | Jira, Linear                 |
| Documentation      | Confluence, Notion, MkDocs   |
| Source Control     | GitHub, GitLab               |
| CI/CD              | GitHub Actions, GitLab CI    |
| IaC                | Terraform                    |
| Monitoring         | Prometheus, Grafana          |
| Logging            | ELK/OpenSearch               |
| Incident Mgmt      | PagerDuty                    |
| Testing            | Playwright, Cypress, Postman |

---

# [✅ GENERATED] DEVOPS & CI/CD BASELINE

## Recommended Pipeline

```text
Commit
  ↓
Lint
  ↓
Unit Tests
  ↓
SAST
  ↓
Build
  ↓
Integration Tests
  ↓
Container Scan
  ↓
Deploy to Staging
  ↓
E2E Tests
  ↓
Approval
  ↓
Production Deploy
```

---

# [✅ GENERATED] DOCUMENTATION MODEL

## Mandatory Documentation Set

| Document       | Mandatory |
| -------------- | --------- |
| Vision         | YES       |
| PRD            | YES       |
| ADR            | YES       |
| API Spec       | YES       |
| Runbooks       | YES       |
| Security Model | YES       |
| Test Strategy  | YES       |
| Release Notes  | YES       |

---

# [✅ GENERATED] TRACEABILITY MODEL

## Traceability Chain

```text
Business Goal
  ↓
Requirement
  ↓
Epic
  ↓
Story
  ↓
Task
  ↓
Code Commit
  ↓
Test Case
  ↓
Release
  ↓
Monitoring Metric
```

---

# [QC-REPORT]

| Check       | Status  | Notes                                 |
| ----------- | ------- | ------------------------------------- |
| Coverage    | PASS    | Covered full lifecycle                |
| Consistency | PASS    | Unified terminology                   |
| Ambiguity   | MINOR   | Methodology depends on org maturity   |
| Testability | PASS    | QA phase defined                      |
| Compliance  | PARTIAL | Requires project-specific regulations |

---

# [TRACEABILITY-MATRIX]

| REQ-ID      | Artifact      | Related Phase | Validation          |
| ----------- | ------------- | ------------- | ------------------- |
| PLC-REQ-001 | Vision        | Discovery     | DG-01               |
| PLC-REQ-002 | PRD           | Planning      | Requirements Review |
| PLC-REQ-003 | Architecture  | Design        | Architecture Review |
| PLC-REQ-004 | Source Code   | Development   | CI/CD               |
| PLC-REQ-005 | Test Cases    | QA            | QA Signoff          |
| PLC-REQ-006 | Release Notes | Release       | Go-Live             |
| PLC-REQ-007 | Runbooks      | Operations    | Ops Review          |

---

# [NEXT-ACTIONS]

| Action                                            | Owner             | Deadline |
| ------------------------------------------------- | ----------------- | -------- |
| Адаптировать lifecycle под конкретную организацию | PMO / CTO         | T+5d     |
| Определить SDLC methodology (Scrum/Kanban/Hybrid) | Delivery Lead     | T+3d     |
| Создать шаблоны артефактов и governance process   | Architecture + QA | T+7d     |

```
```
