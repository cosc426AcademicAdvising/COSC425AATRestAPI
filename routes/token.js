/*

Paseto Token Public Key Encryption for Authenticated API Access
Uses Paseto tokens and RSA Encryption to distribute public keys that grant API access
Upon successful login, users will be returned there public paseto token
That token is packed in the request header 'Auth-Token' which if valid
will grant them access to the information they are requesting


*/

const paseto = require('paseto');
// V2 paseto sign and verify functions
const { V2: { sign } } = paseto;
const { V2: { verify } } = paseto;
const crypto = require('crypto');


const password = crypto.pseudoRandomBytes(25).toString('base64');
const payload = {'urn:example:claim': 'DB Access'};

// Create a public and private key pair through crpyto
const rsaKeys = crypto.generateKeyPairSync('ed25519', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: password,
    }
});

// Create private key
const privkey = crypto.createPrivateKey({key: rsaKeys.privateKey,
    format: 'pem',
    type: 'pkcs8',
    passphrase: password});

// Create public key
const pubkey = crypto.createPublicKey({key: rsaKeys.publicKey,
    format: 'pem',
    type: 'spki'});


module.exports = {
    // Generates a public and private keypair tokens
    genToken: async () => {
        const token = await sign(payload, privkey);
        return token;
    },
    // Verifies a given public key token and will grant access if valid
    // WIll specify Invalid token if faulty one given
    // Will respond with access denied if no token presented
    verToken: async (req, res, next) => {
        const token = req.header('auth-token');
        if(!token) return res.status(401).send('Access Denied');
        try{
            const verified = await verify(String(token), pubkey);
            next();
        } catch (err){
            res.status(400).send('Invalid Token');
        }
    }
}