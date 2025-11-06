"use client";

import { motion } from "motion/react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/utils";
import type { ReportHistory as ReportHistoryType } from "@/types/repository";

interface ReportHistoryProps {
  reports: ReportHistoryType[];
}

export function ReportHistory({ reports }: ReportHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileDown className="text-violet-600" size={20} />
          <h2 className="text-xl font-bold text-slate-900">
            Historique des rapports
          </h2>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Générer nouveau rapport
        </Button>
      </div>

      <div className="space-y-2">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileDown className="text-violet-600" size={18} />
                <div>
                  <div className="font-medium text-slate-900">
                    {report.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatRelativeDate(new Date(report.date))} • {report.size}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                Télécharger
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Aucun rapport disponible</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
