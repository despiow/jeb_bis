<?php
$destinataire = 'philippe.marvie@gmail.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars($_POST['subject'] ?? 'Message depuis le site JEB');
    $message = htmlspecialchars($_POST['message'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        header('Location: index.html?contact=error');
        exit;
    }

    $headers = [
        'From: ' . $email,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];

    $corps = "Message reçu depuis le formulaire de contact JEB\n\n";
    $corps .= "Expéditeur : " . $email . "\n";
    $corps .= "Objet : " . $subject . "\n\n";
    $corps .= "--- Message ---\n\n" . $message;

    $succes = mail($destinataire, '[JEB] ' . $subject, $corps, implode("\r\n", $headers));

    if ($succes) {
        header('Location: index.html?contact=success');
    } else {
        header('Location: index.html?contact=error');
    }
    exit;
}
?>
