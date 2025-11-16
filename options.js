const DEFAULTS = {
  stepSeconds: 3.0,
  fineStepSeconds: 1,
  fineModifier: 'Alt',
  enableOnInputs: false
};

function restore() {
  chrome.storage.sync.get(DEFAULTS, (res) => {
    document.getElementById('stepSeconds').value = res.stepSeconds;
    document.getElementById('fineStepSeconds').value = res.fineStepSeconds;
    document.getElementById('fineModifier').value = res.fineModifier;
    document.getElementById('enableOnInputs').checked = !!res.enableOnInputs;
    document.getElementById('modLabel').textContent = res.fineModifier;
  });
}

function save() {
  const stepSeconds = parseFloat(document.getElementById('stepSeconds').value) || 3.0;
  const fineStepSeconds = parseFloat(document.getElementById('fineStepSeconds').value) || 1;
  const fineModifier = document.getElementById('fineModifier').value;
  const enableOnInputs = document.getElementById('enableOnInputs').checked;

  chrome.storage.sync.set({ stepSeconds, fineStepSeconds, fineModifier, enableOnInputs }, () => {
    const s = document.getElementById('status');
    s.textContent = 'Saved';
    setTimeout(() => (s.textContent = ''), 1200);
    document.getElementById('modLabel').textContent = fineModifier;
  });
}

document.getElementById('saveBtn').addEventListener('click', save);

document.getElementById('fineModifier').addEventListener('change', (e) => {
  document.getElementById('modLabel').textContent = e.target.value;
});

document.addEventListener('DOMContentLoaded', restore);
