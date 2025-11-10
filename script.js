// Simple accessible tab switcher (no external deps)
const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const tabpanels = Array.from(document.querySelectorAll('.tabpanel'));

function activateTab(id) {
  tabButtons.forEach(btn => {
    const isActive = btn.getAttribute('aria-controls') === id;
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  tabpanels.forEach(p => {
    p.classList.toggle('active', p.id === id);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.getAttribute('aria-controls')));
  btn.addEventListener('keydown', (e) => {
    const idx = tabButtons.indexOf(btn);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabButtons[(idx + 1) % tabButtons.length];
      next.focus(); next.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabButtons[(idx - 1 + tabButtons.length) % tabButtons.length];
      prev.focus(); prev.click();
    }
  });
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Load saved theme from localStorage or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

// Accordion functionality
const accordionHeaders = Array.from(document.querySelectorAll('.accordion-header'));

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    const content = header.nextElementSibling;
    
    // Simply toggle the clicked accordion without affecting others
    if (isExpanded) {
      header.setAttribute('aria-expanded', 'false');
      content.classList.remove('active');
    } else {
      header.setAttribute('aria-expanded', 'true');
      content.classList.add('active');
    }
  });
  
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      header.click();
    }
  });
});

// HTML sanitization utility
function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Atbash cipher demo
function transformAtbash() {
  const inputElement = document.getElementById('atbash-input');
  const input = inputElement.value.toUpperCase().replace(/[^A-Z\s]/g, ''); // Only allow A-Z and spaces
  inputElement.value = input; // Update input field with sanitized value
  const result = document.getElementById('atbash-result');
  
  // Reset all highlights
  for (let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i);
    const mapElement = document.getElementById(`map-${char}`);
    if (mapElement) {
      mapElement.style.background = 'var(--card)';
      mapElement.style.borderColor = 'var(--border)';
    }
  }
  
  let output = '';
  const usedChars = new Set();
  
  for (let char of input) {
    if (char >= 'A' && char <= 'Z') {
      // A=0, Z=25 -> Z=0, A=25
      const transformed = String.fromCharCode(25 - (char.charCodeAt(0) - 65) + 65);
      output += transformed;
      usedChars.add(char);
    } else {
      output += char; // Keep non-alphabetic characters as is
    }
  }
  
  // Highlight used characters
  usedChars.forEach(char => {
    const mapElement = document.getElementById(`map-${char}`);
    if (mapElement) {
      mapElement.style.background = 'var(--accent)';
      mapElement.style.borderColor = 'var(--accent)';
      mapElement.style.color = 'white';
    }
  });
  
  result.textContent = output;
}

function clearAtbash() {
  document.getElementById('atbash-input').value = '';
  document.getElementById('atbash-result').textContent = '';
  
  // Reset all highlights
  for (let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i);
    const mapElement = document.getElementById(`map-${char}`);
    if (mapElement) {
      mapElement.style.background = 'var(--card)';
      mapElement.style.borderColor = 'var(--border)';
      mapElement.style.color = 'var(--text)';
    }
  }
}

// String reversal demo
function reverseString() {
  const inputElement = document.getElementById('reverse-input');
  const input = inputElement.value.replace(/[<>"'&]/g, ''); // Remove potentially harmful characters
  inputElement.value = input;
  const result = document.getElementById('reverse-result');
  const steps = document.getElementById('reverse-steps');
  
  const reversed = input.split('').reverse().join('');
  result.textContent = reversed;
  
  if (input.length > 0) {
    // Use textContent instead of innerHTML for safety
    const stepText = `手順: "${input}" → "${reversed}"\nもう一度適用: "${reversed}" → "${input.split('').reverse().reverse().join('')}"`;
    steps.textContent = stepText;
  }
}

function clearReverse() {
  document.getElementById('reverse-input').value = '';
  document.getElementById('reverse-result').textContent = '';
  document.getElementById('reverse-steps').innerHTML = '';
}

// Pair swap demo
function swapPairs() {
  const inputElement = document.getElementById('pair-input');
  const input = inputElement.value.replace(/[<>"'&]/g, ''); // Remove potentially harmful characters
  inputElement.value = input;
  const result = document.getElementById('pair-result');
  const visualization = document.getElementById('pair-visualization');
  
  let swapped = '';
  let visualSteps = [];
  
  for (let i = 0; i < input.length; i += 2) {
    if (i + 1 < input.length) {
      // Swap pair
      swapped += input[i + 1] + input[i];
      visualSteps.push(`(${input[i]}${input[i + 1]} → ${input[i + 1]}${input[i]})`);
    } else {
      // Odd character, keep as is
      swapped += input[i];
      visualSteps.push(`(${input[i]} → ${input[i]})`);
    }
  }
  
  result.textContent = swapped;
  
  if (input.length > 0) {
    // Create elements safely
    visualization.innerHTML = '';
    const div1 = document.createElement('div');
    div1.style.color = 'var(--muted)';
    div1.textContent = `ペア交換: ${visualSteps.join(' ')}`;
    
    const div2 = document.createElement('div');
    div2.style.marginTop = '8px';
    div2.style.color = 'var(--muted)';
    div2.textContent = `もう一度適用すると元に戻る: "${swapped}" → "${input}"`;
    
    visualization.appendChild(div1);
    visualization.appendChild(div2);
  }
}

function clearPairs() {
  document.getElementById('pair-input').value = '';
  document.getElementById('pair-result').textContent = '';
  document.getElementById('pair-visualization').innerHTML = '';
}

// Matrix transpose demo
let currentMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
let transposeCount = 0;

function displayMatrix() {
  const display = document.getElementById('matrix-display');
  const steps = document.getElementById('matrix-steps');
  
  display.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 8px; font-size: 12px; color: var(--muted);">元の行列${transposeCount > 0 ? ` (転置${transposeCount}回)` : ''}</div>
      <div style="display: inline-block; border: 1px solid var(--border); border-radius: 6px; padding: 8px; background: var(--card);">
        ${currentMatrix.map(row => 
          `<div style="display: flex; gap: 4px; margin: 2px 0;">
            ${row.map(cell => 
              `<div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: var(--bg); border: 1px solid var(--border); border-radius: 3px; font-size: 12px; font-family: monospace;">${cell}</div>`
            ).join('')}
          </div>`
        ).join('')}
      </div>
    </div>
  `;
  
  if (transposeCount > 0) {
    steps.textContent = transposeCount === 1 ? '1回転置済み。もう一度転置すると元に戻ります。' : 
                       transposeCount === 2 ? '2回転置完了。元の行列に戻りました！' : '';
  }
}

function transposeMatrix() {
  // Transpose: swap rows and columns
  const transposed = currentMatrix[0].map((_, colIndex) => 
    currentMatrix.map(row => row[colIndex])
  );
  
  currentMatrix = transposed;
  transposeCount++;
  
  if (transposeCount > 2) {
    transposeCount = 0;
  }
  
  displayMatrix();
}

function resetMatrix() {
  currentMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  transposeCount = 0;
  displayMatrix();
}

// Initialize demos and attach event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Matrix display initialization
  if (document.getElementById('matrix-display')) {
    displayMatrix();
  }

  // Atbash event listeners
  const atbashTransformBtn = document.getElementById('atbash-transform-btn');
  const atbashClearBtn = document.getElementById('atbash-clear-btn');
  if (atbashTransformBtn) atbashTransformBtn.addEventListener('click', transformAtbash);
  if (atbashClearBtn) atbashClearBtn.addEventListener('click', clearAtbash);

  // String reverse event listeners
  const reverseTransformBtn = document.getElementById('reverse-transform-btn');
  const reverseClearBtn = document.getElementById('reverse-clear-btn');
  if (reverseTransformBtn) reverseTransformBtn.addEventListener('click', reverseString);
  if (reverseClearBtn) reverseClearBtn.addEventListener('click', clearReverse);

  // Pair swap event listeners
  const pairTransformBtn = document.getElementById('pair-transform-btn');
  const pairClearBtn = document.getElementById('pair-clear-btn');
  if (pairTransformBtn) pairTransformBtn.addEventListener('click', swapPairs);
  if (pairClearBtn) pairClearBtn.addEventListener('click', clearPairs);

  // Matrix transpose event listeners
  const matrixTransposeBtn = document.getElementById('matrix-transpose-btn');
  const matrixResetBtn = document.getElementById('matrix-reset-btn');
  if (matrixTransposeBtn) matrixTransposeBtn.addEventListener('click', transposeMatrix);
  if (matrixResetBtn) matrixResetBtn.addEventListener('click', resetMatrix);

  // Bitwise event listeners
  const bitwiseTransformBtn = document.getElementById('bitwise-transform-btn');
  const bitwiseClearBtn = document.getElementById('bitwise-clear-btn');
  if (bitwiseTransformBtn) bitwiseTransformBtn.addEventListener('click', flipBits);
  if (bitwiseClearBtn) bitwiseClearBtn.addEventListener('click', clearBitwise);

  // Feistel event listeners
  const feistelNextBtn = document.getElementById('feistel-next-btn');
  const feistelResetBtn = document.getElementById('feistel-reset-btn');
  if (feistelNextBtn) feistelNextBtn.addEventListener('click', feistelRound);
  if (feistelResetBtn) feistelResetBtn.addEventListener('click', resetFeistel);

  // Bitwise input mode change handler
  const inputMode = document.getElementById('input-mode');
  const bitwiseInput = document.getElementById('bitwise-input');
  if (inputMode && bitwiseInput) {
    inputMode.addEventListener('change', function() {
      if (this.value === 'char') {
        bitwiseInput.value = 'A';
        bitwiseInput.placeholder = 'A';
      } else {
        bitwiseInput.value = '65';
        bitwiseInput.placeholder = '65';
      }
    });
  }

  // Initialize Feistel demo
  if (document.getElementById('feistel-display')) {
    resetFeistel();

    // Add real-time input validation
    const feistelInput = document.getElementById('feistel-input');
    const feistelKey = document.getElementById('feistel-key');
    if (feistelInput && feistelKey) {
      feistelInput.addEventListener('input', validateAndUpdateFeistel);
      feistelKey.addEventListener('input', validateAndUpdateFeistel);
    }
  }
});

// Bitwise NOT demo
function flipBits() {
  const input = document.getElementById('bitwise-input').value;
  const mode = document.getElementById('input-mode').value;
  const display = document.getElementById('bitwise-display');
  const result = document.getElementById('bitwise-result');
  const explanation = document.getElementById('bitwise-explanation');
  
  if (!input.trim()) {
    result.textContent = '';
    display.innerHTML = '';
    explanation.innerHTML = '';
    return;
  }
  
  let value;
  let originalChar;
  
  if (mode === 'char') {
    if (input.length === 0) return;
    originalChar = input[0];
    value = originalChar.charCodeAt(0);
  } else {
    value = parseInt(input);
    if (isNaN(value) || value < 0 || value > 255) {
      result.textContent = 'エラー: 0-255の数値を入力してください';
      return;
    }
    originalChar = String.fromCharCode(value);
  }
  
  // Perform bitwise NOT (flip all bits)
  const flipped = (~value) & 0xFF; // Keep only 8 bits
  const flippedChar = String.fromCharCode(flipped);
  
  // Display binary representation
  const originalBinary = value.toString(2).padStart(8, '0');
  const flippedBinary = flipped.toString(2).padStart(8, '0');
  
  display.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px; background: var(--card); border-radius: 8px; font-family: monospace; font-size: 12px;">
      <div style="text-align: center; flex: 1;">
        <div style="color: var(--text); font-weight: 600; margin-bottom: 4px;">元の値</div>
        <div style="color: var(--muted); margin-bottom: 2px;">${mode === 'char' ? `'${originalChar}'` : originalChar} (${value})</div>
        <div style="color: var(--accent); font-weight: bold;">${originalBinary}</div>
      </div>
      <div style="color: var(--muted); font-size: 16px;">→</div>
      <div style="text-align: center; flex: 1;">
        <div style="color: var(--text); font-weight: 600; margin-bottom: 4px;">反転後</div>
        <div style="color: var(--muted); margin-bottom: 2px;">${mode === 'char' ? `'${flippedChar}'` : flippedChar} (${flipped})</div>
        <div style="color: var(--accent); font-weight: bold;">${flippedBinary}</div>
      </div>
    </div>
  `;
  
  if (mode === 'char') {
    result.textContent = `'${originalChar}' → '${flippedChar}'`;
  } else {
    result.textContent = `${value} → ${flipped}`;
  }
  
  explanation.innerHTML = `
    <div>💡 インボリューション性: もう一度ビット反転すると元に戻ります</div>
    <div style="margin-top: 4px;">2回目の反転: ${flippedBinary} → ${originalBinary} (${mode === 'char' ? `'${flippedChar}'` : flipped} → ${mode === 'char' ? `'${originalChar}'` : value})</div>
  `;
}

function clearBitwise() {
  document.getElementById('bitwise-input').value = '';
  document.getElementById('bitwise-result').textContent = '';
  document.getElementById('bitwise-display').innerHTML = '';
  document.getElementById('bitwise-explanation').innerHTML = '';
}


// Feistel cipher demo
let feistelState = {
  left: 0,
  right: 0,
  round: 0,
  original: 0,
  history: []
};

function simpleFeistelFunction(right, key) {
  // Simple F function: (right + key) mod 16, then some bit manipulation
  return ((right + key) % 16) ^ (right >> 2);
}

function displayFeistelState() {
  const display = document.getElementById('feistel-display');
  const result = document.getElementById('feistel-result');
  const status = document.getElementById('feistel-status');
  const progress = document.getElementById('feistel-progress');
  const comparison = document.getElementById('feistel-comparison');
  const nextBtn = document.getElementById('feistel-next-btn');
  
  const leftBin = feistelState.left.toString(2).padStart(4, '0');
  const rightBin = feistelState.right.toString(2).padStart(4, '0');
  const combinedValue = (feistelState.left << 4) | feistelState.right;
  
  // Progress bar
  const progressBars = [];
  for (let i = 1; i <= 4; i++) {
    const isComplete = i <= feistelState.round;
    const isCurrent = i === feistelState.round + 1 && feistelState.round < 4;
    progressBars.push(`
      <div style="display: inline-block; width: 40px; height: 6px; margin: 0 2px; border-radius: 3px; background: ${
        isComplete ? 'var(--accent)' : isCurrent ? 'rgba(56,189,248,0.3)' : 'var(--border)'
      };"></div>
    `);
  }
  progress.innerHTML = `
    <div style="color: var(--muted); font-size: 12px; margin-bottom: 6px;">進行状況: ${feistelState.round}/4 ラウンド</div>
    <div>${progressBars.join('')}</div>
  `;
  
  // Visual blocks display
  display.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; padding: 16px; background: var(--card); border-radius: 8px; border: 2px solid ${feistelState.round === 4 && combinedValue === feistelState.original ? 'var(--accent)' : 'var(--border)'};">
      <div style="text-align: center; padding: 12px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border);">
        <div style="color: var(--text); font-weight: 600; margin-bottom: 6px; font-size: 12px;">左ブロック (L)</div>
        <div style="color: var(--accent); font-weight: bold; font-size: 18px; font-family: monospace;">${leftBin}</div>
        <div style="color: var(--muted); font-size: 11px; margin-top: 4px;">10進: ${feistelState.left}</div>
      </div>
      <div style="color: var(--accent); font-size: 24px; font-weight: bold;">⟷</div>
      <div style="text-align: center; padding: 12px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border);">
        <div style="color: var(--text); font-weight: 600; margin-bottom: 6px; font-size: 12px;">右ブロック (R)</div>
        <div style="color: var(--accent); font-weight: bold; font-size: 18px; font-family: monospace;">${rightBin}</div>
        <div style="color: var(--muted); font-size: 11px; margin-top: 4px;">10進: ${feistelState.right}</div>
      </div>
    </div>
  `;
  
  // Result display
  result.textContent = `${combinedValue} (2進数: ${leftBin}${rightBin})`;
  
  // Comparison with original
  if (feistelState.round > 0) {
    const isOriginal = combinedValue === feistelState.original;
    comparison.innerHTML = `元の値: ${feistelState.original} ${isOriginal ? '✅ 一致!' : ''}`;
  } else {
    comparison.innerHTML = '';
  }
  
  // Update button text
  if (feistelState.round < 4) {
    nextBtn.innerHTML = `🔄 次のラウンド (${feistelState.round + 1}/4)`;
    nextBtn.style.background = 'var(--accent)';
  } else {
    nextBtn.innerHTML = '✅ 完了 (続行可能)';
    nextBtn.style.background = 'var(--card)';
    nextBtn.style.color = 'var(--text)';
    nextBtn.style.border = '1px solid var(--border)';
  }
  
  // Status messages
  if (feistelState.round === 0) {
    status.innerHTML = '💡 開始: 「次のラウンド」ボタンを押してFeistel変換を開始してください';
    status.style.background = 'rgba(56,189,248,0.1)';
    status.style.color = 'var(--accent)';
  } else if (feistelState.round <= 3) {
    status.innerHTML = `📍 ラウンド ${feistelState.round} 完了<br>あと${4 - feistelState.round}ラウンドで元の値 (${feistelState.original}) に戻ります`;
    status.style.background = 'rgba(255,193,7,0.1)';
    status.style.color = '#ff6b35';
  } else if (feistelState.round === 4) {
    const isOriginal = combinedValue === feistelState.original;
    status.innerHTML = `🎉 4ラウンド完了！<br>${isOriginal ? `✅ 元の値 (${feistelState.original}) に戻りました` : '❌ 値が変化しています'}`;
    status.style.background = isOriginal ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)';
    status.style.color = isOriginal ? '#28a745' : '#dc3545';
  } else {
    status.innerHTML = `🔄 ラウンド ${feistelState.round}<br>同じ処理を繰り返すことで暗号化・復号が可能です`;
    status.style.background = 'rgba(108,117,125,0.1)';
    status.style.color = 'var(--muted)';
  }
}

function feistelRound() {
  const keyInput = document.getElementById('feistel-key');
  const keyError = document.getElementById('feistel-key-error');
  const key = parseInt(keyInput.value) || 0;
  
  if (key < 0 || key > 15) {
    keyError.textContent = 'エラー: キーは0-15の範囲で入力してください';
    keyError.style.display = 'block';
    return;
  }
  keyError.style.display = 'none';
  
  // Feistel round: L' = R, R' = L XOR F(R, K)
  const newLeft = feistelState.right;
  const fResult = simpleFeistelFunction(feistelState.right, key);
  const newRight = feistelState.left ^ fResult;
  
  // Store history
  feistelState.history.push({
    round: feistelState.round,
    left: feistelState.left,
    right: feistelState.right,
    fResult: fResult,
    newLeft: newLeft,
    newRight: newRight
  });
  
  feistelState.left = newLeft;
  feistelState.right = newRight & 0xF; // Keep 4 bits
  feistelState.round++;
  
  displayFeistelState();
}

function validateAndUpdateFeistel() {
  const inputElement = document.getElementById('feistel-input');
  const keyElement = document.getElementById('feistel-key');
  const inputError = document.getElementById('feistel-input-error');
  const keyError = document.getElementById('feistel-key-error');
  
  let hasError = false;
  
  // Validate input value
  const inputValue = inputElement.value.trim();
  if (inputValue === '') {
    inputError.textContent = 'エラー: 0-255の数値を入力してください';
    inputError.style.display = 'block';
    hasError = true;
  } else {
    const value = parseInt(inputValue);
    if (isNaN(value) || value < 0 || value > 255) {
      inputError.textContent = 'エラー: 0-255の範囲で入力してください';
      inputError.style.display = 'block';
      hasError = true;
    } else {
      inputError.style.display = 'none';
    }
  }
  
  // Validate key value
  const keyValue = keyElement.value.trim();
  if (keyValue === '') {
    keyError.textContent = 'エラー: 0-15の数値を入力してください';
    keyError.style.display = 'block';
    hasError = true;
  } else {
    const key = parseInt(keyValue);
    if (isNaN(key) || key < 0 || key > 15) {
      keyError.textContent = 'エラー: 0-15の範囲で入力してください';
      keyError.style.display = 'block';
      hasError = true;
    } else {
      keyError.style.display = 'none';
    }
  }
  
  // If no errors, update the display in real-time
  if (!hasError) {
    resetFeistel();
  }
}

function resetFeistel() {
  const input = document.getElementById('feistel-input');
  const value = parseInt(input.value) || 170;
  
  if (value < 0 || value > 255) {
    return; // Error handling now done in validateAndUpdateFeistel
  }
  
  // Split 8-bit value into two 4-bit halves
  feistelState.left = (value >> 4) & 0xF;  // Upper 4 bits
  feistelState.right = value & 0xF;         // Lower 4 bits
  feistelState.round = 0;
  feistelState.original = value;
  feistelState.history = [];
  
  displayFeistelState();
}