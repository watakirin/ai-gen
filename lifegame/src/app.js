(() => {
  const canvas = document.getElementById('life');
  const ctx = canvas.getContext('2d');
  const startStopBtn = document.getElementById('startStop');
  const stepBtn = document.getElementById('step');
  const clearBtn = document.getElementById('clear');
  const randomBtn = document.getElementById('random');
  const speedInput = document.getElementById('speed');
  const speedVal = document.getElementById('speedVal');
  const cellSizeInput = document.getElementById('cellSize');
  const cellSizeVal = document.getElementById('cellSizeVal');
  const wrapInput = document.getElementById('wrap');
  const colsInput = document.getElementById('cols');
  const rowsInput = document.getElementById('rows');
  const resizeBtn = document.getElementById('resize');

  let running = false;
  let fps = Number(speedInput.value);
  let cellSize = Number(cellSizeInput.value);
  let cols = Number(colsInput.value);
  let rows = Number(rowsInput.value);
  let wrap = wrapInput.checked;
  let grid = makeGrid(cols, rows);
  let lastTick = 0;

  function makeGrid(c, r) {
    return new Uint8Array(c * r);
  }
  function idx(x, y) { return y * cols + x; }

  function resizeCanvas() {
    canvas.width = cols * cellSize + 1;
    canvas.height = rows * cellSize + 1;
  }

  function randomize(density = 0.25) {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < density ? 1 : 0;
    }
    draw();
  }

  function clearGrid() {
    grid.fill(0);
    draw();
  }

  function neighbors(x, y) {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;
        if (wrap) {
          if (nx < 0) nx = cols - 1; else if (nx >= cols) nx = 0;
          if (ny < 0) ny = rows - 1; else if (ny >= rows) ny = 0;
          n += grid[idx(nx, ny)];
        } else {
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          n += grid[idx(nx, ny)];
        }
      }
    }
    return n;
  }

  function step() {
    const next = new Uint8Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        const alive = grid[i] === 1;
        const nb = neighbors(x, y);
        if (alive) {
          next[i] = nb === 2 || nb === 3 ? 1 : 0;
        } else {
          next[i] = nb === 3 ? 1 : 0;
        }
      }
    }
    grid = next;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // grid lines
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      const gx = Math.floor(x * cellSize) + 0.5;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, rows * cellSize + 0.5); ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      const gy = Math.floor(y * cellSize) + 0.5;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cols * cellSize + 0.5, gy); ctx.stroke();
    }
    // cells
    ctx.fillStyle = '#22c55e';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[idx(x, y)]) {
          ctx.fillRect(
            x * cellSize + 1,
            y * cellSize + 1,
            Math.max(0, cellSize - 1),
            Math.max(0, cellSize - 1)
          );
        }
      }
    }
  }

  function animate(ts) {
    if (!running) return;
    const interval = 1000 / fps;
    if (ts - lastTick >= interval) {
      lastTick = ts;
      step();
    }
    requestAnimationFrame(animate);
  }

  function toggleRunning() {
    running = !running;
    startStopBtn.textContent = running ? '⏸ 停止' : '▶︎ 再生';
    if (running) requestAnimationFrame(animate);
  }

  function setCellFromEvent(ev, value = null) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((ev.clientX - rect.left) / cellSize);
    const y = Math.floor((ev.clientY - rect.top) / cellSize);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    const i = idx(x, y);
    grid[i] = value === null ? (grid[i] ^ 1) : value;
    draw();
  }

  // Drag paint
  let painting = false;
  let paintValue = 1;
  canvas.addEventListener('mousedown', (e) => {
    painting = true;
    // Choose value based on current cell state (toggle pattern)
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    if (x >= 0 && y >= 0 && x < cols && y < rows) {
      paintValue = grid[idx(x, y)] ? 0 : 1;
    }
    setCellFromEvent(e, paintValue);
  });
  window.addEventListener('mousemove', (e) => {
    if (painting) setCellFromEvent(e, paintValue);
  });
  window.addEventListener('mouseup', () => { painting = false; });

  // Controls
  startStopBtn.addEventListener('click', toggleRunning);
  stepBtn.addEventListener('click', () => { if (!running) step(); });
  clearBtn.addEventListener('click', () => { running = false; startStopBtn.textContent = '▶︎ 再生'; clearGrid(); });
  randomBtn.addEventListener('click', () => { randomize(0.3); });

  speedInput.addEventListener('input', () => {
    fps = Number(speedInput.value);
    speedVal.textContent = String(fps);
  });
  cellSizeInput.addEventListener('input', () => {
    cellSize = Number(cellSizeInput.value);
    cellSizeVal.textContent = String(cellSize);
    resizeCanvas();
    draw();
  });
  wrapInput.addEventListener('change', () => { wrap = wrapInput.checked; });

  resizeBtn.addEventListener('click', () => {
    const newCols = Math.max(10, Math.min(300, Number(colsInput.value)) || cols);
    const newRows = Math.max(10, Math.min(200, Number(rowsInput.value)) || rows);
    cols = newCols; rows = newRows;
    const newGrid = makeGrid(cols, rows);
    // Copy overlap region
    for (let y = 0; y < Math.min(rows, grid.length ? rows : 0); y++) {}
    // Simpler: reset when resizing
    grid = newGrid;
    resizeCanvas();
    draw();
  });

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); toggleRunning(); }
    if (e.key === 'r' || e.key === 'R') randomize(0.3);
    if (e.key === 'c' || e.key === 'C') clearGrid();
    if (e.key === 's' || e.key === 'S') { if (!running) step(); }
  });

  // Init
  speedVal.textContent = String(fps);
  cellSizeVal.textContent = String(cellSize);
  resizeCanvas();
  randomize(0.2);
})();

