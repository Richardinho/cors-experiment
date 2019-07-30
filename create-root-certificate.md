# Creating a Root Certificate


###  Step 1: Create a private key
```
  openssl genrsa -des3 -out richardhunter.key 2048
```

#### Explanation of command

* `genrsa`  generates an RSA private key
* `-des3` encrypts the private key with the Triple Data Encryption Algorithm. Will prompt for a password (if `-passout`) argument not supplied  
* `-out richardhunter.key` writes output to the specified file
* `2048`  size of private key in bits. 2048 is actually the default so shouldn't be necessary here?

### Step 2: Create  the root certificate
```
  openssl req -x509 -new -nodes -key richardhunter.key -sha256 -days 1825 -out richardhunter.pem
```

#### Explanation of command

* `req` for creating certificate requests but can also be used to create self signed certificates for use as root CAs
* `-x509` outputs a self signed certificate instead of a certificate request
* `-new` generates a new certificate request (possibly not necessary here?)
* `-nodes` If a private key is created, it will not be encrypted (not sure this is necessary either since we've already created a private key and it IS encryped!)
* `-key richardhunter.key` uses specified private key
* `-sha256` message digest to sign the request with
* `-days 1825` number of days the certificate will be valid for
* `-out richardhunter.pem` writes output to the specified file


### Sources
* [How to Create Your Own SSL Certificate Authority for Local HTTPS Development - deliciousbrains.com](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/)
* [openssl documention](https://www.openssl.org/docs/man1.1.1/)
