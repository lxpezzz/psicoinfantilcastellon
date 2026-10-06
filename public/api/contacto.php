<?php
/**
 * Backend de procesamiento para el formulario de contacto
 * PsicoInfantil Castellón
 * 
 * Hosting destino: LucusHost (Astro estático + PHP en Apache/cPanel)
 * Método: POST exclusivo
 */

// 1. Configuración de seguridad y entorno
ini_set('display_errors', '0');
error_reporting(0);
mb_internal_encoding('UTF-8');

// 2. Comprobar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Método no permitido.');
}

// 3. Comprobación de Honeypot antispam (campo oculto 'empresa')
// Un honeypot rellenado no debe mostrar una confirmación de envío que no ha ocurrido.
if (!empty($_POST['empresa'])) {
    header("Location: /contacto/?error=1#formulario");
    exit;
}

// 4. Verificación de aceptación de la política de privacidad (obligatoria)
if (!isset($_POST['privacidad']) || $_POST['privacidad'] !== '1') {
    header("Location: /contacto/?error=1#formulario");
    exit;
}

// 5. Rechazar campos enviados como arrays u otros tipos antes de usarlos.
foreach (['nombre', 'telefono', 'email', 'edad', 'mensaje'] as $campo) {
    if (isset($_POST[$campo]) && !is_string($_POST[$campo])) {
        header("Location: /contacto/?error=1#formulario");
        exit;
    }
}

$nombre   = trim($_POST['nombre'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$email    = trim($_POST['email'] ?? '');
$edad     = trim($_POST['edad'] ?? '');
$mensaje  = trim($_POST['mensaje'] ?? '');

// El servicio es opcional. Descartar tipos inesperados y valores largos antes de normalizar.
$servicio_entrada = $_POST['servicio'] ?? '';
$servicio = is_string($servicio_entrada) && strlen($servicio_entrada) <= 150
    ? trim($servicio_entrada)
    : '';

$servicios_permitidos = [
    'Evaluación y diagnóstico psicopedagógico',
    'Mejora del rendimiento escolar',
    'TDAH',
    'Dislexia',
    'Altas capacidades',
    'Asesoramiento a padres',
    'Psicología juvenil',
    'Informes psicopedagógicos',
];

if (!in_array($servicio, $servicios_permitidos, true)) {
    $servicio = '';
}

// 6. Validación de datos en servidor
// Validación de longitudes máximas y campos requeridos
if (
    $nombre === '' || mb_strlen($nombre) > 100 ||
    $telefono === '' || mb_strlen($telefono) > 30 ||
    $email === '' || mb_strlen($email) > 150 ||
    mb_strlen($edad) > 20 ||
    $mensaje === '' || mb_strlen($mensaje) > 2000
) {
    header("Location: /contacto/?error=1#formulario");
    exit;
}

// Validación de formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: /contacto/?error=1#formulario");
    exit;
}

// Evitar inyección en cabeceras y la falsificación de líneas de los campos breves del cuerpo.
if (
    preg_match('/[\r\n\0]/', $email) ||
    preg_match('/[\r\n\0]/', $nombre) ||
    preg_match('/[\r\n\0]/', $telefono) ||
    preg_match('/[\r\n\0]/', $edad)
) {
    header("Location: /contacto/?error=1#formulario");
    exit;
}

// 7. Preparación del mensaje de correo
$destinatario = 'anadiaz.psicoinfantil@gmail.com';
$asunto       = 'Nueva consulta desde PsicoInfantil Castellón';
$edad_texto   = $edad !== '' ? $edad : 'No especificada';
$servicio_texto = $servicio !== '' ? $servicio : 'Consulta general';

$cuerpo  = "Nueva consulta recibida desde la web\n\n";
$cuerpo .= "Servicio: " . $servicio_texto . "\n";
$cuerpo .= "Nombre: " . $nombre . "\n";
$cuerpo .= "Teléfono: " . $telefono . "\n";
$cuerpo .= "Email: " . $email . "\n";
$cuerpo .= "Edad del niño/a: " . $edad_texto . "\n\n";
$cuerpo .= "Mensaje:\n";
$cuerpo .= $mensaje . "\n";

// 8. Configuración de cabeceras de correo (SPF / DKIM compliant)
// Remitente del dominio para no romper políticas DMARC/SPF; respuesta directa al visitante vía Reply-To
$from_name   = 'PsicoInfantil Castellón';
$from_email  = 'info@psicoinfantilcastellon.es';
$from_header = '=?UTF-8?B?' . base64_encode($from_name) . '?= <' . $from_email . '>';
$subject_enc = '=?UTF-8?B?' . base64_encode($asunto) . '?=';

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8; format=flowed',
    'Content-Transfer-Encoding: 8bit',
    'From: ' . $from_header,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];
$headers_str = implode("\r\n", $headers);

// 9. Envío del email
// Implementación base con mail(). Preparada para migrar a PHPMailer + SMTP autenticado al disponer de credenciales de LucusHost.
$enviado = @mail($destinatario, $subject_enc, $cuerpo, $headers_str);

if ($enviado) {
    header("Location: /gracias/");
    exit;
} else {
    header("Location: /contacto/?error=envio#formulario");
    exit;
}
