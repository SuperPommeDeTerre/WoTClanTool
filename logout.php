<?php
session_start();
session_unset();
session_destroy();
setcookie('PHPSESSID', '', time()-1);
header('Location: ./');
