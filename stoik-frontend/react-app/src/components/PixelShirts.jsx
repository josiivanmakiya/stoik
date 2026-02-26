import './pixel-shirts.css';

export default function PixelShirts() {
  return (
    <div className="pixel-shirts" role="img" aria-label="Fanned shirts in black, grey, and white">
      <div className="pixel-shirts__layer pixel-shirts__layer--black" />
      <div className="pixel-shirts__layer pixel-shirts__layer--grey" />
      <div className="pixel-shirts__layer pixel-shirts__layer--white" />
    </div>
  );
}