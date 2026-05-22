/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, Check, AlertCircle, X, Settings as BrainIcon, Zap } from 'lucide-react';
import { Meeting } from '../types';

interface CaptureViewProps {
  onAddSynthesizedMeeting: (newMeeting: Meeting) => void;
}

interface SelectedFile {
  file: File;
  name: string;
  size: string;
  type: string;
}

export default function CaptureView({ onAddSynthesizedMeeting }: CaptureViewProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (files: FileList) => {
    const fileList: SelectedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f) {
        fileList.push({
          file: f,
          name: f.name,
          size: formatBytes(f.size),
          type: f.name.split('.').pop() || 'unknown'
        });
      }
    }
    setSelectedFiles((prev) => [...prev, ...fileList]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateIntel = async () => {
    if (selectedFiles.length === 0) {
      alert('Please drag or select at least one meeting asset.');
      return;
    }

    setGenerationState('generating');
    setProgress(5);
    setErrorMsg(null);

    // Dynamic feedback simulation matching the model run
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          return 88; // Block at 88% until completion
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 400);

    try {
      const formData = new FormData();
      selectedFiles.forEach((sf) => {
        formData.append('files', sf.file);
      });

      const response = await fetch('/api/synthesize', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        let errorText = "";
        try {
          const errResult = await response.json();
          errorText = errResult.error;
        } catch {
          const rawText = await response.text().catch(() => "");
          if (rawText.includes("<!DOCTYPE") || rawText.includes("<!doctype")) {
            errorText = "The server returned an HTML error page. This usually means a dev server reload is in progress. Please wait a few seconds and try uploading again.";
          } else {
            errorText = rawText.substring(0, 150) || `Server error (Status ${response.status})`;
          }
        }
        throw new Error(errorText || `Server responded with status ${response.status}: Failed to synthesize report.`);
      }

      let synthesizedReport: Meeting;
      try {
        synthesizedReport = await response.json();
      } catch (jsonErr: any) {
        throw new Error("Failed to parse the successful response from the server as JSON. Please ensure the backend is running correctly.");
      }
      setProgress(100);
      
      // Short delay for satisfying completion animation
      setTimeout(() => {
        onAddSynthesizedMeeting(synthesizedReport);
        setGenerationState('success');
        setSelectedFiles([]);
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      console.error('Synthesis flow error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during synthesis of the document briefing.');
      setGenerationState('error');
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300 text-left">
      {/* Page Header */}
      <section className="space-y-2">
        <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight text-left">Capture Assets</h2>
        <p className="text-slate-500 text-sm">
          Ingest strategic meeting resources to generate summarized takeaways.
        </p>
      </section>

      {generationState === 'idle' && (
        <div className="space-y-6">
          {/* Custom Drag & Drop Field */}
          <div
            id="drag-drop-container"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`relative border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] select-none ${
              isDragging
                ? 'border-[#0D9488] bg-teal-50/40 scale-[1.01]'
                : 'border-slate-200 bg-white hover:border-[#0D9488]/40 hover:bg-slate-50/40 shadow-[0_4px_20px_rgba(15,23,42,0.03)]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-100 text-[#00685f] flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-lg text-slate-800">Drop resources here</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Supports secure PDF briefs, notes, slides, and transcripts
            </p>
          </div>

          {/* Quick-Access Helper Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)]">
              <span className="text-[18px]">📄</span>
              <span className="text-xs font-bold text-slate-500">Briefing PDF</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)]">
              <span className="text-[18px]">📊</span>
              <span className="text-xs font-bold text-slate-500">Meeting Slides</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)]">
              <span className="text-[18px]">🎙️</span>
              <span className="text-xs font-bold text-slate-500">Acoustic Logs</span>
            </div>
          </div>

          {/* Uploaded File List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 font-sans">
                  Assets Queue ({selectedFiles.length})
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold bg-transparent"
                >
                  Clear Queue
                </button>
              </div>

              <div className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3.5 bg-white border border-slate-150 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] animate-in slide-in-from-bottom-2 duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-[#00685f] shrink-0" />
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-extrabold text-slate-800 block truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold tracking-wider font-sans block mt-0.5">{file.size}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Generate Buttons */}
          <div className="pt-2">
            <button
              id="btn-generate-intel"
              onClick={handleGenerateIntel}
              disabled={selectedFiles.length === 0}
              className={`w-full py-4 rounded-xl font-sans font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedFiles.length > 0
                  ? 'bg-[#0D9488] text-white hover:bg-[#0b7c72] active:scale-[0.99]'
                  : 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed font-semibold'
              }`}
            >
              <Zap className="w-4.5 h-4.5 text-current shrink-0" />
              <span>Synthesize Intelligence Deliverables</span>
            </button>
          </div>
        </div>
      )}

      {generationState === 'generating' && (
        <section className="bg-white border border-slate-100 p-8 rounded-2xl text-center space-y-6 py-12 shadow-[0_10px_30px_rgba(15,23,42,0.05)] animate-in zoom-in-95 duration-200">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Spinning Indicator Nodes matches screenshot */}
            <div className="absolute inset-0 border-2 border-teal-100 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-[#0D9488] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-teal-50 rounded-full w-18 h-18 m-3">
              <BrainIcon className="w-8 h-8 text-[#0D9488] animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-[#0D9488]">Synthesizing Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-sans font-medium">
              Auditing assets, auditing topics, mapping actions, and synthesizing tactical insights with complete semantic integrity.
            </p>
          </div>

          {/* Responsive Progress Bar Container */}
          <div className="space-y-1.5 max-w-xs mx-auto font-sans">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Auditing Assets</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="bg-[#0D9488] h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </section>
      )}

      {generationState === 'success' && (
        <section className="bg-white border border-teal-100/80 p-8 rounded-2xl text-center space-y-6 py-12 shadow-[0_10px_30px_rgba(15,23,42,0.05)] animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-teal-50 text-[#0D9488] border border-teal-200/50 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-[#0D9488]">Intelligence Synthesized</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-sans font-medium">
              Your resources have been modeled successfully. Active reports have been initialized and appended to your past archive stream.
            </p>
          </div>

          <div className="pt-2 flex gap-3 max-w-xs mx-auto">
            <button
              onClick={() => setGenerationState('idle')}
              className="flex-1 py-3 bg-teal-50 border border-teal-200 text-teal-700 font-sans font-bold rounded-xl text-xs hover:bg-teal-100 active:scale-95 transition-all cursor-pointer"
            >
              Analyze New Source Assets
            </button>
          </div>
        </section>
      )}

      {generationState === 'error' && (
        <section className="bg-white border border-red-100 p-8 rounded-2xl text-center space-y-6 py-12 shadow-[0_10px_30px_rgba(244,63,94,0.05)] animate-in zoom-in-95 duration-200 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-50 text-rose-600 border border-red-200 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-slate-800">Synthesis Problem</h3>
            <p className="text-slate-500 text-xs">
              We encountered an issue while extracting details from your raw assets:
            </p>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-left font-mono text-xs text-rose-700 leading-relaxed overflow-x-auto max-h-40 whitespace-pre-wrap">
              {errorMsg}
            </div>
          </div>

          <div className="pt-2 flex gap-3 max-w-xs mx-auto">
            <button
              onClick={() => setGenerationState('idle')}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-sans font-medium rounded-xl text-xs hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
            >
              Back to Ingestion
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
