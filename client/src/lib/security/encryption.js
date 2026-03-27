import CryptoJS from 'crypto-js';

/**
 * Advanced Encryption Standard (AES) Wrapper with HMAC-SHA256 integrity checks.
 */
class EncryptionService {
    /**
     * Encrypts a string using AES-256 and calculates an HMAC digest for tampering detection.
     * @param {string} data - The plain text string to encrypt.
     * @param {string} secretKey - The master secret key.
     * @returns {string} The encrypted payload (HMAC:Ciphertext).
     */
    static encrypt(data, secretKey) {
        if (!data) return null;
        try {
            // Encrypt the data
            const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();

            // Generate HMAC for integrity verification
            const hmac = CryptoJS.HmacSHA256(ciphertext, secretKey).toString();

            // Pack as HMAC:Ciphertext
            return `${hmac}:${ciphertext}`;
        } catch (error) {
            console.error('Encryption failed:', error);
            return null;
        }
    }

    /**
     * Decrypts an encrypted payload after verifying its HMAC integrity.
     * @param {string} encryptedPayload - The payload to decrypt (HMAC:Ciphertext).
     * @param {string} secretKey - The master secret key.
     * @returns {string|null} The decrypted plain text, or null if tampering is detected.
     */
    static decrypt(encryptedPayload, secretKey) {
        if (!encryptedPayload || !encryptedPayload.includes(':')) return null;

        try {
            const [receivedHmac, ciphertext] = encryptedPayload.split(':');

            // Verify integrity before decryption
            const calculatedHmac = CryptoJS.HmacSHA256(ciphertext, secretKey).toString();

            if (calculatedHmac !== receivedHmac) {
                console.error('Security Alert: Encrypted data has been tampered with!');
                return null;
            }

            // Decrypt the data
            const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    /**
     * Generates a persistent device-specific fingerprint to help obfuscate the key.
     * This is a basic client-side protection measure.
     */
    static getDeviceFingerprint() {
        if (typeof window === 'undefined') return 'server-side';
        const userAgent = window.navigator.userAgent;
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        return CryptoJS.SHA256(`${userAgent}-${screenResolution}`).toString();
    }
}

export default EncryptionService;
