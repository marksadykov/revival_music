<?php
$name =$_POST['name'];
$email =$_POST['email'];
$message =$_POST['message'];

$fromMail = 'admin@revival.msk.ru';
$fromName = 'revival.msk.ru Форма';

$emailTo = 'sadykov.mark@gmail.com';
$subject = 'Форма обратной связи с сайта revival.msk.ru';
$subject = '=?utf-8?b?'. base64_encode($subject) .'?=';
$headers = "Content-type: text/plain; charset=\"utf-8\"\r\n";
$headers .= "From: ". $fromName ." <". $fromMail ."> \r\n";

$body = "Получено письмо с сайта revival.msk.ru \nИмя: $name \nE-mail: $email\nСообщение: $message";

mail($emailTo, $subject, $body, $headers, '-f'. $fromMail );
header('Location: https://sportecip.000webhostapp.com/index.html#ret');
exit;

?>