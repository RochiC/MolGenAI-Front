// moleculas.js - API Integration for MolGenAI con animaciones mejoradas

// API Configuration
const API_URL = 'http://localhost:8000/generate';

// Get DOM elements
const inputField = document.getElementById('moleculas-input');
const generateBtn = document.getElementById('generar');
const responseSection = document.getElementById('respuesta');

// Saved molecules array
let savedMolecules = [];

// Create notification system
function createNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">
        ${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}
      </span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }
  }, duration);
  
  return notification;
}

// Enhanced loading animation
function showLoadingAnimation() {
  return `
    <div class="loading-container">
      <div class="loading-card">
        <div class="loading-animation">
          <div class="dna-helix">
            <div class="dna-strand strand-1"></div>
            <div class="dna-strand strand-2"></div>
            <div class="dna-base base-1"></div>
            <div class="dna-base base-2"></div>
            <div class="dna-base base-3"></div>
            <div class="dna-base base-4"></div>
          </div>
        </div>
        <div class="loading-text">
          <h3>Generando Molécula...</h3>
          <p>Analizando estructura SMILES</p>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to call the API with enhanced UI
async function generateMolecule(inputSmiles) {
  try {
    // Disable button during generation
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generando...';
    
    // Show enhanced loading animation
    responseSection.innerHTML = showLoadingAnimation();
    responseSection.style.display = 'block';
    
    // Add entrance animation
    setTimeout(() => {
      responseSection.classList.add('fade-in');
    }, 100);

    // Make POST request to the API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_text: inputSmiles
      })
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Parse JSON response
    const data = await response.json();
    
    // Simulate processing time for better UX (minimum 1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Display the result with animation
    displayResult(data, inputSmiles);
    
    // Show success notification
    createNotification('¡Molécula generada exitosamente!', 'success');
    
  } catch (error) {
    // Display error message
    displayError(error.message);
    
    // Show error notification
    createNotification(`Error: ${error.message}`, 'error', 5000);
  } finally {
    // Re-enable button
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generar';
  }
}

// Enhanced result display function
function displayResult(data, inputSmiles) {
  const { raw_tokens_string, smiles_postprocesado } = data;
  
  responseSection.innerHTML = `
    <div class="resultado-notification">
      <div class="resultado-header">
        <div class="resultado-icon">🧬</div>
        <div class="resultado-title">
          <h2>Generación Completada</h2>
          <p class="resultado-subtitle">Molécula procesada correctamente</p>
        </div>
        <button class="close-btn" onclick="closeResult()">×</button>
      </div>
      
      <div class="resultado-body">
        <div class="resultado-grid">
          <div class="resultado-card input-card">
            <div class="card-header">
              <span class="card-icon">📝</span>
              <h3>Input Original</h3>
            </div>
            <div class="smiles-display">
              <code>${inputSmiles}</code>
            </div>
          </div>
          
          <div class="resultado-card raw-card">
            <div class="card-header">
              <span class="card-icon">🔤</span>
              <h3>Raw Tokens</h3>
            </div>
            <div class="smiles-display">
              <code>${raw_tokens_string}</code>
            </div>
          </div>
          
          <div class="resultado-card final-card highlight">
            <div class="card-header">
              <span class="card-icon">✨</span>
              <h3>SMILES Final</h3>
            </div>
            <div class="smiles-display final">
              <code>${smiles_postprocesado}</code>
            </div>
            <div class="card-badge">Resultado</div>
          </div>
        </div>
        
        <div class="resultado-actions">
          <button class="action-btn primary" onclick="saveMolecule('${smiles_postprocesado}')">
            <span class="btn-icon">💾</span>
            Guardar Molécula
          </button>
          <button class="action-btn secondary" onclick="copyToClipboard('${smiles_postprocesado}')">
            <span class="btn-icon">📋</span>
            Copiar SMILES
          </button>
          <button class="action-btn tertiary" onclick="resetForm()">
            <span class="btn-icon">🔄</span>
            Nueva Generación
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add entrance animation
  setTimeout(() => {
    const notification = document.querySelector('.resultado-notification');
    notification.classList.add('slide-in');
  }, 100);
}

// Enhanced error display function
function displayError(errorMessage) {
  responseSection.innerHTML = `
    <div class="error-notification">
      <div class="error-header">
        <div class="error-icon">⚠️</div>
        <div class="error-title">
          <h2>Error en la Generación</h2>
          <p class="error-subtitle">No se pudo procesar la molécula</p>
        </div>
        <button class="close-btn" onclick="closeResult()">×</button>
      </div>
      
      <div class="error-body">
        <div class="error-details">
          <div class="error-message-card">
            <h3>Detalles del Error:</h3>
            <p class="error-text">${errorMessage}</p>
          </div>
          
          <div class="error-suggestions">
            <h3>Sugerencias:</h3>
            <ul>
              <li>Verifica que el servidor esté ejecutándose en localhost:8000</li>
              <li>Asegúrate de que el formato SMILES sea correcto</li>
              <li>Revisa tu conexión de red</li>
              <li>Intenta con una molécula más simple (ej: "C" para metano)</li>
            </ul>
          </div>
        </div>
        
        <div class="error-actions">
          <button class="action-btn primary" onclick="resetForm()">
            <span class="btn-icon">🔄</span>
            Reintentar
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add entrance animation
  setTimeout(() => {
    const notification = document.querySelector('.error-notification');
    notification.classList.add('slide-in');
  }, 100);
}

// Function to close result window
function closeResult() {
  const notification = document.querySelector('.resultado-notification, .error-notification');
  if (notification) {
    notification.classList.add('slide-out');
    setTimeout(() => {
      responseSection.style.display = 'none';
      responseSection.classList.remove('fade-in');
    }, 300);
  }
}

// Enhanced save molecule function
function saveMolecule(smiles) {
  if (!savedMolecules.includes(smiles)) {
    savedMolecules.push(smiles);
    updateSavedMolecules();
    createNotification('Molécula guardada correctamente', 'success');
  } else {
    createNotification('Esta molécula ya está guardada', 'info');
  }
}

// Function to update saved molecules in sidebar
function updateSavedMolecules() {
  const sidebar = document.querySelector('.sidebar');
  let savedList = document.getElementById('saved-list');
  
  if (!savedList) {
    savedList = document.createElement('ul');
    savedList.id = 'saved-list';
    savedList.className = 'saved-list';
    
    const guardadasP = document.querySelector('.guardadas');
    guardadasP.parentNode.insertBefore(savedList, guardadasP.nextSibling);
  }
  
  savedList.innerHTML = savedMolecules.map((mol, index) => `
    <li class="saved-item" onclick="loadMolecule('${mol}')">
      <div class="saved-content">
        <span class="saved-smiles" title="${mol}">${mol.substring(0, 12)}${mol.length > 12 ? '...' : ''}</span>
        <span class="saved-date">${new Date().toLocaleDateString()}</span>
      </div>
      <button class="btn-delete" onclick="event.stopPropagation(); deleteMolecule(${index})" aria-label="Eliminar">×</button>
    </li>
  `).join('');
}

// Function to load saved molecule
function loadMolecule(smiles) {
  inputField.value = smiles;
  createNotification('Molécula cargada en el input', 'info');
}

// Function to delete saved molecule
function deleteMolecule(index) {
  savedMolecules.splice(index, 1);
  updateSavedMolecules();
  createNotification('Molécula eliminada', 'info');
}

// Enhanced copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    createNotification('SMILES copiado al portapapeles', 'success');
  }).catch(err => {
    console.error('Error al copiar:', err);
    createNotification('Error al copiar al portapapeles', 'error');
  });
}

// Function to reset form
function resetForm() {
  inputField.value = '';
  closeResult();
  inputField.focus();
}

// Event listener for generate button
generateBtn.addEventListener('click', () => {
  const inputValue = inputField.value.trim();

  if (inputValue === '') {
    createNotification('Por favor, ingrese una molécula SMILES', 'error');
    inputField.focus();
    return;
  }
  const smilesRegex = /^[A-Za-z0-9@+\-=#%\/\\()\[\]\.\*]+$/;
  if (!smilesRegex.test(inputValue)) {
    createNotification('Por favor, ingrese un SMILES válido (por ejemplo: CCO, CC(=O)O, etc). Solo letras, números y símbolos químicos.', 'error');
    inputField.focus();
    return;
  }

  generateMolecule(inputValue);
});

// El listener de Enter sólo llama a generateBtn.click()
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    generateBtn.click();
  }
});



// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  inputField.focus();
  createNotification('MolGenAI listo para generar moléculas', 'info', 2000);
});

// Make functions available globally
window.saveMolecule = saveMolecule;
window.deleteMolecule = deleteMolecule;
window.loadMolecule = loadMolecule;
window.copyToClipboard = copyToClipboard;
window.resetForm = resetForm;
window.closeResult = closeResult;
