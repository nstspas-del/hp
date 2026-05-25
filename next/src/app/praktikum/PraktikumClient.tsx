'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench, Zap, Stethoscope, CheckCircle2, Users, Sparkles,
  Phone, Send, Award, ArrowRight, ChevronDown, MapPin,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
 * ВВОДНЫЕ ДАННЫЕ — вся текстовка прямо в файле, чтобы клиенту/SEO
 * проще было править одно место.
 * ────────────────────────────────────────────────────────────── */

const FOR_WHOM = [
  'Никогда не работал в автосервисе, но хочешь попробовать руками',
  'Думаешь, в какую сторону развиваться — и хочешь пощупать сферу прежде, чем решать',
  'Любишь машины и хочешь начать понимать их глубже',
  'Устал от теории на YouTube и хочешь увидеть процесс вживую',
  'Ищешь практику, а не лекции',
  'Хочешь понять разницу между механиком, электриком и диагностом — на живых примерах',
];

const WHAT_INSIDE = [
  {
    icon: Wrench,
    title: 'Реальные машины',
    text: 'Никаких учебных стендов в вакууме — работаем на тех авто, которые приезжают в сервис.',
  },
  {
    icon: Sparkles,
    title: 'Реальные кейсы',
    text: 'Видишь не выдуманные задачи, а то, как мастер решает настоящую проблему клиента.',
  },
  {
    icon: Users,
    title: 'Маленькие группы',
    text: 'Чтобы каждый был ближе к процессу, а не смотрел в спины.',
  },
  {
    icon: Stethoscope,
    title: 'Живое общение с практиками',
    text: 'Можно спрашивать, уточнять, наблюдать со стороны и пробовать самому.',
  },
  {
    icon: Zap,
    title: 'Сервисная среда',
    text: 'Подъёмники, диагностические сканеры, инструмент, реальный ритм работы — всё то, что увидишь в любой нормальной мастерской.',
  },
];

const DIRECTIONS = [
  {
    slug: 'mechanic',
    icon: Wrench,
    color: '#39FF14',
    title: 'Практикум автомеханика',
    lead: 'Узлы, агрегаты, подвеска, тормоза, ходовая, замены, регламентные работы — всё, что лежит в основе нормальной работы любой машины.',
    inside:
      'Внутри практикума: разбор реальных ремонтных задач, работа с инструментом, понимание «что куда крутится и почему», практика на подъёмнике рядом с мастером.',
    forWhom: 'Подойдёт, если хочется понять механику машины руками, а не по схемам.',
  },
  {
    slug: 'electric',
    icon: Zap,
    color: '#A855F7',
    title: 'Практикум автоэлектрика',
    lead: 'Электрика — это то, чего боятся новички и за что мастера берут уверенно. Здесь — снять страх и почувствовать систему.',
    inside:
      'Внутри практикума: проводка, питание, датчики, реле, поиск замыканий и обрывов, работа с мультиметром, чтение схем на живой машине.',
    forWhom:
      'Подойдёт, если хочется перестать бояться «электрики» и начать понимать машину как систему, а не набор железа.',
  },
  {
    slug: 'diagnostics',
    icon: Stethoscope,
    color: '#39FF14',
    title: 'Практикум автодиагностики',
    lead: 'Современная машина «разговаривает» через диагностический интерфейс. Здесь учимся её слышать.',
    inside:
      'Внутри практикума: работа со сканером, чтение и интерпретация ошибок, логика построения диагностического процесса, наблюдение за тем, как мастер локализует проблему по симптомам и данным.',
    forWhom:
      'Подойдёт, если хочется двигаться в сторону современной автодиагностики — где голова важнее ключа.',
  },
];

const PARTICIPANT_GETS = [
  'Реальный опыт в действующем сервисе, а не имитацию',
  'Понимание направления — подходит тебе это или нет, ещё до больших решений',
  'Сервисную среду вокруг — инструмент, авто, мастера, ритм',
  'Контакт с практиками — людьми, которые этим живут каждый день',
  'Фирменный сертификат участника HP Tuning',
  'Ответы на свои вопросы в живую, а не в комментариях под видео',
];

const FAQ = [
  {
    q: 'Нужен ли опыт работы с авто?',
    a: 'Нет. Практикумы рассчитаны на новичков. Если ты раньше никогда не держал в руках ключ — это нормально. Мы как раз и созданы для того, чтобы дать первое реальное прикосновение к сфере.',
  },
  {
    q: 'Будет ли реально практика, или это очередные лекции?',
    a: 'Будет именно практика. Мы — действующий сервис. Лекций в классе у нас нет, есть машины, инструмент и мастера, рядом с которыми ты находишься.',
  },
  {
    q: 'Можно ли понять, подходит ли мне направление?',
    a: 'Да — это и есть главная цель формата. За практикум ты успеваешь почувствовать, насколько тебе это «твоё», прежде чем вкладываться в дальнейшее развитие.',
  },
  {
    q: 'Что за сертификат выдаётся в конце?',
    a: 'Фирменный сертификат участника HP Tuning. Это наш внутренний знак о пройденной практике в сервисе. Не документ об образовании, а памятная отметка от мастерской.',
  },
  {
    q: 'Сколько человек в группе?',
    a: 'Группы маленькие, специально под формат «рядом с мастером». Чтобы каждый был у процесса, а не в задних рядах.',
  },
  {
    q: 'Где это проходит?',
    a: 'В нашем сервисе: Санкт-Петербург, Порошкино, Богородская 3Б. Та же мастерская, где обслуживаются клиенты HP Tuning.',
  },
  {
    q: 'Нужно ли что-то покупать или приносить?',
    a: 'Нет. Инструмент, авто, диагностика — всё на нашей стороне. Приходишь налегке.',
  },
  {
    q: 'Как узнать о старте ближайшего практикума?',
    a: 'Оставь заявку через форму ниже — мы свяжемся, расскажем про ближайшие даты по нужному тебе направлению и подскажем, как присоединиться.',
  },
];

/* ──────────────────────────────────────────────────────────────
 *  Сам компонент
 * ────────────────────────────────────────────────────────────── */

export default function PraktikumClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contact: '',
    direction: '',
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Шлём цель в Я.Метрику
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(108614238, 'reachGoal', 'praktikum_submit');
    }
    // Шлём в /api/lead — он сам пушит в Telegram и/или e-mail.
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formData.phone,
        name: formData.name,
        source: 'praktikum',
        context: {
          contact: formData.contact,
          direction: formData.direction,
          comment: formData.comment,
        },
      }),
    }).catch(() => {
      /* не блокируем UX — если API упал, всё равно покажем success */
    });
    setSubmitted(true);
  };

  return (
    <main className="bg-[#09090b] text-white">
      {/* ═══════════════════════════════════════════════════════════════
            HERO — главный экран
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(57,255,20,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.15), transparent 50%)',
          }}
        />
        <div className="relative container pt-20 pb-14 md:pt-28 md:pb-20">
          {/* Бейдж */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/25 mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[#39FF14] text-xs font-bold tracking-widest uppercase">
              Новое в HP Tuning
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.0] uppercase tracking-tight mb-5 max-w-4xl"
          >
            Попробуй автомобильную сферу{' '}
            <span className="text-[#39FF14]" style={{ textShadow: '0 0 40px rgba(57,255,20,0.5)' }}>
              руками
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-300 text-base md:text-xl leading-relaxed max-w-3xl mb-7"
          >
            Практикумы по{' '}
            <strong className="text-white">автомеханике, автоэлектрике и диагностике</strong>{' '}
            в действующем сервисе HP&nbsp;Tuning. Порошкино, Богородская&nbsp;3Б.
          </motion.p>

          {/* Карточки направлений — короткие плитки */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl">
            {DIRECTIONS.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.a
                  key={d.slug}
                  href={`#${d.slug}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                  className="group flex items-center gap-3 p-4 rounded-2xl bg-[#111113] border border-white/10 hover:border-[color:var(--c)] transition-colors"
                  style={{ '--c': d.color } as React.CSSProperties}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                    style={{ backgroundColor: `${d.color}1A` }}
                  >
                    <Icon className="size-5" color={d.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm md:text-base font-bold leading-tight">
                      {d.title.replace('Практикум ', '')}
                    </div>
                  </div>
                  <ArrowRight
                    className="size-4 text-zinc-600 group-hover:text-[color:var(--c)] transition-colors shrink-0"
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Главный CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#form"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'praktikum_hero_cta')}
              className="btn-primary text-base px-7 py-3.5 rounded-full font-bold justify-center"
            >
              Оставить заявку на практикум
            </a>
            <a
              href="https://t.me/hptunspb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white font-semibold text-base hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
            >
              <Send className="size-4" />
              Написать в Telegram
            </a>
          </div>

          <p className="text-zinc-500 text-sm mt-4">
            Небольшие группы. Реальная сервисная среда. Без воды.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ВВОДНЫЙ БЛОК
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5">
        <div className="container py-14 md:py-20 max-w-4xl">
          <div className="space-y-5 text-zinc-300 text-base md:text-lg leading-relaxed">
            <p>
              <strong className="text-white">HP Tuning — это не учебный центр.</strong>{' '}
              Это работающий тюнинг-сервис в Санкт-Петербурге, где каждый день поднимаются
              на подъёмник реальные BMW, Porsche, Mercedes, Toyota и десятки других машин.
              Здесь не показывают «как должно быть в учебнике» — здесь работают.
            </p>
            <p>
              Мы открыли практические направления для тех, кто хочет попробовать
              автомобильную сферу руками: посмотреть, что такое настоящий сервис изнутри,
              прикоснуться к диагностике, электрике, механике — и понять, насколько это «твоё».
            </p>
            <p>
              <strong className="text-[#39FF14]">Это не курсы и не учебная программа.</strong>{' '}
              Это <strong className="text-white">практикум</strong> — погружение в живую
              сервисную среду рядом с мастерами, которые ежедневно работают руками.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ДЛЯ КОГО ЭТО
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5">
        <div className="container py-14 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-3">
            Для кого это
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-2xl">
            Подходит тебе, если ты:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
            {FOR_WHOM.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#111113] border border-white/8"
              >
                <CheckCircle2 className="size-5 text-[#39FF14] shrink-0 mt-0.5" />
                <span className="text-zinc-200 text-sm md:text-base leading-snug">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ЧТО ВНУТРИ
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5 bg-gradient-to-b from-transparent to-[#0c0c0e]">
        <div className="container py-14 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-3">
            Что внутри
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-10 max-w-2xl">
            Это не онлайн-курс и не лекции в классе. Внутри:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_INSIDE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="p-5 md:p-6 rounded-2xl bg-[#111113] border border-white/8 hover:border-[#39FF14]/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/25 mb-4">
                    <Icon className="size-5 text-[#39FF14]" />
                  </div>
                  <h3 className="text-white text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ПОЧЕМУ ЭТО НЕ ТЕОРИЯ РАДИ ТЕОРИИ
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5">
        <div className="container py-14 md:py-20 max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-8">
            Почему это <span className="text-[#39FF14]">не теория</span> ради теории
          </h2>
          <div className="space-y-5 text-zinc-300 text-base md:text-lg leading-relaxed">
            <p>
              В большинстве форматов сначала идёт месяц лекций, потом обещание «практики»,
              которая часто оказывается роликом на проекторе. У нас наоборот.
            </p>
            <p className="text-white text-lg md:text-2xl font-display leading-tight">
              С первого дня — руки, инструмент, машина перед тобой.
            </p>
            <p>
              Теория появляется ровно там, где она нужна: чтобы понять, что ты только что
              сделал и почему. Не наоборот.
            </p>
            <p className="text-zinc-400 italic">
              Это и значит «погружение в профессию»: ты не учишь о ней, ты в неё попадаешь.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ТРИ НАПРАВЛЕНИЯ
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5 bg-[#0c0c0e]">
        <div className="container py-14 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-3">
            Три направления
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-10 max-w-2xl">
            Каждое направление — самостоятельный практикум. Можно начать с одного,
            затем перейти к следующему.
          </p>

          <div className="space-y-5">
            {DIRECTIONS.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.article
                  key={d.slug}
                  id={d.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="scroll-mt-24 p-6 md:p-8 rounded-3xl bg-[#111113] border border-white/8 hover:border-[color:var(--c)]/30 transition-colors"
                  style={{ '--c': d.color } as React.CSSProperties}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
                      style={{
                        backgroundColor: `${d.color}1A`,
                        boxShadow: `0 0 24px ${d.color}30 inset`,
                      }}
                    >
                      <Icon className="size-6 md:size-7" color={d.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight leading-tight text-white">
                        {d.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-200 text-base md:text-lg leading-relaxed mb-4">
                    {d.lead}
                  </p>

                  <div className="p-4 md:p-5 rounded-2xl bg-black/30 border border-white/5 mb-4">
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                      <strong className="text-white">Внутри практикума:</strong>{' '}
                      {d.inside.replace('Внутри практикума: ', '')}
                    </p>
                  </div>

                  <p className="text-zinc-400 text-sm md:text-base italic leading-relaxed">
                    <span style={{ color: d.color }} className="font-semibold not-italic">
                      ▸{' '}
                    </span>
                    {d.forWhom}
                  </p>

                  <a
                    href="#form"
                    onClick={() =>
                      window.ym?.(108614238, 'reachGoal', `praktikum_${d.slug}_cta`)
                    }
                    className="inline-flex items-center gap-2 mt-5 text-sm md:text-base font-bold transition-colors hover:gap-3"
                    style={{ color: d.color }}
                  >
                    Хочу на этот практикум
                    <ArrowRight className="size-4" />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ЧТО ПОЛУЧАЕТ УЧАСТНИК
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5">
        <div className="container py-14 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-10">
            Что получает участник
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            {PARTICIPANT_GETS.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#111113] border border-white/8"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/25 shrink-0">
                  <CheckCircle2 className="size-5 text-[#39FF14]" />
                </div>
                <span className="text-zinc-200 text-base md:text-lg leading-snug">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            БЛОК ПРО СЕРТИФИКАТ
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5 bg-gradient-to-br from-[#0c0c0e] via-[#0c0c0e] to-[#1a0f24]">
        <div className="container py-14 md:py-20 max-w-4xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#A855F7]/15 border border-[#A855F7]/30 shrink-0">
              <Award className="size-8 md:size-10 text-[#A855F7]" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-4">
                Фирменный сертификат участника
              </h2>
              <div className="space-y-4 text-zinc-300 text-base md:text-lg leading-relaxed">
                <p>
                  По итогам практикума участник получает{' '}
                  <strong className="text-white">
                    фирменный сертификат участника HP&nbsp;Tuning
                  </strong>{' '}
                  — внутренний знак о том, что человек прошёл практику в действующем
                  сервисе и тюнинг-ателье HP&nbsp;Tuning в Санкт-Петербурге.
                </p>
                <p className="text-zinc-400 text-sm md:text-base italic">
                  Это не документ об образовании и не государственный сертификат. Это
                  наш фирменный знак — приятная отметка о том, что человек реально был
                  в нашей мастерской, прошёл практический формат и погрузился в
                  сервисную среду.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            FAQ
         ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5">
        <div className="container py-14 md:py-20 max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-10">
            Частые вопросы
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-[#111113] border border-white/8 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-white text-base md:text-lg font-bold leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`size-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#39FF14]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-zinc-300 text-base leading-relaxed border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ФОРМА ЗАЯВКИ
         ═══════════════════════════════════════════════════════════════ */}
      <section id="form" className="border-b border-white/5 bg-[#0c0c0e] scroll-mt-24">
        <div className="container py-14 md:py-20 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-3">
            Оставить заявку на практикум
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8">
            Напиши, какое направление интересно — свяжемся, расскажем про ближайший
            старт и ответим на вопросы.
          </p>

          {submitted ? (
            <div className="p-8 md:p-10 rounded-3xl bg-[#39FF14]/10 border border-[#39FF14]/30 text-center">
              <CheckCircle2 className="size-12 text-[#39FF14] mx-auto mb-4" />
              <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-3">
                Заявка принята
              </h3>
              <p className="text-zinc-300 text-base md:text-lg">
                Свяжемся с тобой в течение дня и расскажем про ближайший старт.
                <br />
                Если хочется быстрее —{' '}
                <a
                  href="https://t.me/hptunspb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#39FF14] hover:underline font-semibold"
                >
                  напиши в Telegram
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-zinc-300 text-sm font-semibold mb-2 block">Имя *</span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-white text-base focus:border-[#39FF14] focus:outline-none transition-colors"
                    placeholder="Как тебя зовут"
                  />
                </label>
                <label className="block">
                  <span className="text-zinc-300 text-sm font-semibold mb-2 block">Телефон *</span>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-white text-base focus:border-[#39FF14] focus:outline-none transition-colors"
                    placeholder="+7 ___ ___ __ __"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-zinc-300 text-sm font-semibold mb-2 block">
                  Telegram или e-mail{' '}
                  <span className="text-zinc-500 font-normal">(по желанию)</span>
                </span>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-white text-base focus:border-[#39FF14] focus:outline-none transition-colors"
                  placeholder="@username или email@..."
                />
              </label>

              <label className="block">
                <span className="text-zinc-300 text-sm font-semibold mb-2 block">
                  Какое направление интересует
                </span>
                <select
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-white text-base focus:border-[#39FF14] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Выбери направление</option>
                  <option value="mechanic">Автомеханика</option>
                  <option value="electric">Автоэлектрика</option>
                  <option value="diagnostics">Автодиагностика</option>
                  <option value="thinking">Пока думаю</option>
                </select>
              </label>

              <label className="block">
                <span className="text-zinc-300 text-sm font-semibold mb-2 block">
                  Короткий комментарий{' '}
                  <span className="text-zinc-500 font-normal">(не обязательно)</span>
                </span>
                <textarea
                  rows={3}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-white text-base focus:border-[#39FF14] focus:outline-none transition-colors resize-none"
                  placeholder="Например: интересует диагностика, никогда не работал в сервисе..."
                />
              </label>

              <button
                type="submit"
                className="btn-primary w-full md:w-auto text-base px-7 py-4 rounded-full font-bold justify-center"
              >
                Отправить заявку
              </button>

              <p className="text-zinc-500 text-sm">
                Перезвоним в течение дня. Без спама.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
            ФИНАЛЬНЫЙ CTA
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(57,255,20,0.18), transparent 60%)',
          }}
        />
        <div className="relative container py-16 md:py-24 text-center max-w-4xl">
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-tight mb-5">
            Хочешь попробовать своё <span className="text-[#39FF14]">руками</span> — <br />
            а не на словах?
          </h2>
          <p className="text-zinc-300 text-base md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            В HP&nbsp;Tuning ты не учишь о сервисе. Ты в него попадаешь.
            <br />
            Реальный сервис. Реальные машины. Реальные мастера рядом.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
            <a
              href="#form"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'praktikum_final_cta')}
              className="btn-primary text-base px-8 py-4 rounded-full font-bold justify-center"
            >
              Оставить заявку на практикум
            </a>
            <a
              href="https://t.me/hptunspb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/15 text-white font-semibold hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
            >
              <Send className="size-4" />
              Написать в Telegram
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-zinc-500 text-sm">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              СПб, Порошкино, Богородская 3Б
            </span>
            <a
              href="tel:+79818428151"
              className="inline-flex items-center gap-2 hover:text-[#39FF14] transition-colors"
            >
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
