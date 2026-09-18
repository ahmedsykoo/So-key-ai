import React from 'react';
import { useApp } from '../../context/AppContext';
import { Folder, FileCode, FileText, ChevronLeft } from 'lucide-react';

export const FileManagerView: React.FC = () => {
  const { activeProject, language } = useApp();
  const isArabic = language === 'ar';

  const files = [
    { name: 'FareCalculator.kt', type: 'kotlin', size: '3.4 KB', modified: 'منذ 5 دقائق' },
    { name: 'TripReader.kt', type: 'kotlin', size: '2.1 KB', modified: 'منذ 10 دقائق' },
    { name: 'strings.xml', type: 'xml', size: '1.2 KB', modified: 'منذ 15 دقيقة' },
    { name: 'AndroidManifest.xml', type: 'xml', size: '1.8 KB', modified: 'أمس' },
    { name: 'build.gradle.kts', type: 'gradle', size: '4.5 KB', modified: 'منذ يومين' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-[#1e2938] pb-4">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Folder className="w-5 h-5 text-orange-400" />
          <span>{isArabic ? `مستكشف الملفات — ${activeProject.name}` : `File Browser — ${activeProject.name}`}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 dir-ltr">{activeProject.path}</p>
      </div>

      <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-4 space-y-2">
        {files.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] rounded-xl transition cursor-pointer">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-orange-400" />
              <div>
                <h4 className="text-xs font-bold text-white font-mono">{file.name}</h4>
                <span className="text-[10px] text-slate-400">{file.size}</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">{file.modified}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
