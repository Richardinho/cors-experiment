* Using CORS with authentication

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

Make XHR request from foo.com to bar.com.

This fails with the following error shown in the browser.

> Access to fetch at 'http://bar.com/test.json' from origin 'http://foo.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

Adding this into the `.htaccess` file in the bar directory causes the request to be successful.

```
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
```
