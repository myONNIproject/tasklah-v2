export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const heights = {
    sm: "h-12",   // Significantly larger
    md: "h-16",   
    lg: "h-28"    
  };

  return (
    <div className="flex items-center">
      <img 
        src="/logo.png" 
        alt="TaskLah Logo" 
        className={`${heights[size]} w-auto object-contain block`} 
        style={{ minWidth: '160px' }} // Force it to take up space
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const text = document.createElement('span');
          text.innerText = 'TaskLah!';
          text.className = 'font-black text-blue-600 italic text-2xl tracking-tighter';
          e.currentTarget.parentElement?.appendChild(text);
        }}
      />
    </div>
  );
};
