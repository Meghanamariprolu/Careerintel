import SecureStorage from '../security/secureStorage';
import SanitizeService from '../security/sanitize';

/**
 * Cache Service
 * Handles encrypted API response caching with automatic expiration and sanitization.
 */
class CacheService {
    static CACHE_PREFIX = 'api_cache_';
    static DEFAULT_TTL = 60; // 60 minutes

    /**
     * Generates a unique cache key based on the API endpoint and parameters.
     * @param {string} endpoint - The API endpoint.
     * @param {object} params - The request parameters.
     * @returns {string} The hash-like cache key.
     */
    static generateKey(endpoint, params = {}) {
        const paramStr = JSON.stringify(params);
        // Simple hash-like string for the key
        const hash = btoa(`${endpoint}:${paramStr}`).replace(/=/g, '');
        return `${this.CACHE_PREFIX}${hash}`;
    }

    /**
     * Retrieves data from the cache, ensuring it's valid and sanitized.
     * @param {string} key - The cache key.
     * @returns {any|null} The cached data or null if not found/expired.
     */
    static get(key) {
        return SecureStorage.read(key);
    }

    /**
     * Saves data to the cache with encryption and TTL.
     * @param {string} key - The cache key.
     * @param {any} data - The data to cache.
     * @param {number} ttlMinutes - Expiration time in minutes.
     */
    static set(key, data, ttlMinutes = this.DEFAULT_TTL) {
        // Sanitize data before caching to ensure stored state is clean
        const cleanData = SanitizeService.deepClean(data);
        return SecureStorage.save(key, cleanData, ttlMinutes);
    }

    /**
     * Invalidate a specific cache entry.
     * @param {string} key 
     */
    static invalidate(key) {
        SecureStorage.remove(key);
    }

    /**
     * Clears all API caches.
     */
    static clearAll() {
        if (typeof window === 'undefined') return;

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
}

export default CacheService;
