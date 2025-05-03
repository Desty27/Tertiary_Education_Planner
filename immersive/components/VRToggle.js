/**
 * VRToggle.js
 * A component for toggling VR mode with accessibility features
 */

class VRToggle {
  constructor(options = {}) {
    this.containerId = options.containerId || 'vr-toggle-container';
    this.sceneId = options.sceneId || 'aframe-scene-container';
    this.buttonText = options.buttonText || 'Enter VR';
    this.exitButtonText = options.exitButtonText || 'Exit VR';
    this.position = options.position || 'bottom-right';
    this.onToggle = options.onToggle || (() => {});
    this.vrSupported = false;
    this.inVRMode = false;
    this.buttonElement = null;
  }

  /**
   * Initialize the VR toggle
   * @returns {HTMLElement} The created toggle container element
   */
  initialize() {
    // Check if WebVR/WebXR is supported
    this.checkVRSupport().then(supported => {
      this.vrSupported = supported;
      if (!supported) {
        console.warn('WebVR/WebXR not supported in this browser');
      }
    });

    // Create container if it doesn't exist
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      this.applyContainerStyles(container);
      document.body.appendChild(container);
    }

    // Create toggle button
    this.buttonElement = document.createElement('button');
    this.buttonElement.textContent = this.buttonText;
    this.applyButtonStyles(this.buttonElement);
    this.buttonElement.setAttribute('aria-label', this.buttonText);
    this.buttonElement.setAttribute('role', 'button');
    
    // Add keyboard support for accessibility
    this.buttonElement.setAttribute('tabindex', '0');
    this.buttonElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleVR();
      }
    });

    // Add click event
    this.buttonElement.addEventListener('click', () => {
      this.toggleVR();
    });

    container.appendChild(this.buttonElement);

    // Listen for VR mode changes from the scene
    this.setupSceneListeners();

    return container;
  }

  /**
   * Apply styles to the container element
   * @param {HTMLElement} container - The container element
   */
  applyContainerStyles(container) {
    container.style.position = 'fixed';
    container.style.zIndex = '1000';
    
    // Position the container based on the position option
    switch (this.position) {
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      case 'bottom-right':
      default:
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
    }
  }

  /**
   * Apply styles to the button element
   * @param {HTMLElement} button - The button element
   */
  applyButtonStyles(button) {
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#4a6cf7';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    button.style.transition = 'background-color 0.3s ease';

    // Hover effect
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#3a5ce7';
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#4a6cf7';
    });

    // Focus styles for accessibility
    button.addEventListener('focus', () => {
      button.style.outline = '2px solid #fff';
      button.style.boxShadow = '0 0 0 4px rgba(74, 108, 247, 0.5)';
    });
    button.addEventListener('blur', () => {
      button.style.outline = 'none';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    });
  }

  /**
   * Set up event listeners for the A-Frame scene
   */
  setupSceneListeners() {
    const scene = document.querySelector(`#${this.sceneId} a-scene`);
    if (!scene) {
      console.warn(`A-Frame scene not found with ID: ${this.sceneId}`);
      return;
    }

    // Listen for enter-vr and exit-vr events
    scene.addEventListener('enter-vr', () => {
      this.inVRMode = true;
      this.updateButtonState();
      this.onToggle(true);
    });

    scene.addEventListener('exit-vr', () => {
      this.inVRMode = false;
      this.updateButtonState();
      this.onToggle(false);
    });
  }

  /**
   * Update the button state based on VR mode
   */
  updateButtonState() {
    if (!this.buttonElement) return;
    
    if (this.inVRMode) {
      this.buttonElement.textContent = this.exitButtonText;
      this.buttonElement.setAttribute('aria-label', this.exitButtonText);
    } else {
      this.buttonElement.textContent = this.buttonText;
      this.buttonElement.setAttribute('aria-label', this.buttonText);
    }
  }

  /**
   * Toggle VR mode
   */
  toggleVR() {
    if (!this.vrSupported) {
      this.showVRNotSupportedMessage();
      return;
    }

    const scene = document.querySelector(`#${this.sceneId} a-scene`);
    if (!scene) {
      console.warn(`A-Frame scene not found with ID: ${this.sceneId}`);
      return;
    }

    if (this.inVRMode) {
      scene.exitVR();
    } else {
      scene.enterVR();
    }
  }

  /**
   * Show a message when VR is not supported
   */
  showVRNotSupportedMessage() {
    const message = document.createElement('div');
    message.textContent = 'VR is not supported in your browser';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    message.style.color = 'white';
    message.style.padding = '20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '2000';
    message.style.maxWidth = '80%';
    message.style.textAlign = 'center';

    document.body.appendChild(message);

    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);
  }

  /**
   * Check if WebVR/WebXR is supported
   * @returns {Promise<boolean>} A promise that resolves to whether VR is supported
   */
  checkVRSupport() {
    return new Promise((resolve) => {
      // Check for WebXR support
      if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr')
          .then(supported => {
            resolve(supported);
          })
          .catch(() => {
            resolve(false);
          });
      } 
      // Fallback to WebVR
      else if (navigator.getVRDisplays) {
        navigator.getVRDisplays()
          .then(displays => {
            resolve(displays && displays.length > 0);
          })
          .catch(() => {
            resolve(false);
          });
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Destroy the VR toggle and clean up resources
   */
  destroy() {
    const container = document.getElementById(this.containerId);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    const scene = document.querySelector(`#${this.sceneId} a-scene`);
    if (scene) {
      scene.removeEventListener('enter-vr', this.updateButtonState);
      scene.removeEventListener('exit-vr', this.updateButtonState);
    }
  }
}

// Export the VRToggle class
export default VRToggle;