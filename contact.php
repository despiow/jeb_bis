<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

$destinataire = 'philippe.marvie@gmail.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email   = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars($_POST['subject'] ?? 'Message depuis le site JEB');
    $message = htmlspecialchars($_POST['message'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        header('Location: index.html?contact=error');
        exit;
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'jeuxenboisdantan13@gmail.com';
        $mail->Password   = 'vrxgqvprrmuvzjxa';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom('jeuxenboisdantan13@gmail.com', 'Contact');
        $mail->addAddress($destinataire);
        $mail->addReplyTo($email, $email);

        $mail->Subject = 'Prise de contact depuis jeuxdantan.fr - ' . $subject;
        $mail->Body    = "Expéditeur : " . $email . "\n"
                       . "Objet : " . $subject . "\n\n"
                       . "--- Message ---\n\n" . $message;

        $mail->send();
        header('Location: index.html?contact=success');
    } catch (Exception $e) {
        header('Location: index.html?contact=error');
    }
    exit;
}
?>
