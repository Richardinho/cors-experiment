# Using CORS with authentication

As a front-end developer, I've long been familiar with making Ajax calls using first the XMLHttpRequest object and then later the Fetch API.
Whenever reading the documentation for these in MDN (and other places) I've always been slightly perplexed by the meaning of *credentials* which live on the XHR object as `withCredentials` and on the Request object as `credentials`. Although I have used Cors from time to time, I never had cause to use these properties and, in truth, it's a little unclear what exactly they are for. The documentation isn't that helpful. For example, in the MDN documentation for credentials: 

> The credentials read-only property of the Request interface indicates whether the user agent should send cookies from the other domain in the case of cross-origin requests.

If all it does is send cookies along, why do we use the term **with-credentials**? Why not **with-cookies**? In fact, the same page somewhat qualifies what it means by credentials (I say 'somewhat'): 

> cookies, basic http auth, etc.

Hmm, not so good!

I looked in vain for a really good explanation as to what exactly credentials were in the context of Ajax requests and CORS, so I decided to investigate myself.



At this point I should say that it wasn't the case that I was completely baffled and had no idea whatsoever what credentials were for. It's fairly obvious what the general concept of them probably is, but probably isn't good enough in computer science. I wanted absolute certainity! I can't promise in this article that I have achieved this, and there are some areas where I still am not sure about things (I will point these out), but I hope I have made some progress to elucidating the situation.

# Setting up Apache server

## Environment
I'm running on a Mac and will be using Apache server 2.4, latest Chrome and latest Firefox


I started by creating a new domain to run on my local machine.
In `/etc/hosts`, I mapped this domain to my local loopback address. Now, when I type `foo.com` into my address bar, my computer will go to local host rather than out into the internet for this page.

```
  127.0.0.1 foo.com 
```
For this to work, of course, something has to be running at local host. I use Apache as a server and I have it configured to used virtual name based hosts.
This is the configuration that makes Apache go to the `/foo` directory to fetch a file when the user visits my new domain.

```
  <VirtualHost *:80>
      ServerName foo.com
      DocumentRoot "/Users/richardhunter/development/cors-experiment/foo"
      ErrorLog "/private/var/log/apache2/foo.com-error_log"
      CustomLog "/private/var/log/apache2/foo.com-access_log" common
  </VirtualHost>

```

Check this works. 

![foo.com page](foo-page.png)

Yup!

To create this password file: 

```
  htpasswd -c ~/development/cors-passwords richard

```
(note to self: password is 'password')


Now when you visit the page `http://foo.com`, you will be first asked to enter your username and password before being allowed to proceed to the page.

On subsequent visits, the browser remembers your credentials and you wont have to re-enter these details.

![alt text](challenge-pop-up.png)








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

![alt text](challenge-pop-up.png)
## How to clear Authorization header?
From the server, there seems to be no way of doing this.



##  Create a new password
Run this command to add another user to the password file. Because we are using an existing file rather than creating a new one, we omit the `-c` flag.
```
  htpasswd ~/development/cors-passwords richy
```
