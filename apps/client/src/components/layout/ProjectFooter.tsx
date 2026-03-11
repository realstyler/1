import React from 'react';

export default function ProjectFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-8 px-2 md:px-4 mt-auto shrink-0">
      <div className="max-w-400 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-luxury-serif text-[16px] text-[#1a1a1a]">
          RealStyler
        </div>
        <div className="text-[#8e94a0] text-[10px]">
          © 2024 RealStyler Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}