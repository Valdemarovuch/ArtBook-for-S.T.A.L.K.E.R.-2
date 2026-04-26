import { X, MousePointerClick, Hand, Link, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none"
              >
                <div
                  className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-[#151210] p-6 shadow-2xl font-['Rubik',sans-serif]"
                  style={{
                    boxShadow: '0 0 40px rgba(249,115,22,0.1)',
                  }}
                >
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      aria-label="Закрити"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  <Dialog.Title className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-orange-500">?</span> Як це працює
                  </Dialog.Title>

                  <div className="space-y-6 text-sm text-white/70">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <MousePointerClick className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Збір карток</h4>
                        <p>Натисніть на картку (або тапніть на телефоні), щоб додати її до колекції або видалити з неї.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <Hand className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Облік повторок</h4>
                        <p>Натисніть <strong className="text-orange-400">правою кнопкою миші</strong> (на ПК) або <strong className="text-orange-400">затисніть картку</strong> (на телефоні), щоб відкрити меню та вказати кількість повторок для обміну.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <Link className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Обмін з друзями</h4>
                        <p>Натисніть кнопку "Поділитися" в ПДА, щоб згенерувати унікальне посилання. Відправте його друзям — вони побачать, яких карток вам не вистачає і які ви віддаєте.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Збереження</h4>
                        <p>Ваш прогрес зберігається автоматично у пам'яті вашого браузера. Нікуди більше ваші дані не передаються.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Dialog.Close asChild>
                      <button className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-[#100a02] hover:bg-orange-400 active:scale-95 transition-all">
                        Зрозуміло
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
