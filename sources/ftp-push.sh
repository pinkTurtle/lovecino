#!/bin/bash
ftp -inv 67.222.18.91 <<FINFTP
user usuario clave
binary
cd public_html/wp-content/themes/sbr/
lcd ../website/wp-content/themes/sbr/

put program.css

lcd js
cd js
put program.js

bye
FINFTP
