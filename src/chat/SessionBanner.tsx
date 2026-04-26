import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { SessionType } from '../types/chat';

interface SessionBannerProps {
  sessionType: SessionType;
  systemCount: number;
  isLoading: boolean;
}

export function SessionBanner({ sessionType, systemCount, isLoading }: SessionBannerProps) {
  return null;
}
