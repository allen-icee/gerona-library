<!DOCTYPE html>
<html>
<head>
    <title>Your Library Card</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Welcome to Gerona Municipal Library, {{ $patron->first_name }}!</h2>
    <p>Your library registration was successful. Here are your details:</p>

    <ul>
        <li><strong>Name:</strong> {{ $patron->first_name }} {{ $patron->last_name }}</li>
        <li><strong>Patron Type:</strong> {{ $patron->type }}</li>
        <li><strong>Library Card Number:</strong> {{ $patron->library_card_number }}</li>
    </ul>

    <p>You can use the QR Code below to easily time-in at the kiosk or borrow books:</p>

    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{ $patron->library_card_number }}" alt="QR Code">

    <p>Thank you,<br>Gerona Municipal Library Staff</p>
</body>
</html>
