# Pending Tasks

## Оптимизация проекта (активный план)

### Фаза 1 — Баги (DONE)
- [x] `BlogSection.astro` "View All Posts" → `t(lang, "blog.viewAll")` + переводы в blog.ts

### Фаза 2 — Sanity (DONE)
- [x] Убрать `getReviewCount` → `getReviews()` поднят в index.astro/[lang]/index.astro, передаётся через HomePage → ReviewsSection как props, `reviews.length` используется для schema
- [x] `cached()` добавлен для `getReviews`, `getActivities`, `getServices`
- [x] `?w=192` для фото отзывов в `getReviews`
- [x] `?auto=format` для gallery — ОТКАТИЛИ (конфликтует с Sharp, бесполезно для build-time обработки)

### Фаза 3 — Astro/конфиг (TODO)
- [ ] `build.inlineStylesheets: "auto"` в astro.config.mjs — инлайн мелких CSS, убирает render-blocking SectionHeading.css
- [ ] `experimental.rustCompiler: true` — раскомментировать, быстрее сборка

### Не требует изменений
- Дублирование страниц (blog/[slug] + [lang]/[blogSlug]/[slug] и аналоги) — архитектурное требование Astro, всё корректно
- `?auto=format` для gallery — не помогает при Sharp processing

## PageSpeed / LCP оптимизация
- Текущий результат: 97 score, LCP 2.6s (цель <2.5s)
- Element render delay 1,040ms — главная проблема
- Изменения задеплоены (частично): AVIF hero, quality 45 mobile / 75 остальные, slider без infinite, setTimeout убран
- Следующий шаг: задеплоить и проверить PageSpeed

## Deploy / SPF
- SPF для Resend: добавить `include:amazonses.com` в root domain SPF в Cloudflare DNS (Иван делает сам)
