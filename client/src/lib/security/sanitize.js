import DOMPurify from 'dompurify';

/**
 * Sanitization Service
 * Provides utilities to clean and sanitize data to prevent XSS and DOM injection attacks.
 */
class SanitizeService {
    /**
     * Sanitizes a string of HTML, removing dangerous tags and attributes.
     * @param {string} html - The unsanitized HTML string.
     * @param {object} customConfig - Optional DOMPurify configuration.
     * @returns {string} The sanitized HTML string.
     */
    static html(html, customConfig = {}) {
        if (!html || typeof html !== 'string') return '';

        // Default strict configuration
        const defaultConfig = {
            ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div'],
            ALLOWED_ATTR: ['href', 'target', 'class', 'id'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'style'],
            FORBID_ATTR: ['onerror', 'onclick', 'onload'],
            ...customConfig
        };

        return DOMPurify.sanitize(html, defaultConfig);
    }

    /**
     * Deeply sanitizes an object or array, cleaning all string values.
     * Useful for sanitizing API responses before storage or processing.
     * @param {any} data - The data structure to sanitize.
     * @returns {any} The sanitized data structure.
     */
    static deepClean(data) {
        if (typeof data === 'string') {
            // Remove any potential HTML from plain strings unless specifically allowed
            return DOMPurify.sanitize(data, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        }

        if (Array.isArray(data)) {
            return data.map(item => this.deepClean(item));
        }

        if (data !== null && typeof data === 'object') {
            const cleaned = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    cleaned[key] = this.deepClean(data[key]);
                }
            }
            return cleaned;
        }

        return data;
    }

    /**
     * Escapes critical characters in a string to prevent XSS in plain text contexts.
     * @param {string} str - The string to escape.
     * @returns {string} The escaped string.
     */
    static escape(str) {
        if (!str || typeof str !== 'string') return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;'
        };
        const reg = /[&<>"'/]/ig;
        return str.replace(reg, (match) => map[match]);
    }
}

export default SanitizeService;
