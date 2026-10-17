# Передача проекта: портфолио Алексея Мозоли

Снимок подготовлен 17 октября 2026 года (Asia/Krasnoyarsk) для продолжения работы в другом чате или на другом компьютере.

## 1. Текущее состояние

- Рабочая локальная ветка: `codex/telegram-cms-test`.
- Основной implementation commit: `20522d8 feat: add secure Telegram CMS test mode`.
- Рабочее дерево перед созданием handoff-документа было чистым.
- `npm run check`: PASS.
- Production build: PASS, проверено 40 файлов.
- Telegram CMS: 24/24 теста PASS.
- Production-репозиторий и production-сайт CMS-работой не изменялись.
- Тестовый GitHub-репозиторий существует, но на момент снимка остаётся пустым.
- Cloudflare Worker и Telegram webhook пока не развёрнуты.

## 2. Главные ссылки

### Production

- Сайт: <https://mozolyadesign.github.io/alexey-mozolya-portfolio/>
- GitHub: <https://github.com/MOZOLYADESIGN/alexey-mozolya-portfolio>
- Локальный preview: <http://127.0.0.1:4173/alexey-mozolya-portfolio/>
- Локальный dev URL: <http://localhost:5173/alexey-mozolya-portfolio/>

### Тестовая CMS

- Отдельный тестовый репозиторий: <https://github.com/MOZOLYADESIGN/alexey-portfolio-cms-test>
- Разрешённый Telegram numeric user ID: `546078319`.
- Worker webhook после будущего deploy: `https://<worker-domain>/telegram/webhook`.
- Worker health endpoint после будущего deploy: `https://<worker-domain>/health`.

### Figma — источник истины

- Основной desktop-макет `771:9904`: <https://www.figma.com/design/Scos9DB2BLyqVhEUzLlINo/%D0%9C%D0%9E%D0%81?node-id=771-9904&t=5tZuj2pNbFd0KMwq-4>
- Актуальный hero `771:10042`: <https://www.figma.com/design/Scos9DB2BLyqVhEUzLlINo/%D0%9C%D0%9E%D0%81?node-id=771-10042&t=xHWyOpHwyL4t6z3R-4>
- Desktop navigation/experience `771:9932`: <https://www.figma.com/design/Scos9DB2BLyqVhEUzLlINo/%D0%9C%D0%9E%D0%81?node-id=771-9932>
- Contacts/CTA `771:9988`: <https://www.figma.com/design/Scos9DB2BLyqVhEUzLlINo/%D0%9C%D0%9E%D0%81?node-id=771-9988&t=xHWyOpHwyL4t6z3R-4>
- Mobile `786:7240`: <https://www.figma.com/design/Scos9DB2BLyqVhEUzLlINo/%D0%9C%D0%9E%D0%81?node-id=786-7240&t=xHWyOpHwyL4t6z3R-4>

### Контакты на сайте

- Telegram: <https://t.me/poofex>
- Email: <mailto:mozolya000@gmail.com>

## 3. Где что находится

- `index.html` — статический HTML-шаблон.
- `src/main.ts` — навигация и UI-поведение.
- `src/styles/` — tokens, layout, components и responsive CSS.
- `src/content/site.json` — единственный редактируемый источник контента.
- `src/content/schema.ts` — строгая схема контента и allowlist структуры.
- `src/content/render.ts` — build-time renderer с HTML escaping.
- `public/assets/` — локальные изображения и SVG; временных Figma URL нет.
- `.github/workflows/deploy.yml` — build PR и deploy GitHub Pages только из `master`.
- `cms-worker/` — Cloudflare Worker Telegram CMS.
- `cms-worker/README.md` — подробная настройка Worker, secrets и webhook.
- `cms-worker/tests/` — security, GitHub и Durable Object тесты.

## 4. Архитектура CMS

```text
Telegram
  → X-Telegram-Bot-Api-Secret-Token
  → allowlist numeric user ID
  → Durable Object: session, audit, rate limit, deduplication
  → staged draft + diff + validation
  → bot/update-YYYYMMDD-HHMMSS
  → commit только src/content/site.json
  → pull request + CI
  → /publish + отдельное callback-подтверждение
  → повторная проверка файлов PR
  → squash merge
  → обычный GitHub Pages workflow
```

Бот не принимает shell-команды, пути к файлам или произвольный HTML/CSS/JS. Прямого push в `master`, force push и удаления веток нет.

## 5. Доступы — без секретных значений

Архив намеренно не содержит токены, пароли, cookies, OAuth credentials или `.dev.vars`.

### GitHub

- Аккаунт владельца: `MOZOLYADESIGN`.
- На исходном компьютере GitHub CLI был авторизован, но credential не переносится архивом.
- Повторный вход: `gh auth login -h github.com -p https -w`.
- Для Worker нужен отдельный fine-grained token только на тестовый репозиторий:
  - `Metadata: Read`;
  - `Contents: Read and write`;
  - `Pull requests: Read and write`;
  - `Checks: Read`;
  - `Actions: Read`.
- `Workflows`, `Administration`, `Secrets` и доступ ко всему аккаунту не требуются.

### Telegram

- Создать отдельного тестового бота через `@BotFather` → `/newbot`.
- Bot token хранить только как Cloudflare secret или в локальном игнорируемом `cms-worker/.dev.vars`.
- Разрешённый user ID: `546078319`.
- Webhook secret должен состоять из `A-Z`, `a-z`, `0-9`, `_`, `-` и иметь длину 1–256 символов.

### Cloudflare

- Повторный вход: `npx wrangler login`.
- Конфигурация: `cms-worker/wrangler.jsonc`.
- Worker ещё не развёрнут; домен отсутствует.
- Durable Object `CMS_STATE` хранит сессии, audit, rate limit и защиту от повторов.

### Обязательные Worker secrets

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET
GITHUB_TOKEN
GITHUB_OWNER
GITHUB_REPO
TELEGRAM_ALLOWED_USER_IDS
```

Тестовые значения владельца и репозитория:

```text
GITHUB_OWNER=MOZOLYADESIGN
GITHUB_REPO=alexey-portfolio-cms-test
TELEGRAM_ALLOWED_USER_IDS=546078319
```

## 6. Быстрый старт после распаковки

Требуется Node.js 24+.

```powershell
npm ci
npm run check
npm run dev
```

Отдельная проверка CMS:

```powershell
npm run cms:check
Copy-Item cms-worker/.dev.vars.example cms-worker/.dev.vars
npx wrangler dev --config cms-worker/wrangler.jsonc --local
```

`cms-worker/.dev.vars` нужно заполнить локально и никогда не добавлять в Git.

## 7. Подготовленные команды будущего тестового запуска

Загрузить текущую локальную ветку в пустой тестовый репозиторий:

```powershell
git push https://github.com/MOZOLYADESIGN/alexey-portfolio-cms-test.git HEAD:master
```

Записать secrets интерактивно:

```powershell
npx wrangler secret put TELEGRAM_BOT_TOKEN --config cms-worker/wrangler.jsonc
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET --config cms-worker/wrangler.jsonc
npx wrangler secret put GITHUB_TOKEN --config cms-worker/wrangler.jsonc
npx wrangler secret put GITHUB_OWNER --config cms-worker/wrangler.jsonc
npx wrangler secret put GITHUB_REPO --config cms-worker/wrangler.jsonc
npx wrangler secret put TELEGRAM_ALLOWED_USER_IDS --config cms-worker/wrangler.jsonc
```

Развернуть только тестовый Worker:

```powershell
npx wrangler deploy --config cms-worker/wrangler.jsonc
```

После deploy зарегистрировать webhook через Telegram `setWebhook`, используя URL `<worker-domain>/telegram/webhook`, тот же `TELEGRAM_WEBHOOK_SECRET` и `allowed_updates=["message","callback_query"]`.

## 8. Нормальный сценарий проверки

1. Отправить тестовому боту `/start`.
2. Проверить `/show hero` и `/show contacts`.
3. Выполнить `/edit hero.greeting` и отправить новый текст.
4. Проверить diff и нажать «Создать PR».
5. Убедиться, что изменён только `src/content/site.json`.
6. Дождаться CI PASS и проверить `/preview`.
7. Выполнить `/publish`; убедиться, что команда сама по себе не делает merge.
8. Нажать отдельную кнопку «Опубликовать».
9. Проверить `/history` и staged `/rollback <SHA>`.

## 9. Что осталось сделать

1. Загрузить текущий commit в тестовый GitHub-репозиторий.
2. Создать Telegram test bot и сохранить token как secret.
3. Создать fine-grained GitHub token только для test repo.
4. Авторизовать Wrangler и развернуть test Worker.
5. Записать secrets и зарегистрировать webhook.
6. Выполнить end-to-end тест в Telegram.
7. Не менять production без отдельной прямой команды владельца.

## 10. Восстановление и rollback

- В архиве лежит полный Git bundle: из него можно восстановить историю и локальные ветки без доступа к GitHub.
- Исходный production remote: `origin` → `https://github.com/MOZOLYADESIGN/alexey-mozolya-portfolio.git`.
- Test repo не следует назначать production remote случайно; используйте отдельное имя remote, например `cms-test`.
- Для контентного rollback бот создаёт новый PR; force push не используется.
- Проверенный production build сохранён в архиве отдельно от исходников.

## 11. Правила для следующего чата

1. Сначала прочитать этот файл, корневой `README.md` и `cms-worker/README.md`.
2. Запустить `npm ci` и `npm run check` до изменений.
3. Не просить и не публиковать реальные secrets в сообщениях или файлах проекта.
4. Для CMS работать только с тестовым репозиторием, пока владелец явно не разрешит production.
5. Не менять layout через Telegram CMS: бот управляет только `src/content/site.json`.
6. Перед merge проверять CI и список файлов PR.
7. Production deploy выполнять только после отдельного подтверждения владельца.
