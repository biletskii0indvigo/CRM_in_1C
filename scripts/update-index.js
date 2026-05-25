const fs = require('fs');
const path = require('path');

// --- Конфигурация ---
const SRC_DIR = process.env.SRC_DIR || './src'; // Директория с выгрузкой 1С
const OUTPUT_FILE = 'INDEX.md';

// Исключения: папки, которые не нужно индексировать
const IGNORE_DIRS = new Set(['node_modules', '.git', '.github', 'scripts', 'build']);

// Правила классификации: регулярные выражения для привязки файлов к бизнес-модулям.
// Порядок важен: от специфичных бизнес-процессов к общим техническим файлам.
const MODULE_RULES = [
    { pattern: /Subsystems[\\/]CRM|DataProcessors[\\/]CRM_/, name: 'Модуль CRM и Воронки продаж' },
    { pattern: /Catalogs[\\/]PatientCards|Documents[\\/]PatientRecord/, name: 'Карты пациентов (Медицинский блок)' },
    { pattern: /CommonModules[\\/]Integration1C_Med/, name: 'Интеграция с 1С:Медицина' },
    { pattern: /Ext[\\/]Role/, name: 'Роли и Права доступа' },
    { pattern: /\.bsl$/, name: 'Прочая Бизнес-логика (BSL)' },
    { pattern: /\.xml$/, name: 'Прочие Метаданные и Формы' }
];

// --- Логика ---

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
        // Нормализуем пути для кроссплатформенности
        const normalizedPath = file.split(path.sep).join('/');
        
        let assignedModule = 'Нераспределенное (Требует внимания)';
        for (const rule of MODULE_RULES) {
            if (rule.pattern.test(file)) {
                assignedModule = rule.name;
                break;
            }
        }

        if (!indexMap[assignedModule]) {
            indexMap[assignedModule] = [];
        }
        indexMap[assignedModule].push(normalizedPath);
    });

    return indexMap;
}

function generateMarkdown(indexMap) {
    let md = `# Индекс Репозитория\n\n`;
    md += `*Сгенерировано автоматически. Описывает связь физических файлов выгрузки 1С с логическими бизнес-модулями.*\n\n`;

    // Сортируем модули по алфавиту для стабильности diff-ов в гите
    const sortedModules = Object.keys(indexMap).sort();

    for (const mod of sortedModules) {
        md += `### ${mod}\n`;
        // Сортируем файлы внутри модуля
        const sortedFiles = indexMap[mod].sort();
        sortedFiles.forEach(file => {
            md += `- \`${file}\`\n`;
        });
        md += `\n`;
    }

    return md;
}

// --- Запуск ---
console.log('Начинаю индексацию директории:', SRC_DIR);
const allFiles = walkDir(SRC_DIR);
const classified = classifyFiles(allFiles);
const markdownContent = generateMarkdown(classified);

fs.writeFileSync(OUTPUT_FILE, markdownContent, 'utf8');
console.log(`Успешно! Индекс сохранен в ${OUTPUT_FILE}`);