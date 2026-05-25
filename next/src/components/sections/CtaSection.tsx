'use client';
import { Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';

/* CTA-секция внизу главной.
 * Убрана кнопка «Записаться онлайн» (openBooking) — по запросу клиента.
 * Главный канал — телефон, дополнительный — Telegram.
 */
export function CtaSection() {
  return (
    <section className="section bg-bg-elevated border-t border-white/5">
      <div className="container">
        <motion.div
          className="relative rounded-3xl overflow-hidden border border-accent-dim p-10 md:p-16 text-center glow-box"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.08),transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="section-title text-4xl md:text-6xl mb-4">ГОТОВЫ НАЧАТЬ?</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto mb-10">
              Позвоните или напишите в Telegram — ответим в течение 15 минут и&nbsp;подберём
              удобное время.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+79818428151"
                className="btn-primary text-base md:text-lg px-10 py-4 gap-2"
                onClick={() => window.ym?.(108614238, 'reachGoal', 'cta_phone_click')}
              >
                <Phone className="size-5" />
                +7 (981) 842-81-51
              </a>
              <a
                href="https://t.me/hptunspb"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base md:text-lg px-10 py-4 gap-2"
                onClick={() => window.ym?.(108614238, 'reachGoal', 'cta_telegram_click')}
              >
                <Send className="size-5" />
                Написать в Telegram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
