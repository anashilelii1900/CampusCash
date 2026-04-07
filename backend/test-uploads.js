const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
// You need a valid token here to test!
const TOKEN = 'YOUR_TEST_TOKEN'; 

async function testUpload(type) {
    console.log(`Testing ${type} upload...`);
    
    // Create a dummy file
    const filePath = path.join(__dirname, `test-${type}.txt`);
    fs.writeFileSync(filePath, `This is a test ${type} file.`);

    const form = new FormData();
    form.append(type, fs.createReadStream(filePath));

    try {
        const response = await fetch(`${API_URL}/uploads/${type}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                ...form.getHeaders()
            },
            body: form
        });

        const data = await response.json();
        console.log(`Response for ${type}:`, data);
        if (response.ok) {
            console.log(`✅ ${type} upload successful!`);
        } else {
            console.log(`❌ ${type} upload failed:`, data.error);
        }
    } catch (err) {
        console.error(`💥 Error testing ${type}:`, err.message);
    } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}

// Note: This script requires a real JWT token. 
// For now, I'll just check if the directory structure is correct.
console.log('Verifying upload directories...');
const dirs = ['../uploads', '../uploads/messages'];
dirs.forEach(d => {
    const p = path.join(__dirname, d);
    if (fs.existsSync(p)) {
        console.log(`✅ Directory exists: ${d}`);
    } else {
        console.log(`❌ Directory missing: ${d}`);
    }
});
