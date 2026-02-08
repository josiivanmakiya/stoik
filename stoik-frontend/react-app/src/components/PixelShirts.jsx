import pixelShirts from '../assets/pixel-shirts.svg';

export default function PixelShirts({ width = 320 }) {
  return (
    <img
      src={pixelShirts}
      width={width}
      height={Math.round((width * 200) / 320)}
      alt="Pixel shirts in white, grey, and black"
      style={{ display: 'block', maxWidth: '100%' }}
    />
  );
}
