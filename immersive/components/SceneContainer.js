/**
 * SceneContainer.js
 * A reusable A-Frame scene container component for immersive learning experiences
 */

class SceneContainer {
  constructor(options = {}) {
    this.containerId = options.containerId || 'aframe-scene-container';
    this.width = options.width || '100%';
    this.height = options.height || '500px';
    this.embedded = options.embedded !== undefined ? options.embedded : true;
    this.vr = options.vr !== undefined ? options.vr : true;
    this.ar = options.ar !== undefined ? options.ar : false;
    this.assets = options.assets || [];
    this.sceneContent = options.sceneContent || '';
    this.onSceneLoaded = options.onSceneLoaded || (() => {});
  }

  /**
   * Initialize the A-Frame scene
   * @returns {HTMLElement} The created scene container element
   */
  initialize() {
    // Create container if it doesn't exist
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.style.width = this.width;
      container.style.height = this.height;
      document.body.appendChild(container);
    }

    // Create scene HTML
    const sceneHTML = this.generateSceneHTML();
    container.innerHTML = sceneHTML;

    // Set up event listeners
    const scene = container.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      console.log('A-Frame scene loaded');
      this.onSceneLoaded(scene);
    });

    return container;
  }

  /**
   * Generate the HTML for the A-Frame scene
   * @returns {string} The HTML string for the scene
   */
  generateSceneHTML() {
    // Scene attributes
    const sceneAttrs = [];
    if (this.embedded) sceneAttrs.push('embedded');
    if (this.vr) sceneAttrs.push('vr-mode-ui="enabled: true"');
    if (this.ar) sceneAttrs.push('ar-mode-ui="enabled: true"');
    
    // Generate assets HTML
    const assetsHTML = this.assets.length > 0 
      ? `<a-assets>${this.assets.map(asset => this.generateAssetHTML(asset)).join('\n')}</a-assets>` 
      : '';

    // Generate the complete scene HTML
    return `
      <a-scene ${sceneAttrs.join(' ')}>
        ${assetsHTML}
        ${this.sceneContent}
      </a-scene>
    `;
  }

  /**
   * Generate HTML for an asset
   * @param {Object} asset - The asset object with type, id, and src properties
   * @returns {string} The HTML string for the asset
   */
  generateAssetHTML(asset) {
    switch (asset.type) {
      case 'img':
        return `<img id="${asset.id}" src="${asset.src}" crossorigin="anonymous">`;
      case 'video':
        return `<video id="${asset.id}" src="${asset.src}" preload="auto" crossorigin="anonymous"></video>`;
      case 'audio':
        return `<audio id="${asset.id}" src="${asset.src}" preload="auto" crossorigin="anonymous"></audio>`;
      case 'a-asset-item':
        return `<a-asset-item id="${asset.id}" src="${asset.src}"></a-asset-item>`;
      default:
        return '';
    }
  }

  /**
   * Add an asset to the scene
   * @param {Object} asset - The asset to add
   */
  addAsset(asset) {
    this.assets.push(asset);
    const assetsEl = document.querySelector(`#${this.containerId} a-assets`);
    if (assetsEl) {
      const assetEl = document.createElement(asset.type === 'a-asset-item' ? 'a-asset-item' : asset.type);
      assetEl.id = asset.id;
      assetEl.setAttribute('src', asset.src);
      assetEl.setAttribute('crossorigin', 'anonymous');
      assetsEl.appendChild(assetEl);
    }
  }

  /**
   * Add content to the scene
   * @param {string} content - The A-Frame entity HTML to add
   */
  addContent(content) {
    this.sceneContent += content;
    const scene = document.querySelector(`#${this.containerId} a-scene`);
    if (scene) {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = content;
      while (tempContainer.firstChild) {
        scene.appendChild(tempContainer.firstChild);
      }
    }
  }

  /**
   * Toggle VR mode
   * @param {boolean} enabled - Whether VR mode should be enabled
   */
  toggleVR(enabled) {
    const scene = document.querySelector(`#${this.containerId} a-scene`);
    if (scene) {
      if (enabled && scene.is('vr-mode')) return;
      if (enabled) {
        scene.enterVR();
      } else if (scene.is('vr-mode')) {
        scene.exitVR();
      }
    }
  }

  /**
   * Destroy the scene and clean up resources
   */
  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      const scene = container.querySelector('a-scene');
      if (scene) {
        scene.removeEventListener('loaded', this.onSceneLoaded);
      }
      container.innerHTML = '';
    }
  }
}

// Export the SceneContainer class
export default SceneContainer;