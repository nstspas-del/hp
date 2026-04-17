'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import seoData from '@/data/seo.json';

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge mb-4">Вопросы и ответы</span>
          <h2 className="section-title">ЧАСТО СПРАШИВАЮТ</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {seoData.faqCommon.map((item, i) => (
            <motion.div
              key={i}
              className="card cursor-pointer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-text text-base leading-snug">{item.question}</h3>
                <span className="text-accent shrink-0 mt-0.5">
                  {open === i ? <Minus className="size-5" /> : <Plus className="size-5" />}
                </span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.p
                    className="text-text-muted text-sm mt-3 leading-relaxed"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
