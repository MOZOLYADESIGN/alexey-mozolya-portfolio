# Telegram CMS Worker

Изолированный Cloudflare Worker для управления только файлом `src/content/site.json` через Telegram. Worker не содержит shell/`exec`/`eval`, не принимает пути к файлам и не умеет редактировать HTML, CSS, JavaScript, workflow или secrets.

## Поток изменения

```text
Telegram user
  → webhook secret + numeric user allowlist + rate limit
  → staged draft + schema validation + plain-text validation
  → explicit "Создать PR"
  → bot/update-YYYYMMDD-HHMMSS
  → commit only src/content/site.json
  → pull request to master
  → GitHub Actions npm run check
  → /preview shows diff, PR and CI
  → /publish checks CI PASS
  → explicit "Опубликовать"
  → allowlist re-check of PR files
  → squash merge; normal GitHub Pages workflow
```

`/rollback` читает сохранённую версию `site.json`, но оформляет её как новый content commit и PR. Force push и прямой push в `master` отсутствуют.

## Команды бота

- `/start`, `/help` — справка и быстрые кнопки;
- `/status` — доступность production, HEAD и последний workflow;
- `/show [hero|experience|about|contacts]` — текущие значения;
- `/edit [разрешённое.поле]` — staged-редактирование с diff;
- `/add` — пошаговое добавление проекта;
- `/remove <id>` — удаление проекта с отдельным подтверждением;
- `/preview` — diff, PR-ссылка и CI;
- `/publish` — кнопка финального подтверждения, сам по себе merge не выполняет;
- `/history` — последние content commits и серверный audit log;
- `/rollback <40-символьный SHA>` — staged rollback через новый PR;
- `/cancel` — очистить текущую сессию/черновик.

## Secrets

Все значения задаются только как Cloudflare secrets или в локальном игнорируемом `.dev.vars`:

- `TELEGRAM_BOT_TOKEN`;
- `TELEGRAM_WEBHOOK_SECRET` — 1–256 символов из `A-Z`, `a-z`, `0-9`, `_`, `-`;
- `GITHUB_TOKEN`;
- `GITHUB_OWNER`;
- `GITHUB_REPO`;
- `TELEGRAM_ALLOWED_USER_IDS` — один или несколько numeric ID через запятую.

Несекретные server-side vars находятся в `wrangler.jsonc`: `GITHUB_DEFAULT_BRANCH` и `PRODUCTION_URL`.

Для fine-grained GitHub token выберите только нужный репозиторий и минимальные repository permissions:

- `Metadata: Read`;
- `Contents: Read and write` — создать `bot/update-*` и обновить allowlisted content file;
- `Pull requests: Read and write` — создать, проверить файлы и merge PR;
- `Checks: Read` — проверить итог check runs перед publish;
- `Actions: Read` — показать состояние workflow в `/status`.

`Workflows`, `Administration`, `Secrets`, branch deletion и доступ к другим репозиториям не нужны.

## Локальный test mode

```powershell
Copy-Item cms-worker/.dev.vars.example cms-worker/.dev.vars
npm run cms:check
npx wrangler dev --config cms-worker/wrangler.jsonc --local
```

Заполните `.dev.vars` тестовым Telegram bot и отдельным fine-grained token. Файл игнорируется Git. Для полностью мокированных security-тестов реальные secrets и сеть не нужны.

## Команды будущей настройки Cloudflare

Эти команды подготовлены, но в test mode не выполнялись:

```powershell
npx wrangler secret put TELEGRAM_BOT_TOKEN --config cms-worker/wrangler.jsonc
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET --config cms-worker/wrangler.jsonc
npx wrangler secret put GITHUB_TOKEN --config cms-worker/wrangler.jsonc
npx wrangler secret put GITHUB_OWNER --config cms-worker/wrangler.jsonc
npx wrangler secret put GITHUB_REPO --config cms-worker/wrangler.jsonc
npx wrangler secret put TELEGRAM_ALLOWED_USER_IDS --config cms-worker/wrangler.jsonc
npx wrangler deploy --config cms-worker/wrangler.jsonc
```

После review и deploy зарегистрируйте `https://<worker-domain>/telegram/webhook` через Telegram `setWebhook`, передав тот же `secret_token` и `allowed_updates=["message","callback_query"]`. Токены не вставляйте в issue, commit, chat log или client-side код.

## Security model

- webhook-secret сравнивается до JSON parsing;
- numeric Telegram user ID проверяется до выполнения команды;
- общий SQLite Durable Object атомарно хранит rate limit 30/min/user, callback deduplication, сессии и audit log;
- размер update ограничен 128 KB;
- разрешён только plain text; HTML, управляющие и bidi-символы отклоняются;
- email, Telegram URL, длины, required values и duplicate project IDs валидируются;
- shared schema повторно проверяет весь `site.json` до GitHub-вызова;
- GitHub-клиент содержит единственный hardcoded path `src/content/site.json`;
- publish требует pending PR, CI PASS и отдельный callback; непосредственно перед merge список файлов PR снова проверяется;
- ответы и audit detail не содержат authorization headers или secret values.

## Ограничения MVP

Добавляемый проект выбирает один из заранее разрешённых visual asset sets (`starta`, `jobs`, `apex`, `trenera`). Это позволяет добавлять контент без загрузки файлов и без доступа бота к layout. Загрузка изображений, SEO-редактор и GitHub App вместо fine-grained token оставлены на следующую версию.
