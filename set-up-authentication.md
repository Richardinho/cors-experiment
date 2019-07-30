# Setting up authentication with Apache

This is the Apache configuration to provide Basic authentication for the foo folder.

```
  <Directory "/Users/richardhunter/development/cors-experiment/foo">
      AuthType Basic                       
      AuthName "Restricted Files"          
      AuthBasicProvider file               
      AuthUserFile "/Users/richardhunter/development/cors-passwords"
      Require user richard 
  </Directory> 

```

Attempting to access the file `/foo.com/test.json` results in being challenged for a username and password pair on all three browsers. On entering these credentials, the user is granted access in all cases.

