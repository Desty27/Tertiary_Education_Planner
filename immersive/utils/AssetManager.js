/**
 * AssetManager.js
 * Utility for managing 3D assets and resources for immersive learning experiences
 */

class AssetManager {
  constructor() {
    this.assets = new Map();
    this.loadingPromises = new Map();
    this.baseUrl = '';
  }

  /**
   * Set the base URL for assets
   * @param {string} url - The base URL
   */
  setBaseUrl(url) {
    this.baseUrl = url.endsWith('/') ? url : `${url}/`;
  }

  /**
   * Get the full URL for an asset
   * @param {string} path - The asset path
   * @returns {string} The full URL
   */
  getFullUrl(path) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${this.baseUrl}${path}`;
  }

  /**
   * Register an asset
   * @param {string} id - The asset ID
   * @param {string} path - The asset path
   * @param {string} type - The asset type (model, image, audio, video)
   * @param {Object} metadata - Additional metadata for the asset
   * @returns {Object} The registered asset object
   */
  registerAsset(id, path, type, metadata = {}) {
    const asset = {
      id,
      path,
      type,
      src: this.getFullUrl(path),
      loaded: false,
      metadata
    };
    
    this.assets.set(id, asset);
    return asset;
  }

  /**
   * Get an asset by ID
   * @param {string} id - The asset ID
   * @returns {Object|null} The asset object or null if not found
   */
  getAsset(id) {
    return this.assets.get(id) || null;
  }

  /**
   * Check if an asset exists
   * @param {string} id - The asset ID
   * @returns {boolean} Whether the asset exists
   */
  hasAsset(id) {
    return this.assets.has(id);
  }

  /**
   * Preload an asset
   * @param {string} id - The asset ID
   * @returns {Promise} A promise that resolves when the asset is loaded
   */
  preloadAsset(id) {
    const asset = this.getAsset(id);
    if (!asset) {
      return Promise.reject(new Error(`Asset not found: ${id}`));
    }

    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id);
    }

    let loadPromise;
    switch (asset.type) {
      case 'image':
        loadPromise = this.preloadImage(asset);
        break;
      case 'audio':
        loadPromise = this.preloadAudio(asset);
        break;
      case 'video':
        loadPromise = this.preloadVideo(asset);
        break;
      case 'model':
        loadPromise = this.preloadModel(asset);
        break;
      default:
        loadPromise = Promise.resolve(asset);
    }

    this.loadingPromises.set(id, loadPromise);
    return loadPromise;
  }

  /**
   * Preload an image asset
   * @param {Object} asset - The asset object
   * @returns {Promise} A promise that resolves when the image is loaded
   */
  preloadImage(asset) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        asset.loaded = true;
        asset.element = img;
        resolve(asset);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${asset.src}`));
      };
      img.src = asset.src;
    });
  }

  /**
   * Preload an audio asset
   * @param {Object} asset - The asset object
   * @returns {Promise} A promise that resolves when the audio is loaded
   */
  preloadAudio(asset) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.oncanplaythrough = () => {
        asset.loaded = true;
        asset.element = audio;
        resolve(asset);
      };
      audio.onerror = () => {
        reject(new Error(`Failed to load audio: ${asset.src}`));
      };
      audio.src = asset.src;
      audio.load();
    });
  }

  /**
   * Preload a video asset
   * @param {Object} asset - The asset object
   * @returns {Promise} A promise that resolves when the video is loaded
   */
  preloadVideo(asset) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.oncanplaythrough = () => {
        asset.loaded = true;
        asset.element = video;
        resolve(asset);
      };
      video.onerror = () => {
        reject(new Error(`Failed to load video: ${asset.src}`));
      };
      video.src = asset.src;
      video.load();
    });
  }

  /**
   * Preload a 3D model asset
   * @param {Object} asset - The asset object
   * @returns {Promise} A promise that resolves when the model is loaded
   */
  preloadModel(asset) {
    // For models, we'll rely on A-Frame's asset management system
    // This is just a placeholder to mark the asset as "loading"
    return Promise.resolve().then(() => {
      asset.loaded = true;
      return asset;
    });
  }

  /**
   * Preload multiple assets
   * @param {Array<string>} ids - Array of asset IDs to preload
   * @param {Function} progressCallback - Callback for loading progress
   * @returns {Promise} A promise that resolves when all assets are loaded
   */
  preloadAssets(ids, progressCallback = null) {
    const total = ids.length;
    let loaded = 0;

    const promises = ids.map(id => {
      return this.preloadAsset(id).then(asset => {
        loaded++;
        if (progressCallback) {
          progressCallback(loaded / total, asset);
        }
        return asset;
      });
    });

    return Promise.all(promises);
  }

  /**
   * Create A-Frame asset elements for registered assets
   * @param {Array<string>} ids - Array of asset IDs to include (or all if not specified)
   * @returns {Array<Object>} Array of asset objects formatted for A-Frame
   */
  createAFrameAssets(ids = null) {
    const assetIds = ids || Array.from(this.assets.keys());
    return assetIds.map(id => {
      const asset = this.getAsset(id);
      if (!asset) return null;

      let type;
      switch (asset.type) {
        case 'image':
          type = 'img';
          break;
        case 'model':
          type = 'a-asset-item';
          break;
        default:
          type = asset.type;
      }

      return {
        id: asset.id,
        src: asset.src,
        type
      };
    }).filter(Boolean);
  }

  /**
   * Unload an asset and free resources
   * @param {string} id - The asset ID
   */
  unloadAsset(id) {
    const asset = this.getAsset(id);
    if (!asset) return;

    if (asset.element) {
      if (asset.type === 'video' || asset.type === 'audio') {
        asset.element.pause();
        asset.element.src = '';
        asset.element.load();
      }
      delete asset.element;
    }

    asset.loaded = false;
    this.loadingPromises.delete(id);
  }

  /**
   * Clear all assets and free resources
   */
  clearAssets() {
    for (const id of this.assets.keys()) {
      this.unloadAsset(id);
    }
    this.assets.clear();
    this.loadingPromises.clear();
  }
}

// Export the AssetManager class
export default AssetManager;