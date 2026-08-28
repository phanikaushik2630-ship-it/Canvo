import React, { useState } from 'react';
import { ChatLog } from '../../types';
import { downloadChatLogsCsv } from '../../services/api';
import { Search, Download, MessageSquare, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ChatLogsTableProps {
  businessId: string;
  businessSlug: string;
  logs: ChatLog[];
  onAddFaq: (question: string) => void;
  onNotify: (text: string) => void;
}

export const ChatLogsTable: React.FC<ChatLogsTableProps> = ({
  businessId,
  businessSlug,
  logs,
  onAddFaq,
  onNotify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = !searchTerm.trim() || 
      l.userQuestion.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.botAnswer.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'unanswered') return l.wasUnanswered;
    if (filterType === 'answered') return !l.wasUnanswered;
    return true;
  });

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await downloadChatLogsCsv(businessId, businessSlug);
      onNotify('Exported chat logs to CSV file!');
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl p-5 border border-artisan-200 shadow-warm-sm space-y-4 font-sans">
      
      {/* Header with Search and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-artisan-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-artisan-950 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-terracotta-500" />
            <span>Customer Conversation Logs ({filteredLogs.length})</span>
          </div>
          <p className="text-xs text-artisan-500 mt-0.5">
            Real interactions without customer PII.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting || logs.length === 0}
            className="btn-secondary !text-xs !py-1.5 !px-3 shadow-warm-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-artisan-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or bot answers..."
            className="input-artisan !pl-8 !py-1.5 !text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-1 bg-artisan-100 p-1 rounded-xl text-xs font-medium text-artisan-700 shrink-0">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-artisan-950 shadow-warm-sm font-bold' : 'hover:text-artisan-950'}`}
          >
            All ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('answered')}
            className={`px-2.5 py-1 rounded-lg transition-all ${filterType === 'answered' ? 'bg-white text-emerald-900 shadow-warm-sm font-bold' : 'hover:text-artisan-950'}`}
          >
            Answered
          </button>
          <button
            type="button"
            onClick={() => setFilterType('unanswered')}
            className={`px-2.5 py-1 rounded-lg transition-all ${filterType === 'unanswered' ? 'bg-white text-rose-900 shadow-warm-sm font-bold' : 'hover:text-artisan-950'}`}
          >
            Unanswered ({logs.filter(l => l.wasUnanswered).length})
          </button>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-10 text-xs text-artisan-400">
          No conversation logs match your current search criteria.
        </div>
      ) : (
        <div className="divide-y divide-artisan-100 max-h-96 overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3 space-y-1.5 hover:bg-artisan-50/50 px-2 rounded-xl transition-colors">
              <div className="flex items-center justify-between text-[11px] text-artisan-400 font-mono">
                <span>{new Date(log.timestamp).toLocaleString()}</span>
                
                {log.wasUnanswered ? (
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.2 rounded-full border border-rose-200 font-medium font-sans flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unanswered Gap</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 font-medium font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Grounded</span>
                  </span>
                )}
              </div>

              {/* Question */}
              <div className="font-serif font-bold text-xs sm:text-sm text-artisan-950 flex items-start justify-between gap-2">
                <div>💬 "{log.userQuestion}"</div>
                {log.wasUnanswered && (
                  <button
                    type="button"
                    onClick={() => onAddFaq(log.userQuestion)}
                    className="text-[10px] text-rose-700 hover:text-rose-900 font-sans font-bold flex items-center gap-1 shrink-0 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Add to FAQ</span>
                  </button>
                )}
              </div>

              {/* Bot Answer */}
              <div className="text-xs text-artisan-600 bg-artisan-50 p-2 rounded-lg border border-artisan-200/60 leading-relaxed">
                🤖 {log.botAnswer}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
