# Creating a Root Certificate


###  Step 1: Create a private key
```
  openssl genrsa -des3 -out myCA.key 2048
```

#### Explanation of command

* `genrsa`  generates an RSA private key
* `-des3` encrypts the private key with the Triple Data Encryption Algorithm. Will prompt for a password (if `-passout`) argument not supplied  
* `-out` key will be output to `myCA.key` file 
* `2048`  size of private key in bits. 2048 is actually the default so shouldn't be necessary here?

### Sources
* [How to Create Your Own SSL Certificate Authority for Local HTTPS Development - deliciousbrains.com](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/)
