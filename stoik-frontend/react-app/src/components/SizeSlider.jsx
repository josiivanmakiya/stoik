export default function SizeSlider({ label, value, min, max, unit, onChange }) {
  return (
    <div className="fit__slider">
      <label>{label}</label>
      <div className="fit__value">
        {value} {unit}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
