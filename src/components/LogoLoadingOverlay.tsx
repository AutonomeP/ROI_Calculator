import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import logoLight from '../assets/black_autonome_partners_-_logo_icon_(black).png';
import logoDark from '../assets/white__autonome_partners_-_logo_icon_(white).png';

interface LogoLoadingOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function LogoLoadingOverlay({ isOpen, onComplete }: LogoLoadingOverlayProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const logo = theme === 'dark' ? logoDark : logoLight;

  return (
    <motion.div
      className={`fixed inset-0 z-[60] flex items-center justify-center ${
        theme === 'dark' ? 'bg-roi-black' : 'bg-roi-light-bg'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      aria-label="Loading your calculator"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-roi-orange/5"></div>

      <div className="relative flex flex-col items-center justify-center px-4">
        <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.img
              src={logo}
              alt="Autonome Partners Logo"
              className="w-full h-full object-contain drop-shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 0.6,
              delay: 1.4,
              ease: "easeInOut",
            }}
          >
            <div className={`absolute inset-0 rounded-full blur-3xl ${
              theme === 'dark' ? 'bg-roi-orange/30' : 'bg-roi-orange/20'
            }`}></div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'
          }`}>
            Loading your calculator...
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-roi-orange to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "linear" }}
          style={{ originX: 0 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}
