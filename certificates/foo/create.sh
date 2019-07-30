rm *.crt *.key
openssl req -config foo.conf -new -x509 -days 365 -out foo.crt
