
import React, { useState, useRef, useEffect } from 'react';

interface Props {
  store: any;
}

const AIAssistant: React.FC<Props> = ({ store }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'sparky', text: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { askSparky, currentUser, chapters } = store;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = input;
    setInput('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    // Get current chapter context if student is in a class
    const currentChapter = chapters.find((c: any) => c.classLevel === currentUser.selectedClass)?.name;
    
    const response = await askSparky(userMsg, currentChapter);
    
    setChat(prev => [...prev, { role: 'sparky', text: response }]);
    setIsThinking(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 h-96 bg-white rounded-[2.5rem] shadow-2xl border-4 border-sky-400 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <header className="bg-sky-400 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <span className="font-black tracking-tight">Sparky Tutor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:scale-110 transition-transform font-black">✕</button>
          </header>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-sky-50/30">
            {chat.length === 0 && (
              <div className="text-center py-6">
                <div className="text-4xl mb-2 animate-bounce">👋</div>
                <p className="text-slate-500 font-bold text-sm">
                  Hi {currentUser.name}! I'm Sparky. Ask me anything about your lessons!
                </p>
              </div>
            )}
            
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm font-medium shadow-sm border-2 ${
                  msg.role === 'user' 
                    ? 'bg-sky-500 text-white border-sky-600 rounded-tr-none' 
                    : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-slate-100 px-4 py-2 rounded-2xl rounded-tl-none flex space-x-1">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t-2 border-slate-50 flex space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              className="flex-grow px-4 py-2 bg-slate-100 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all text-slate-800"
            />
            <button type="submit" className="bg-sky-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform active:scale-95">
              🚀
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-all hover:scale-110 active:scale-90 relative ${
          isOpen ? 'bg-slate-800 rotate-12' : 'bg-sky-500 border-4 border-white'
        }`}
      >
        {isOpen ? '✕' : '✨'}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full animate-ping"></div>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;
