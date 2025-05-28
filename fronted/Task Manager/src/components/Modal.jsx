import React, { useEffect } from 'react';

const Modal = ({ children, isOpen, onClose, title }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-x-hidden bg-black/20"
      onClick={onClose}
    >
      <div
        className="relative p-4 max-w-4xl max-h-[90vh]" // Adjusting max-width and max-height here
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div
          className="relative bg-white rounded-lg dark:bg-gray-700"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
        
         <div className="flex items-center justify-between p-4 mt:p-5 border-0 rounded-t border-gray-200 dark:border-gray-600">
  <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b-2 border-gray-300">
    {title}
  </h3>
  <button
    type="button"
    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-gray-600"
    onClick={onClose}
  >
    <svg
      className="w-5 h-5"  
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 1 6 6M7 7l6-6M7 7l-6 6"
      />
    </svg>
  </button>
</div>


          {/* Modal Body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
