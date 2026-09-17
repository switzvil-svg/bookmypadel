"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="container-page max-w-3xl py-16">
      <Reveal>
        <h1 className="font-display text-3xl font-bold text-ink">Contact</h1>
        <p className="mt-3 text-mist-600">
          Une question sur une réservation, votre compte organisateur ou la plateforme ? Écrivez-nous.
        </p>
      </Reveal>

      <Reveal className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-mist-200 bg-white p-4">
            <Mail size={18} className="mt-0.5 text-court-500" />
            <div>
              <p className="text-sm font-semibold text-ink">Par email</p>
              <p className="text-sm text-mist-600">support@bookmypadel.example</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-mist-200 bg-white p-4">
            <MessageCircle size={18} className="mt-0.5 text-court-500" />
            <div>
              <p className="text-sm font-semibold text-ink">Chat en direct</p>
              <p className="text-sm text-mist-600">Disponible du lundi au samedi, 9h–19h</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-mist-200 bg-white p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success"
                >
                  <CheckCircle2 size={30} />
                </motion.div>
                <p className="mt-4 font-display font-semibold text-ink">Message envoyé</p>
                <p className="mt-1 text-sm text-mist-600">Notre équipe vous répondra sous 24h ouvrées.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input placeholder="Prénom" required />
                  <Input placeholder="Nom" required />
                </div>
                <Input type="email" placeholder="Email" required />
                <select className="h-11 w-full rounded-md border border-mist-200 bg-white px-4 text-sm outline-none focus:border-court-500">
                  <option>Je suis un joueur</option>
                  <option>Je suis un organisateur</option>
                  <option>Autre demande</option>
                </select>
                <textarea
                  rows={4}
                  required
                  placeholder="Votre message"
                  className="w-full rounded-md border border-mist-200 bg-white p-3 text-sm outline-none focus:border-court-500"
                />
                <Button type="submit" className="w-full">
                  Envoyer le message
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}
