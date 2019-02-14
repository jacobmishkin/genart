const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const settings = {
  dimensions: [2048, 2048],
  orientation: "landscape"
};

const sketch = () => {
  const createGrid = () => {
    const colorCount = random.rangeFloor(2, 6);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
    const points = [];
    const count = 20;
    const characters = "←↑→↓AB".split("");

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const character = random.pick(characters);
        const radius = Math.abs(random.noise2D(u, v)) * 0.08;
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v],
          character
        });
      }
    }
    return points;
  };

  // random.setSeed(10);
  const points = createGrid().filter(() => random.value() > 0.2);

  return ({ context, width, height }) => {
    const margin = width * 0.05;
    context.fillStyle = "#1d5464";
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const { position, radius, color, rotation, character } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px 'Helvetica'`;
      context.translate(x, y);
      //context.rotate(rotation);
      context.fillText(character, 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
