import Switch from "./Switch";

const SwitchGroup: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onToggle: Function;
}> = ({ id, label, checked, onToggle }) => {
  return (
    <div className="flex justify-between items-center">
      <p className="font-Mada font-semibold text-[18px] text-white tracking-tight">
        {label}
      </p>
      <Switch id={id} checked={checked} onChange={() => onToggle(id)} />
    </div>
  );
};

export default SwitchGroup;
