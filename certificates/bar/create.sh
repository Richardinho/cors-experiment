rm *.crt *.key
openssl req -config bar.conf -new -x509 -days 365 -out bar.crt
