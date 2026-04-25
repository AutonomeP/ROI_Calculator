import { Download, FileJson, FileText, Printer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { exportCSV, exportJSON, exportHTMLReport } from '../utils/chatExport';
import type { SessionResult } from '../types/chat';

interface ExportRowProps {
  result: SessionResult;
}

export function ExportRow({ result }: ExportRowProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const buttons = [
    { label: 'CSV', icon: Download, action: () => exportCSV(result) },
    { label: 'JSON', icon: FileJson, action: () => exportJSON(result) },
    { label: 'HTML Report', icon: FileText, action: () => exportHTMLReport(result) },
    { label: 'Print', icon: Printer, action: () => window.print() },
  ];

  return (
    <div className={`flex flex-wrap gap-2 py-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      {buttons.map(({ label, icon: Icon, action }) => (
        <button
          key={label}
          onClick={action}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${isDark ? 'bg-white/[0.04] hover:bg-white/10 border-white/10 hover:border-white/20 text-white/70 hover:text-white' : 'bg-white hover:bg-black/[0.03] border-black/10 hover:border-black/20 text-black/65 hover:text-black'}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
