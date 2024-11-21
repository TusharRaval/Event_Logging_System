// utils/hash.js
const crypto = require('crypto');

function generateHash(eventData) {
  try {
    // Ensure eventData is always stringified
    const stringifiedData = JSON.stringify(eventData);

    // Create hash of the stringified event data
    const hash = crypto.createHash('sha256');
    hash.update(stringifiedData);  // Pass the stringified data
    return hash.digest('hex');  // Return the hash in hexadecimal form
  } catch (error) {
    console.error("Error generating hash:", error);
    throw new Error("Error generating hash for event data.");
  }
}

module.exports = { generateHash };
