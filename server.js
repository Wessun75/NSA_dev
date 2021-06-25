const _ = require('lodash');
const forge = require('node-forge');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

forge.options.usePureJavaScript = true;
const pki = forge.pki;

const subjectAttrs = require('./subjectAttributes');
const utils = require('./utils');
const normalizeName = utils.normalizeName;

const DNS_TYPE = 2;
const IP_TYPE = 7;

const madcertLhSubjectAltDNSName = process.env.MADCERT_LH_SUBJECT_ALT_DNS_NAME || '';

function getIpAddresses() {
    const localIPs = [];

    // Pull the IP address
    const nic = os.networkInterfaces();
    for (let i in nic) {
        const names = nic[i];
        for (let j = 0; j < names.length; j++) {
            const k = names[j];
            if (k.family === 'IPv4' && k.address !== '127.0.0.1' && !k.internal) {
                localIPs.push(k.address);
            }
        }
    }

    return localIPs;
}

function buildServerCert(keys, caName, caCert, localhost, options) {
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = utils.getSerial();

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

    const attrs = subjectAttrs(options);

    cert.setSubject(attrs);
    cert.setIssuer(caCert.subject.attributes);
    const extensions = [
        {
            name: 'basicConstraints',
            cA: false,
            critical: true,
        },
        {
            name: 'keyUsage',
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
            critical: true,
        },
        {
            name: 'extKeyUsage',
            serverAuth: true,
            clientAuth: true,
            emailProtection: true,
        },
        {
            name: 'subjectKeyIdentifier',
        },
        {
            name: 'authorityKeyIdentifier',
            keyIdentifier: caCert.generateSubjectKeyIdentifier().getBytes(),
        },
    ];

    const altNames = [];

    // Create the subject alternative names if this is creating the localhost certificate
    if (localhost) {
        // If the environment variable MADCERT_LH_SUBJECT_ALT_DNS_NAME is not set use the hostname
        const localHostName = madcertLhSubjectAltDNSName || os.hostname();

        // Add to the extensions object
        altNames.push.apply(altNames, [
            {
                type: DNS_TYPE,
                value: localHostName,
            },
            {
                type: DNS_TYPE,
                value: 'localhost',
            },
            {
                type: IP_TYPE,
                ip: '127.0.0.1',
            },
        ]);

        const localIPs = getIpAddresses().map(ip => {
            return {
                type: IP_TYPE,
                ip,
            };
        });

        altNames.push.apply(altNames, localIPs);
    }

    // Add any subject alternative names provided on the command line
    _.each(_.get(options, 'subjectAltDnsNames', []), name => {
        altNames.push({
            type: DNS_TYPE,
            value: name,
        });
    });

    _.each(_.get(options, 'subjectAltIpNames', []), name => {
        altNames.push({
            type: IP_TYPE,
            ip: name,
        });
    });

    if (!_.isEmpty(altNames)) {
        extensions.push.apply(extensions, [{ name: 'subjectAltName', altNames: altNames }]);
    }

    // Add all extensions
    cert.setExtensions(extensions);

    return cert;
}

