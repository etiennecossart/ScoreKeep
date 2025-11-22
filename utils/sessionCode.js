/**
 * Generates a short, human-friendly session code
 * Uses Base32-like encoding (0-9, A-Z excluding I, O, Q, S to avoid confusion)
 * Returns a 6-character code
 */
function generateSessionCode() {
  const chars = '0123456789ABCDEFGHJKLMNPRTUVWXYZ'; // Removed I, O, Q, S
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

module.exports = { generateSessionCode };

