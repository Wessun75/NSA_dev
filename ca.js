const _ = require('lodash');
const forge = require('node-forge');
const fs = require('fs-extra');

forge.options.usePureJavaScript = true;
const pki = forge.pki;

const subjectAttrs = require('./subjectAttributes');
const utils = require('./utils');
const normalizeName = utils.normalizeName;

function buildCACert(keys, options, caCert = null) {
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = utils.getSerial();

    const attrs = subjectAttrs(options);

    // Set the default expiration, then override with valid-from and/or valid-to
    const expired = _.get(options, 'expired', false);
    utils.setExpirationDate(cert, expired);

    if (options.validFrom) {
        // Parse the validFrom from ISO 8601 format
        cert.validity.notBefore = new Date(options.validFrom);
    }

    if (options.validTo) {
        // Parse the validTo from ISO 8601 format
        cert.validity.notAfter = new Date(options.validTo);
    }
    const caSubject = _.get(caCert, "subject.attributes", null);
    cert.setSubject(attrs);
    cert.setIssuer(caSubject ? caSubject : attrs);
    const extensions = [
        {
            name: 'basicConstraints',
            cA: true,
            critical: true,
        },
        {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            critical: true,
            cRLSign: true,
        },
        {
            name: 'subjectKeyIdentifier',
        },
    ];

    if(caCert){
        extensions.push({
            name: 'authorityKeyIdentifier',
            keyIdentifier: caCert.generateSubjectKeyIdentifier().getBytes(),
        });
        extensions.push(
        {
            name: 'extKeyUsage',
            serverAuth: true,
            critical: true,
        });
    }

    cert.setExtensions(extensions);

    return cert;
}

