export function ToggleCapture() {
  return (
    <div className="flex justify-between">
      <p className="font-Mada font-semibold text-[18px] text-white tracking-tight">
        Toggle Capture
      </p>

      <div className="flex items-center gap-1">
        <span className="bg-[#A0A8AA] px-1 rounded-sm font-Mada text-white shadow-md font-sembold tracking-tight">
          CTRL
        </span>
        <span className="bg-[#A0A8AA] px-1 rounded-sm font-Mada text-white shadow-md font-sembold tracking-tight">
          SHIFT
        </span>
        <span className="bg-[#A0A8AA] px-1 rounded-sm font-Mada text-white shadow-md font-sembold tracking-tight">
          P
        </span>
      </div>
    </div>
  );
}
