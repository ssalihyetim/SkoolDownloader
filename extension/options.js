// Options page script
const namingPatternInput = document.getElementById('namingPattern');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDiv = document.getElementById('status');

// Default settings
const DEFAULT_SETTINGS = {
  namingPattern: '{course}/{title}'
};

// Load saved settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  namingPatternInput.value = settings.namingPattern;
}

// Save settings
async function saveSettings() {
  const settings = {
    namingPattern: namingPatternInput.value.trim() || DEFAULT_SETTINGS.namingPattern
  };

  try {
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    showStatus('Error saving settings: ' + error.message, 'error');
  }
}

// Reset to defaults
function resetSettings() {
  namingPatternInput.value = DEFAULT_SETTINGS.namingPattern;
  showStatus('Reset to default settings. Click Save to apply.', 'success');
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';

  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Event listeners
saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetSettings);

// Load settings on page load
loadSettings();

// Auto-save on Enter key
namingPatternInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveSettings();
  }
});
