<?php
class JWT {
    public static function encode($payload, $key, $alg = 'HS256') {
        $header = ['typ' => 'JWT', 'alg' => $alg];
        $segments = [
            self::urlsafeB64Encode(json_encode($header)),
            self::urlsafeB64Encode(json_encode($payload))
        ];
        $signing_input = implode('.', $segments);
        $signature = hash_hmac('sha256', $signing_input, $key, true);
        $segments[] = self::urlsafeB64Encode($signature);
        return implode('.', $segments);
    }

    public static function decode($jwt, $key) {
        $segments = explode('.', $jwt);
        if (count($segments) != 3) throw new Exception('JWT inválido');
        list($headb64, $bodyb64, $cryptob64) = $segments;
        $sig = self::urlsafeB64Decode($cryptob64);
        $valid_sig = hash_hmac('sha256', "$headb64.$bodyb64", $key, true);
        if (!hash_equals($sig, $valid_sig)) throw new Exception('Firma inválida');
        $payload = json_decode(self::urlsafeB64Decode($bodyb64));
        if (isset($payload->exp) && $payload->exp < time()) throw new Exception('Token expirado');
        return $payload;
    }

    private static function urlsafeB64Encode($input) {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }

    private static function urlsafeB64Decode($input) {
        $remainder = strlen($input) % 4;
        if ($remainder) $input .= str_repeat('=', 4 - $remainder);
        return base64_decode(strtr($input, '-_', '+/'));
    }
}
?>
