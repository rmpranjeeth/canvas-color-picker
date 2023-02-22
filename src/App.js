import React, { useState, useEffect, useRef } from 'react';

export default function Canvas() {
  const canvasRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [context, setContext] = useState(null);
  const [digit, setDigit] = useState('00');
  const [color, setColor] = useState('#000');
  const [palette, setPalette] = useState('default');
  const [zoomedIn, setZoomedIn] = useState(false);
  const [zoomedInX, setZoomedInX] = useState(0);
  const [zoomedInY, setZoomedInY] = useState(0);

  // set up canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

    // update canvas size when digit changes
    useEffect(() => {
      if (context) {
        const newWidth = Math.max(context.measureText(digit).width + 100, 600);
        setCanvasWidth(newWidth);
      }
    }, [digit, context]);

  // draw 2D element and update canvas color and palette
  useEffect(() => {
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      context.font = 'bold 50px sans-serif';
      context.fillStyle = '#fff';
      context.fillText(digit, 50, 100);
    }
  }, [digit, color, context, palette]);


  // handle color change
  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  // handle palette change
  const handlePaletteChange = (option) => {
    setPalette(option.value);
    setColor(option.color);
  };

  // handle digit change
  const handleDigitChange = (event) => {
    const value = event.target.value;
    if (value.match(/^\d{0,2}$/)) {
      setDigit(value.padStart(2, '0'));
    }
  };

  // handle canvas resize
  const handleResize = (event) => {
    setCanvasWidth(event.target.offsetWidth);
    setCanvasHeight(event.target.offsetHeight);
  };

  // handle mouse hover for zoomed-in view
  const handleMouseHover = (event) => {
    setZoomedInX(event.clientX + 10);
    setZoomedInY(event.clientY + 10);
    setZoomedIn(true);
  };

  // handle mouse leave for zoomed-in view
  const handleMouseLeave = (event) => {
    setZoomedIn(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{ position: 'relative', display: 'inline-block', margin: '20px' }}
        onMouseMove={handleMouseHover}
        onMouseLeave={handleMouseLeave}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: '1px solid black' }}
        />
        {zoomedIn && (
          <ZoomedIn digit={digit} color={color} x={zoomedInX} y={zoomedInY} />
        )}
        <div style={{ margin: '20px' }}>
        <input type="text" value={digit} onChange={handleDigitChange} />
        <br />
        <input type="color" value={color} onChange={handleColorChange} />
        <br />
        <Dropdown
          options={[
            { value: 'default', label: 'Default', color: '#000' },
            { value: 'palette1', label: 'Palette 1', color: '#f00' },
            { value: 'palette2', label: 'Palette 2', color: '#0f0' },
          ]}
          value={{ value: palette, label: palette }}
          onChange={handlePaletteChange}
        />
      </div>
      </div>
      </div>
      )
  }
function Dropdown({ options, value, onChange }) {
  return (
    <select
      value={value.value}
      onChange={(e) => onChange(options[e.target.selectedIndex])}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ZoomedIn({ digit, color, x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '100px',
        height: '100px',
        border: '1px solid black',
        background: color,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '60px',
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          lineHeight: '80px',
        }}
      >
        {digit}
      </div>
    </div>
  );
}
