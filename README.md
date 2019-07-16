# Using CORS with authentication

In `/etc/hosts`, point domains to localhost

```
  127.0.0.1 foo.com 
  127.0.0.1 bar.com 
```
In Apache virtual hosts config file, create VirtualHost directives to point Apache at foo and bar folders when browser navigates to these domains.

```
  <VirtualHost *:80>
      ServerName foo.com
      DocumentRoot "/Users/richardhunter/development/cors-experiment/foo"
      ErrorLog "/private/var/log/apache2/foo.com-error_log"
      CustomLog "/private/var/log/apache2/foo.com-access_log" common
      <Directory "/Users/richardhunter/development/cors-experiment/foo">
          Options Indexes FollowSymLinks
          AllowOverride All
          Order allow,deny
          Allow from all
      </Directory>
  </VirtualHost>
 
  <VirtualHost *:80>
      ServerName bar.com
       DocumentRoot "/Users/richardhunter/development/cors-experiment/bar"
       ErrorLog "/private/var/log/apache2/bar.com-error_log"
       CustomLog "/private/var/log/apache2/bar.com-access_log" common
       <Directory "/Users/richardhunter/development/cors-experiment/bar">
           Options Indexes FollowSymLinks
           AllowOverride All
           Order allow,deny
           Allow from all
       </Directory>
  </VirtualHost>

```

Make XHR request from `foo.com` to `bar.com`.

This fails with the following error shown in the browser.

> Access to fetch at 'http://bar.com/test.json' from origin 'http://foo.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

Adding this into the `.htaccess` file in the `/bar` directory causes the request to be successful.

```
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
```

## Preflighted Request
This is what is sometimes called a 'simple request' since it consists of a single request and a response. A non-simple request if a 'preflighted' request and requires a preliminary request to be made to the server to query whether the main request is allowed.

If we add a custom header, `X-BLAH-BLAH` to the request, we will find it will fail as it becomes a Preflighted request and the server needs to return extra headers.

> Access to fetch at 'http://bar.com/test.json' from origin 'http://foo.com' has been blocked by CORS policy: Request header field x-blah-blah is not allowed by Access-Control-Allow-Headers in preflight response.

So lets fix this.

```
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Headers "x-blah-blah"
  </IfModule>
```
Adding the header `Access-Control-Allow-Headers` with the value of our custom header allows the preflighted request to succeed.

## Authentication

Create password file:

```
  htpasswd -c ~/development/cors-passwords richard

  ### Password
  username: Richard
  password: password
  ####

```
Add the following to `.htaccess` file
```
AuthType Basic
AuthName "Restricted Files"
AuthBasicProvider file
AuthUserFile "/Users/richardhunter/development/cors-passwords"
Require user richard
```

When navigating to `bar.com/private` you will find a pop up that challenges you to enter a username and a password. On subsequent visits to the page, no challenge is made.
If you create a new page within the same folder, you will find you can also navigate to it without a challenge.

```
  GET /private/page-1.html HTTP/1.1
  Host: bar.com
  Connection: keep-alive
  Pragma: no-cache
  Cache-Control: no-cache
  Authorization: Basic cmljaGFyZDpwYXNzd29yZA==
  Upgrade-Insecure-Requests: 1
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
  Accept-Encoding: gzip, deflate
  Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,la;q=0.7
```
