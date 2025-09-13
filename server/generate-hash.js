const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isValid);
}

generateHash();
