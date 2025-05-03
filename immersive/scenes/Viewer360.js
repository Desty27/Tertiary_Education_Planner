/**
 * Viewer360.js
 * A 360° photo/video viewer component for immersive educational experiences
 */

import SceneContainer from '../components/SceneContainer.js';
import AssetManager from '../utils/AssetManager.js';
import VRToggle from '../components/VRToggle.js';

class Viewer360 {
  constructor(options = {}) {
    this.containerId = options.containerId || 'viewer-360-container';
    this.width = options.width || '100%';
    this.height = options.height || '500px';
    this.initialContent = options.initialContent || null;
    this.showControls = options.showControls !== undefined ? options.showControls : true;
    this.showVRToggle = options.showVRToggle !== undefined ? options.showVRToggle : true;
    this.onContentChange = options.onContentChange || (() => {});
    this.onHotspotClick = options.onHotspotClick || (() => {});
    
    this.assetManager = new AssetManager();
    this.sceneContainer = null;
    this.vrToggle = null;
    this.currentContent = null;
    this.hotspots = [];
  }

  /**
   * Initialize the 360° viewer
   * @returns {HTMLElement} The created viewer container element
   */
  initialize() {
    // Create container if it doesn't exist
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.style.width = this.width;
      container.style.height = this.height;
      container.style.position = 'relative';
      document.body.appendChild(container);
    }

    // Initialize the scene container
    this.sceneContainer = new SceneContainer({
      containerId: `${this.containerId}-scene`,
      width: '100%',
      height: '100%',
      embedded: true,
      vr: true,
      onSceneLoaded: this.handleSceneLoaded.bind(this)
    });

    // Add the scene container to the main container
    const sceneElement = this.sceneContainer.initialize();
    container.appendChild(sceneElement);

    // Initialize VR toggle if enabled
    if (this.showVRToggle) {
      this.vrToggle = new VRToggle({
        containerId: `${this.containerId}-vr-toggle`,
        sceneId: `${this.containerId}-scene`,
        position: 'bottom-right',
        onToggle: (inVR) => {
          console.log(`VR mode ${inVR ? 'entered' : 'exited'}`);
        }
      });
      this.vrToggle.initialize();
    }

    // Initialize with content if provided
    if (this.initialContent) {
      this.loadContent(this.initialContent);
    }

    // Add navigation controls if enabled
    if (this.showControls) {
      this.addNavigationControls(container);
    }

    return container;
  }

  /**
   * Handle scene loaded event
   * @param {Object} scene - The A-Frame scene
   */
  handleSceneLoaded(scene) {
    console.log('360° viewer scene loaded');
    
    // Add camera with mouse/touch controls
    const cameraEntity = document.createElement('a-entity');
    cameraEntity.setAttribute('camera', '');
    cameraEntity.setAttribute('position', '0 1.6 0');
    cameraEntity.setAttribute('look-controls', 'reverseMouseDrag: false');
    
    // Add cursor for interaction with hotspots
    const cursor = document.createElement('a-entity');
    cursor.setAttribute('cursor', 'rayOrigin: mouse; fuse: false');
    cursor.setAttribute('raycaster', 'objects: .hotspot');
    cursor.setAttribute('position', '0 0 -1');
    cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03');
    cursor.setAttribute('material', 'color: white; shader: flat');
    cameraEntity.appendChild(cursor);
    
    scene.appendChild(cameraEntity);
  }

  /**
   * Add navigation controls to the container
   * @param {HTMLElement} container - The container element
   */
  addNavigationControls(container) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'viewer-360-controls';
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = '20px';
    controlsContainer.style.left = '50%';
    controlsContainer.style.transform = 'translateX(-50%)';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.gap = '10px';
    controlsContainer.style.zIndex = '100';

    // Create zoom in button
    const zoomInBtn = this.createControlButton('+', 'Zoom in', () => {
      this.zoom(0.9); // Zoom in by reducing FOV
    });

    // Create zoom out button
    const zoomOutBtn = this.createControlButton('-', 'Zoom out', () => {
      this.zoom(1.1); // Zoom out by increasing FOV
    });

    // Create reset button
    const resetBtn = this.createControlButton('⟲', 'Reset view', () => {
      this.resetView();
    });

    controlsContainer.appendChild(zoomInBtn);
    controlsContainer.appendChild(resetBtn);
    controlsContainer.appendChild(zoomOutBtn);

    container.appendChild(controlsContainer);
  }

  /**
   * Create a control button
   * @param {string} text - The button text
   * @param {string} ariaLabel - The aria-label for accessibility
   * @param {Function} onClick - The click handler
   * @returns {HTMLElement} The created button
   */
  createControlButton(text, ariaLabel, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('aria-label', ariaLabel);
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.color = 'white';
    button.style.border = '2px solid white';
    button.style.cursor = 'pointer';
    button.style.fontSize = '18px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.transition = 'background-color 0.3s ease';

    // Hover effect
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    });

    // Click event
    button.addEventListener('click', onClick);

    return button;
  }

  /**
   * Load 360° content (photo or video)
   * @param {Object} content - The content object with type, src, and optional properties
   */
  loadContent(content) {
    if (!this.sceneContainer) {
      console.warn('Scene container not initialized');
      return;
    }

    // Clear previous content
    this.clearContent();

    // Register the asset
    const assetId = `content-${Date.now()}`;
    this.assetManager.registerAsset(
      assetId,
      content.src,
      content.type === 'video' ? 'video' : 'image',
      content
    );

    // Create A-Frame asset
    const aframeAssets = this.assetManager.createAFrameAssets([assetId]);
    
    // Add asset to scene
    this.sceneContainer.assets = aframeAssets;

    // Create sky entity based on content type
    let skyEntity;
    if (content.type === 'video') {
      skyEntity = `
        <a-videosphere src="#${assetId}" rotation="0 -90 0"></a-videosphere>
        <a-entity position="0 0 0" video-controls="src: #${assetId}"></a-entity>
      `;
    } else {
      skyEntity = `<a-sky src="#${assetId}" rotation="0 -90 0"></a-sky>`;
    }

    // Add the sky entity to the scene
    this.sceneContainer.addContent(skyEntity);

    // Add hotspots if any
    if (content.hotspots && Array.isArray(content.hotspots)) {
      this.addHotspots(content.hotspots);
    }

    // Store current content
    this.currentContent = content;
    
    // Trigger content change callback
    this.onContentChange(content);
  }

  /**
   * Add information hotspots to the scene
   * @param {Array} hotspots - Array of hotspot objects with position, title, and content
   */
  addHotspots(hotspots) {
    this.hotspots = hotspots;
    
    hotspots.forEach((hotspot, index) => {
      const hotspotId = `hotspot-${index}`;
      const position = hotspot.position || { x: 0, y: 1.6, z: -3 };
      
      // Create hotspot entity
      const hotspotEntity = `
        <a-entity
          id="${hotspotId}"
          class="hotspot"
          position="${position.x} ${position.y} ${position.z}"
          look-at="[camera]"
          scale="0.5 0.5 0.5"
        >
          <a-sphere
            color="#4a6cf7"
            radius="0.2"
            animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true"
          ></a-sphere>
          <a-text
            value="${hotspot.title || 'Information'}"
            align="center"
            color="white"
            position="0 0.3 0"
            scale="2 2 2"
            width="2"
          ></a-text>
        </a-entity>
      `;
      
      // Add hotspot to scene
      this.sceneContainer.addContent(hotspotEntity);
      
      // Add click event listener
      setTimeout(() => {
        const hotspotEl = document.getElementById(hotspotId);
        if (hotspotEl) {
          hotspotEl.addEventListener('click', () => {
            this.handleHotspotClick(hotspot, index);
          });
        }
      }, 100);
    });
  }

  /**
   * Handle hotspot click
   * @param {Object} hotspot - The hotspot data
   * @param {number} index - The hotspot index
   */
  handleHotspotClick(hotspot, index) {
    console.log(`Hotspot clicked: ${hotspot.title || 'Information'}`);
    
    // Show information panel
    this.showInfoPanel(hotspot);
    
    // Trigger callback
    this.onHotspotClick(hotspot, index);
  }

  /**
   * Show information panel for a hotspot
   * @param {Object} hotspot - The hotspot data
   */
  showInfoPanel(hotspot) {
    // Remove any existing info panel
    const existingPanel = document.querySelector('.viewer-360-info-panel');
    if (existingPanel) {
      existingPanel.parentNode.removeChild(existingPanel);
    }
    
    // Create info panel
    const panel = document.createElement('div');
    panel.className = 'viewer-360-info-panel';
    panel.style.position = 'absolute';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    panel.style.color = 'white';
    panel.style.padding = '20px';
    panel.style.borderRadius = '10px';
    panel.style.maxWidth = '80%';
    panel.style.maxHeight = '80%';
    panel.style.overflow = 'auto';
    panel.style.zIndex = '200';
    panel.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = hotspot.title || 'Information';
    title.style.margin = '0 0 10px 0';
    title.style.color = '#4a6cf7';
    panel.appendChild(title);
    
    // Add content
    const content = document.createElement('div');
    content.innerHTML = hotspot.content || '';
    content.style.lineHeight = '1.5';
    panel.appendChild(content);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => {
      panel.parentNode.removeChild(panel);
    });
    panel.appendChild(closeBtn);
    
    // Add to container
    const container = document.getElementById(this.containerId);
    if (container) {
      container.appendChild(panel);
    }
  }

  /**
   * Zoom the camera view
   * @param {number} factor - The zoom factor (< 1 for zoom in, > 1 for zoom out)
   */
  zoom(factor) {
    const camera = document.querySelector(`#${this.containerId}-scene a-entity[camera]`);
    if (camera) {
      let fov = camera.getAttribute('camera').fov || 80;
      fov = Math.max(30, Math.min(100, fov * factor)); // Limit FOV between 30 and 100
      camera.setAttribute('camera', 'fov', fov);
    }
  }

  /**
   * Reset the camera view
   */
  resetView() {
    const camera = document.querySelector(`#${this.containerId}-scene a-entity[camera]`);
    if (camera) {
      camera.setAttribute('camera', 'fov', 80); // Reset FOV
      camera.setAttribute('rotation', '0 0 0'); // Reset rotation
    }
  }

  /**
   * Clear the current content
   */
  clearContent() {
    // Remove sky/videosphere
    const sky = document.querySelector(`#${this.containerId}-scene a-sky`);
    if (sky) sky.parentNode.removeChild(sky);
    
    const videosphere = document.querySelector(`#${this.containerId}-scene a-videosphere`);
    if (videosphere) videosphere.parentNode.removeChild(videosphere);
    
    // Remove hotspots
    const hotspots = document.querySelectorAll(`#${this.containerId}-scene .hotspot`);
    hotspots.forEach(hotspot => {
      hotspot.parentNode.removeChild(hotspot);
    });
    
    // Clear hotspots array
    this.hotspots = [];
  }

  /**
   * Destroy the viewer and clean up resources
   */
  destroy() {
    // Clean up VR toggle
    if (this.vrToggle) {
      this.vrToggle.destroy();
    }
    
    // Clean up scene container
    if (this.sceneContainer) {
      this.sceneContainer.destroy();
    }
    
    // Clean up asset manager
    this.assetManager.clearAssets();
    
    // Remove container
    const container = document.getElementById(this.containerId);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

// Export the Viewer360 class
export default Viewer360;