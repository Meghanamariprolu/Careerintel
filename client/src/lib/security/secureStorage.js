import EncryptionService from './encryption';

/**
 * Secure Storage Service
 * A wrapper for LocalStorage providing encryption, integrity checks, and TTL (Time-To-Live).
 */
class SecureStorage {
    // Dynamic or obfuscated key generation (Basic protection)
    static #SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || EncryptionService.getDeviceFingerprint();

    /**
     * Saves data to LocalStorage with encryption and TTL.
     * @param {string} key - The storage key.
     * @param {any} value - The value to store.
     * @param {number} ttlInMinutes - Optional time-to-live in minutes.
     */
    static save(key, value, ttlInMinutes = null) {
        if (typeof window === 'undefined') return;

        try {
            const dataToStore = {
                payload: value,
                timestamp: Date.now(),
                expiresAt: ttlInMinutes ? Date.now() + ttlInMinutes * 60 * 1000 : null,
                version: '1.0'
            };

            const jsonString = JSON.stringify(dataToStore);
            const encrypted = EncryptionService.encrypt(jsonString, this.#SECRET_KEY);

            if (encrypted) {
                localStorage.setItem(key, encrypted);
                return true;
            }
        } catch (error) {
            console.error(`SecureStorage: Failed to save ${key}`, error);
        }
        return false;
    }

    /**
     * Reads and decrypts data from LocalStorage, checking for expiration and tampering.
     * @param {string} key - The storage key.
     * @returns {any|null} The decrypted data, or null if expired/tampered/not found.
     */
    static read(key) {
        if (typeof window === 'undefined') return null;

        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;

        try {
            const decrypted = EncryptionService.decrypt(encrypted, this.#SECRET_KEY);

            if (!decrypted) {
                // Tamper Detection Triggered
                console.warn(`SecureStorage: Tamper detection failed for ${key}. Clearing corrupted data.`);
                this.remove(key);
                return null;
            }

            const data = JSON.parse(decrypted);

            // Check for expiration
            if (data.expiresAt && Date.now() > data.expiresAt) {
                console.info(`SecureStorage: Data for ${key} has expired. Performing cleanup.`);
                this.remove(key);
                return null;
            }

            return data.payload;
        } catch (error) {
            console.error(`SecureStorage: Failed to read ${key}`, error);
            this.remove(key); // Cleanup corrupted state
        }
        return null;
    }

    /**
     * Removes an item from LocalStorage.
     * @param {string} key - The storage key.
     */
    static remove(key) {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }

    /**
     * Clears all stored data (Optional: targeting a namespace if needed).
     */
    static clearAll() {
        if (typeof window === 'undefined') return;
        localStorage.clear();
    }

    /**
     * Efficiently updates part of a stored object.
     * @param {string} key - The storage key.
     * @param {object} updates - The partial updates to merge.
     */
    static update(key, updates) {
        const currentData = this.read(key);
        if (currentData && typeof currentData === 'object') {
            const newData = { ...currentData, ...updates };
            return this.save(key, newData);
        }
        return false;
    }
}

export default SecureStorage;
