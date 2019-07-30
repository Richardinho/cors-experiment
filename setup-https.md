# Setting up HTTPS

In order to be as realistic as possible, I want to have https enabled on all my sites.
Since I don't want to have to buy a real certificate, I will self sign my certificates.
I am going to use the OpenSSL tool for creating certificates. This is the industry standard tool for creating and managing certificates although it isn't the most user friendly piece of software around and the documentation leaves a lot to be desired.


There are 3 basic steps to create a certificate. First, we have to create a private key, then we create certificate request, and finally we create the certificate itself.
In practise these can be combined in a single command:

``
  openssl req -config foo.conf -new -x509 -days 365 -out foo.crt
```


Here is our configuration file `foo.conf`:
```
[ req ]
default_bits = 2048
default_keyfile = foo.key
default_md = sha256
distinguished_name = subject
x509_extensions = x509_ext
encrypt_key = no
prompt = no

[ subject ]
countryName = GB 
stateOrProvinceName = England
localityName = London
organizationName = foo
commonName = foo.com
emailAddress = rich@foo.com 

[ x509_ext ]
subjectAltName = @alternate_names

[ alternate_names ]
DNS.1 = foo.com
```

We can view the contents of our new certificate with the command:

```
openssl x509 -in foo.crt -text
```
Now we install the certificate on our server

```
<VirtualHost *:443>
   ServerName foo.com
   DocumentRoot "/Users/richardhunter/development/cors-experiment/foo"
   ErrorLog "/private/var/log/apache2/foo-error-log"
   CustomLog "/private/var/log/apache2/foo-access-log" common
   SSLEngine on
   SSLCertificateFile "/Users/richardhunter/development/cors-experiment/certificates/foo/foo.crt"
   SSLCertificateKeyFile "/Users/richardhunter/development/cors-experiment/certificates/foo/foo.key"
</VirtualHost>
```
And restart Apache
`sudo apachectl restart`

Now when we navigate to the page in Chrome we get the following message:

![chrome https error message](chrome-https-error-message.png)
Firefox and Safari show similar messages

What we need to do is tell Macs Keychain that this certificate is allowed:

```
sudo security \
    add-trusted-cert \
    -d \
    -k /Library/Keychains/System.keychain \
    /Users/richardhunter/development/cors-experiment/certificates/foo/foo.crt
```


And now our page works!
![working foo page](working-foo-page.png)
 
