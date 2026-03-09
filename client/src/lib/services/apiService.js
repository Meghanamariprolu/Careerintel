import axios from 'axios';
import CacheService from './cacheService';
import SanitizeService from '../security/sanitize';

/**
 * Secure API Service
 * A centralized wrapper around Axios that enforces security rules:
 * - Sanitizes all incoming API responses to prevent XSS.
 * - Caches responses to reduce network load.
 * - Handles fallback scenarios securely.
 */
class ApiService {
    // Basic axios instance
    static client = axios.create({
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            // Add custom security headers if dealing with a strict first-party API
            // 'X-Requested-With': 'XMLHttpRequest' 
        }
    });

    /**
     * Performs a secure GET request with optional caching.
     * @param {string} url - The API endpoint.
     * @param {object} config - Axios config options.
     * @param {boolean} useCache - Whether to attempt reading/writing to the cache.
     * @param {number} ttlMinutes - Cache expiration time.
     * @returns {Promise<any>} The sanitized response data.
     */
    static async get(url, config = {}, useCache = true, ttlMinutes = CacheService.DEFAULT_TTL) {
        const cacheKey = useCache ? CacheService.generateKey(url, config.params) : null;

        // Try Cache First
        if (useCache && cacheKey) {
            const cachedData = CacheService.get(cacheKey);
            if (cachedData) {
                console.info(`[ApiService] Cache Hit: ${url}`);
                // Data from cache is inherently sanitized before storage, 
                // but if paranoid, could re-sanitize here.
                return cachedData;
            }
        }

        try {
            console.info(`[ApiService] Network Request: ${url}`);
            const response = await this.client.get(url, config);

            // SECURITY: Deep clean all API responses before they hit our state/UI
            const sanitizedData = SanitizeService.deepClean(response.data);

            // Update Cache
            if (useCache && cacheKey) {
                CacheService.set(cacheKey, sanitizedData, ttlMinutes);
            }

            return sanitizedData;
        } catch (error) {
            console.error(`[ApiService] GET request failed: ${url}`, error);
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Performs a secure POST request. Typically not cached.
     * @param {string} url 
     * @param {any} data 
     * @param {object} config 
     * @returns {Promise<any>}
     */
    static async post(url, data, config = {}) {
        try {
            // Pre-sanitize data before sending (optional, depends on API requirements)
            // const safeData = SanitizeService.deepClean(data);

            const response = await this.client.post(url, data, config);
            return SanitizeService.deepClean(response.data);
        } catch (error) {
            console.error(`[ApiService] POST request failed: ${url}`, error);
            this.handleError(error);
            throw error;
        }
    }

    // Similarly implement put, delete, etc...

    /**
     * Standard error handler to normalize API failures.
     * @param {Error} error 
     */
    static handleError(error) {
        // Implement global error logging or toast notifications here
        // Ensure error messages don't leak sensitive technical details to the UI
        if (error.response) {
            console.error('API Error Status:', error.response.status);
            // Don't log full response.data to console in prod if it contains PII
        } else if (error.request) {
            console.error('API Network Error: No response received');
        } else {
            console.error('API Client Error:', error.message);
        }
    }
}

export default ApiService;
