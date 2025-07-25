import { marqueeDataTop, marqueeDataBottom } from '../constants/whatWeDo'; // Import static data from constants


import { useState, useRef } from 'react';


const marqueeStyles = `
  @keyframes marquee-left {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes marquee-right {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0%); }
  }
  .animate-marquee-left {
    animation: marquee-left 40s linear infinite;
  }
  .animate-marquee-right {
    animation: marquee-right 40s linear infinite;
  }
  /* Pause animation on hover, but only if not paused by a click */
  .marquee-container:not(.paused):hover .animate-marquee-left,
  .marquee-container:not(.paused):hover .animate-marquee-right {
    animation-play-state: paused;
  }
`;


const CloseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


const WhatWeDo = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [topOffset, setTopOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);

  const topMarqueeRef = useRef(null);
  const bottomMarqueeRef = useRef(null);

  const handleItemClick = (item, event, marqueeLine) => {
    const topEl = topMarqueeRef.current;
    const bottomEl = bottomMarqueeRef.current;
    if (!topEl || !bottomEl) return;


    const topStyle = window.getComputedStyle(topEl);
    const topMatrix = new DOMMatrixReadOnly(topStyle.transform);
    const currentTopX = topMatrix.m41;

    const bottomStyle = window.getComputedStyle(bottomEl);
    const bottomMatrix = new DOMMatrixReadOnly(bottomStyle.transform);
    const currentBottomX = bottomMatrix.m41;
    

    const screenCenter = window.innerWidth / 2;
    const itemRect = event.currentTarget.getBoundingClientRect();
    const itemCenter = itemRect.left + itemRect.width / 2;
    const centeringOffset = screenCenter - itemCenter;


    if (marqueeLine === 'top') {
      setTopOffset(currentTopX + centeringOffset);
      setBottomOffset(currentBottomX);
    } else {
      setTopOffset(currentTopX);
      setBottomOffset(currentBottomX + centeringOffset);
    }

    setSelectedItem(item);
    setIsPaused(true);
  };

  const handleCloseImage = () => {
    setSelectedItem(null);
    setIsPaused(false);
  };

  const topContent = [...marqueeDataTop, ...marqueeDataTop];
  const bottomContent = [...marqueeDataBottom, ...marqueeDataBottom];

  return (
    <>
      <style>{marqueeStyles}</style>
      <div className="relative flex flex-col items-start justify-center bg-black text-white overflow-x-hidden p-4 md:py-12 md:px-24">
        
        <header className="w-full mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-light tracking-widest">What we do!</h1>
        </header>

        
        <div className={`relative w-full marquee-container space-y-8 ${isPaused ? 'paused' : ''}`}>
          {/* Top Row */}
          <div className="overflow-hidden">
            <div 
              ref={topMarqueeRef}
              className={`flex ${!isPaused ? 'animate-marquee-left' : ''}`}
              style={{ 
                transform: isPaused ? `translateX(${topOffset}px)` : 'none',
                transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {topContent.map((item, index) => (
                <div key={`top-${index}`} onClick={(e) => handleItemClick(item, e, 'top')} className="flex-shrink-0 mx-8 text-4xl md:text-6xl font-bold tracking-[0.2em] uppercase whitespace-nowrap cursor-pointer hover:text-teal-400 transition-colors duration-300">
                  {item.text} <span className="text-teal-500 font-sans mx-4">&gt;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <div 
              ref={bottomMarqueeRef}
              className={`flex ${!isPaused ? 'animate-marquee-right' : ''}`}
              style={{ 
                transform: isPaused ? `translateX(${bottomOffset}px)` : 'none',
                transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {bottomContent.map((item, index) => (
                <div key={`bottom-${index}`} onClick={(e) => handleItemClick(item, e, 'bottom')} className="flex-shrink-0 mx-8 text-4xl md:text-6xl font-bold tracking-[0.2em] uppercase whitespace-nowrap cursor-pointer hover:text-teal-400 transition-colors duration-300">
                  {item.text} <span className="text-teal-500 font-sans mx-4">&gt;</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {selectedItem && (
          <div className="absolute z-10 p-2 bg-white rounded-md shadow-2xl shadow-black/50 -rotate-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={handleCloseImage} className="absolute -top-3 -right-3 bg-black text-white rounded-full p-1.5 z-20 hover:bg-gray-700 transition-colors">
              <CloseIcon />
            </button>
            <img
              src={selectedItem.image}
              alt={selectedItem.text}
              className="w-96 h-auto rounded"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x150/000000/FFFFFF?text=Image'; }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default WhatWeDo;
