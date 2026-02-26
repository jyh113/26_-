/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Menu, 
  X, 
  ArrowDown,
  ExternalLink,
  BookOpen,
  Layout,
  Terminal,
  Zap
} from 'lucide-react';
import { promptData, PromptItem } from './data';

export default function App() {
  const [view, setView] = useState<'intro' | 'main'>('intro');
  const [selectedLarge, setSelectedLarge] = useState<string | null>(null);
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null);
  const [selectedSmall, setSelectedSmall] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Group data for navigation
  const categories = useMemo(() => {
    const tree: Record<string, Record<string, string[]>> = {};
    promptData.forEach(item => {
      if (!tree[item.largeCategory]) tree[item.largeCategory] = {};
      if (item.mediumCategory) {
        if (!tree[item.largeCategory][item.mediumCategory]) {
          tree[item.largeCategory][item.mediumCategory] = [];
        }
        if (item.smallCategory) {
          tree[item.largeCategory][item.mediumCategory].push(item.smallCategory);
        }
      }
    });
    return tree;
  }, []);

  const selectedItem = useMemo(() => {
    return promptData.find(item => 
      item.largeCategory === selectedLarge && 
      (item.mediumCategory === selectedMedium || (!item.mediumCategory && !selectedMedium)) &&
      (item.smallCategory === selectedSmall || (!item.smallCategory && !selectedSmall))
    ) || promptData.find(item => item.largeCategory === selectedLarge);
  }, [selectedLarge, selectedMedium, selectedSmall]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnter = () => {
    setView('main');
    // Select first item by default
    if (promptData.length > 0) {
      const first = promptData[0];
      setSelectedLarge(first.largeCategory);
      setSelectedMedium(first.mediumCategory || null);
      setSelectedSmall(first.smallCategory || null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://picsum.photos/seed/analytics/1920/1080?blur=1"
                alt="Background"
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-10 text-center space-y-8 px-6"
            >
              <div className="space-y-4">
                <motion.h2 
                  initial={{ letterSpacing: "0.5em", opacity: 0 }}
                  animate={{ letterSpacing: "1em", opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-sm md:text-base font-medium text-white/80 uppercase ml-[1em]"
                >
                  포스코인재창조원
                </motion.h2>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-2xl whitespace-nowrap">
                  데이터분석 실무 <span className="text-[#A5A580]">활용 프롬프트</span>
                </h1>
              </div>

              <div className="pt-16">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)", color: "#141414" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnter}
                  className="group relative flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full text-xl font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] focus:outline-none"
                >
                  <span>들어가기</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                  
                  {/* Decorative Ring */}
                  <div className="absolute -inset-1 rounded-full border border-white/10 scale-110 group-hover:scale-125 transition-transform duration-500" />
                </motion.button>
              </div>
            </motion.div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Scroll to start</span>
                <ArrowDown className="w-4 h-4 text-white/40" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex h-screen overflow-hidden"
          >
            {/* Sidebar */}
            <motion.aside
              initial={false}
              animate={{ width: isSidebarOpen ? '320px' : '0px' }}
              className="bg-white border-r border-[#141414]/10 flex-shrink-0 overflow-hidden relative"
            >
              <div className="h-full flex flex-col w-[320px]">
                <div className="p-6 border-bottom border-[#141414]/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-1">
                    데이터분석 실무
                  </h3>
                  <p className="text-sm text-[#141414]/60">프롬프트 카테고리</p>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {Object.keys(categories).map((large) => (
                    <div key={large} className="space-y-1">
                      <button
                        onClick={() => {
                          setSelectedLarge(large);
                          setSelectedMedium(null);
                          setSelectedSmall(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                          selectedLarge === large 
                            ? 'bg-[#5A5A40] text-white' 
                            : 'hover:bg-[#141414]/5'
                        }`}
                      >
                        <span className="truncate">{large}</span>
                        {Object.keys(categories[large]).length > 0 && (
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedLarge === large ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {selectedLarge === large && Object.keys(categories[large]).length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 space-y-1 overflow-hidden"
                          >
                            {Object.keys(categories[large]).map((medium) => (
                              <div key={medium} className="space-y-1">
                                <button
                                  onClick={() => {
                                    setSelectedMedium(medium);
                                    setSelectedSmall(null);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                                    selectedMedium === medium 
                                      ? 'bg-[#5A5A40]/10 text-[#5A5A40]' 
                                      : 'text-[#141414]/70 hover:bg-[#141414]/5'
                                  }`}
                                >
                                  <span className="truncate">{medium}</span>
                                  {categories[large][medium].length > 0 && (
                                    <ChevronDown className={`w-3 h-3 transition-transform ${selectedMedium === medium ? 'rotate-180' : ''}`} />
                                  )}
                                </button>
                                
                                {selectedMedium === medium && categories[large][medium].length > 0 && (
                                  <div className="pl-3 space-y-1">
                                    {categories[large][medium].map((small) => (
                                      <button
                                        key={small}
                                        onClick={() => setSelectedSmall(small)}
                                        className={`w-full text-left px-3 py-1 rounded-md text-[11px] transition-colors ${
                                          selectedSmall === small 
                                            ? 'text-[#5A5A40] font-bold border-l-2 border-[#5A5A40]' 
                                            : 'text-[#141414]/50 hover:text-[#141414]'
                                        }`}
                                      >
                                        {small}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F5F5F0]">
              {/* Header */}
              <header className="h-16 bg-white border-b border-[#141414]/10 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors"
                    title="메뉴 토글"
                  >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setView('intro')}
                    className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors flex items-center gap-2 text-xl"
                    title="홈으로 이동"
                  >
                    🏠
                  </button>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-widest whitespace-nowrap">
                      {selectedLarge || 'Select Category'}
                    </span>
                    {selectedMedium && (
                      <>
                        <ChevronRight className="w-3 h-3 text-[#141414]/30" />
                        <span className="text-xs text-[#141414]/60 truncate">{selectedMedium}</span>
                      </>
                    )}
                    {selectedSmall && (
                      <>
                        <ChevronRight className="w-3 h-3 text-[#141414]/30" />
                        <span className="text-xs text-[#141414]/60 truncate">{selectedSmall}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] font-mono text-[#141414]/40 uppercase">
                    POSCO Human Resources Development Institute
                  </span>
                </div>
              </header>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">
                  {selectedItem ? (
                    <motion.div
                      key={selectedItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Content Section */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[#5A5A40]">
                          <BookOpen className="w-5 h-5" />
                          <h4 className="text-sm font-bold uppercase tracking-wider">내용</h4>
                        </div>
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#141414]/5 min-h-[120px]">
                          <div className="prose prose-sm max-w-none text-[#141414]/80 leading-relaxed whitespace-pre-wrap">
                            {selectedItem.content || '설명이 없습니다.'}
                          </div>
                        </div>
                      </section>

                      {/* Prompt Section */}
                      <section className="space-y-4">
                        {!selectedItem.largeCategory.includes("0. 실습파일, 교재") && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#5A5A40]">
                              <span className="text-lg">⌨️</span>
                              <h4 className="text-sm font-bold uppercase tracking-wider">프롬프트</h4>
                            </div>
                            <button
                              onClick={() => handleCopy(selectedItem.prompt)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40] text-white rounded-full text-xs font-medium hover:bg-[#4A4A30] transition-all shadow-md active:scale-95"
                            >
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copied ? '복사됨' : '복사하기'}
                            </button>
                          </div>
                        )}
                          <div className="bg-[#141414] rounded-2xl p-6 md:p-8 shadow-xl relative group overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity text-white text-3xl">
                              ⚡
                            </div>
                            
                            {selectedItem.largeCategory.includes("0. 실습파일, 교재") ? (
                              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                                {selectedItem.id === "resource-2" && (
                                  <a 
                                    href="https://drive.google.com/uc?export=download&id=18530M0ciHo7a3Uw5XWowi5WWF-vhqmc3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-[#A5A580] text-white rounded-xl font-bold hover:bg-[#8A8A60] transition-all shadow-lg hover:shadow-xl active:scale-95 group/btn"
                                  >
                                    <ArrowDown className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
                                    교육 교재 다운로드 (PDF)
                                  </a>
                                )}
                                {selectedItem.id === "resource-1" && (
                                  <div className="flex flex-col items-center space-y-6 w-full">
                                    <a 
                                      href="https://drive.google.com/uc?export=download&id=1ZHplTfW31jt--77nCMh_fDd31CGfSevY"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 px-8 py-4 bg-[#5A5A40] text-white rounded-xl font-bold hover:bg-[#4A4A30] transition-all shadow-lg hover:shadow-xl active:scale-95 group/btn"
                                    >
                                      <ArrowDown className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
                                      실습 데이터 전체 다운로드 (ZIP)
                                    </a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <pre className="font-mono text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                                {selectedItem.prompt}
                              </pre>
                            )}
                          </div>
                      </section>

                      {/* Action Hint */}
                      <div className="pt-4 flex justify-center">
                        <p className="text-[10px] text-[#141414]/30 uppercase tracking-[0.2em]">
                          {selectedItem.largeCategory.includes("0. 실습파일, 교재") 
                            ? "Click the button above to download resources"
                            : "Click copy button to use this prompt"}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#141414]/30 space-y-4 py-20">
                      <Layout className="w-16 h-16 stroke-1" />
                      <p className="text-sm font-medium">카테고리를 선택하여 프롬프트를 확인하세요.</p>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 20, 20, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 20, 20, 0.2);
        }
      `}</style>
    </div>
  );
}
