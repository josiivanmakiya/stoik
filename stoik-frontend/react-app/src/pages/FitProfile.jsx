import { useState } from 'react';
import Button from '../components/Button.jsx';
import SizeSlider from '../components/SizeSlider.jsx';
import { saveFitProfile } from '../services/fitProfile.api.js';
import './fit.css';

export default function FitProfile() {
  const [unit, setUnit] = useState('cm');
  const [values, setValues] = useState({
    chest: 102,
    waist: 90,
    hips: 100,
    height: 180
  });
  const [result, setResult] = useState(null);

  const updateValue = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const saved = await saveFitProfile(values);
    setResult(saved);
  };

  return (
    <main className="page fit fade-in">
      <div className="fit__panel">
        <div className="eyebrow">Fit Profile</div>
        <h1 className="title">Quiet fit confidence.</h1>
        <p className="subtitle">
          Add your measurements once. We keep them for every subscription shipment.
        </p>

        <div className="fit__toggle">
          <button className={unit === 'cm' ? 'active' : ''} onClick={() => setUnit('cm')}>
            CM
          </button>
          <button className={unit === 'in' ? 'active' : ''} onClick={() => setUnit('in')}>
            IN
          </button>
        </div>

        <div className="fit__sliders">
          <SizeSlider
            label="Chest"
            value={values.chest}
            min={80}
            max={120}
            unit={unit}
            onChange={(value) => updateValue('chest', value)}
          />
          <SizeSlider
            label="Waist"
            value={values.waist}
            min={70}
            max={110}
            unit={unit}
            onChange={(value) => updateValue('waist', value)}
          />
          <SizeSlider
            label="Hips"
            value={values.hips}
            min={80}
            max={120}
            unit={unit}
            onChange={(value) => updateValue('hips', value)}
          />
          <SizeSlider
            label="Height"
            value={values.height}
            min={150}
            max={200}
            unit={unit}
            onChange={(value) => updateValue('height', value)}
          />
        </div>

        <Button onClick={handleSubmit}>Save measurements</Button>

        {result && (
          <div className="fit__result">
            <span>Recommended size</span>
            <strong>{result.sizeLabel}</strong>
          </div>
        )}
      </div>
    </main>
  );
}
