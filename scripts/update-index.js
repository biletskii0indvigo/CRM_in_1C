const fs = require('fs');
const path = require('path');

// --- Конфигурация ---
const SRC_DIR = process.env.SRC_DIR || './src';
const OUTPUT_FILE = 'INDEX.md';

const IGNORE_DIRS = new Set(['node_modules', '.git', '.github', 'scripts', 'build']);

// Те самые невидимые маркеры, которые ищет скрипт
const START_MARKER = '';
const END_MARKER = '';

const MODULE_RULES = [
    { pattern: /Subsystems[\\/]CRM|DataProcessors[\\/]CRM_/, name: 'Модуль CRM и Воронки продаж' },
    { pattern: /Catalogs[\\/]PatientCards|Documents[\\/]PatientRecord/, name: 'Карты пациентов (Медицинский блок)' },
    { pattern: /CommonModules[\\/]Integration1C_Med/, name: 'Интеграция с 1С:Медицина' },
    { pattern: /Ext[\\/]Role/, name: 'Роли и Права доступа' },
    { pattern: /\.bsl$/, name: 'Прочая Бизнес-логика (BSL)' },
    { pattern: /\.xml$/, name: 'Прочие Метаданные и Формы' }
];

// --- Вспомогательные функции ---

function walkDir(currentPath, fileList = []) {
    if (!fs.existsSync(currentPath)) return fileList;

    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const fullPath = path.join(currentPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.has(file)) {
                walkDir(fullPath, fileList);
            }
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function classifyFiles(files) {
    const indexMap = {};
    files.forEach(file => {
        const normalizedPath = file.split(path.sep).join('/');
        let assignedModule = 'Нераспределенное (Требует внимания)';
        for (const rule of MODULE_RULES) {
            if (rule.pattern.test(file)) {
                assignedModule = rule.name;
                break;
            }
        }
        if (!indexMap[assignedModule]) indexMap[assignedModule] = [];
        indexMap[assignedModule].push(normalizedPath);
    });
    return indexMap;
}

function generateMarkdownTree(indexMap) {
    let md = `\n### ⚙️ Автоматический реестр файлов (Технический слой)\n`;
    md += `*Обновляется CI/CD пайплайном. Не редактируйте этот блок вручную.*\n\n`;

    const sortedModules = Object.keys(indexMap).sort();
    for (const mod of sortedModules) {
        md += `#### ${mod}\n`;
        const sortedFiles = indexMap[mod].sort();
        sortedFiles.forEach(file => {
            md += `- \`${file}\`\n`;
        });
        md += `\n`;
    }
    return md;
}

// --- Главная логика (Safe Inject) ---

console.log('Начинаю индексацию директории:', SRC_DIR);
const allFiles = walkDir(SRC_DIR);
const classified = classifyFiles(allFiles);
const treeMarkdown = generateMarkdownTree(classified);

// Формируем блок, который будет вставляться
const autoSection = `${START_MARKER}\n${treeMarkdown}${END_MARKER}`;

// Читаем текущий INDEX.md, если он есть
let fileContent = '';
if (fs.existsSync(OUTPUT_FILE)) {
    fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
}

// Экранируем спецсимволы маркеров для регулярного выражения
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const regex = new RegExp(`${escapeRegExp(START_MARKER)}[\\s\\S]*?${escapeRegExp(END_MARKER)}`);

if (regex.test(fileContent)) {
    // Если маркеры найдены — заменяем всё между ними
    fileContent = fileContent.replace(regex, autoSection);
    console.log('Найдены маркеры. Обновлен только технический блок.');
} else {
    // Если маркеров нет — добавляем их в конец файла
    fileContent = fileContent.trim() + '\n\n' + autoSection + '\n';
    console.log('Маркеры не найдены. Технический блок добавлен в конец файла.');
}

fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`Успешно! Файл ${OUTPUT_FILE} сохранен без повреждения ручной разметки.`);
