import { Download, FileJson, FileText, Printer } from 'lucide-react';
import { exportCSV, exportJSON, exportHTMLReport } from '../utils/chatExport';
import type { SessionResult } from '../types/chat';

interface ExportRowProps {
  result: SessionResult;
}

export function ExportRow({ result }: ExportRowProps) {
  const buttons = [
    { label: 'CSV', icon: Download, action: () => exportCSV(result) },
    { label: 'JSON', icon: FileJson, action: () => exportJSON(result) },
    { label: 'HTML Report', icon: FileText, action: () => exportHTMLReport(result) },
    { label: 'Print', icon: Printer, action: () => window.print() },
  ];

  return (
    <div className="flex flex-wrap gap-2 py-3 border-b border-white/10">
      {buttons.map(({ label, icon: Icon, action }) => (
        <button
          key={label}
          onClick={action}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs font-medium transition-all"
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
