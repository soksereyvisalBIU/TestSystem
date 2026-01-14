<!DOCTYPE html>
<html>
<head>
    <title>Authenticating...</title>
</head>
<body>
    <script>
        // Send status back to the main React window
        window.opener.postMessage({ 
            source: 'google-auth', 
            status: "{{ $status }}" 
        }, window.location.origin);
        
        // Close this popup
        window.close();
    </script>
</body>
</html>