<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #fdf2f8;
            padding: 20px;
            color: #1f2937;
            margin: 0;
        }

        .container {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #fbcfe8;
            box-shadow: 0 4px 12px rgba(236, 72, 153, 0.08);
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #fdf2f8;
            padding-bottom: 20px;
        }

        .title {
            color: #be185d;
            font-size: 20px;
            font-weight: 900;
            margin-bottom: 4px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .subtitle {
            color: #db2777;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Email-safe layout replicating the physical card */
        .card-replica {
            background: #ffffff;
            border: 1px solid #fbcfe8;
            border-radius: 6px;
            padding: 20px;
            width: 100%;
            box-sizing: border-box;
            margin-top: 20px;
        }

        .card-table {
            width: 100%;
            border-collapse: collapse;
        }

        .card-left {
            width: 65%;
            vertical-align: top;
            padding-right: 15px;
        }

        .card-right {
            width: 35%;
            vertical-align: top;
            text-align: center;
        }

        .card-header-title {
            color: #be185d;
            font-size: 11px;
            font-weight: 900;
            margin: 0;
        }

        .card-header-sub {
            color: #db2777;
            font-size: 8px;
            font-weight: bold;
            margin: 2px 0 15px 0;
        }

        .patron-name {
            font-size: 18px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 5px 0;
            line-height: 1.1;
        }

        .patron-type {
            font-size: 10px;
            font-weight: bold;
            color: #334155;
            margin: 0 0 5px 0;
        }

        .patron-address {
            font-size: 9px;
            color: #64748b;
            margin: 0;
            line-height: 1.3;
        }

        .qr-wrapper {
            margin-bottom: 10px;
        }

        .qr-image {
            display: inline-block;
            border-radius: 4px;
            max-width: 100%;
            height: auto;
        }

        .id-number {
            font-family: monospace;
            font-size: 12px;
            font-weight: bold;
            color: #be185d;
            letter-spacing: 1px;
            margin: 0;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            line-height: 1.5;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="title">Gerona Municipal Library</div>
            <div class="subtitle">DR. JORGE CLEOFAS BOCOBO LIBRARY</div>
        </div>

        <p style="font-size: 14px; color: #374151;">Hi <strong>{{ $patron->first_name }}</strong>,</p>
        <p style="font-size: 14px; color: #374151; line-height: 1.5;">Your registration was successful! Please present
            your <strong>Library Access Card</strong> QR code at the kiosk when you visit the library.</p>

        <div class="card-replica">
            <table class="card-table">
                <tr>
                    <td class="card-left">
                        <p class="card-header-title">GERONA MUNICIPAL LIBRARY</p>
                        <p class="card-header-sub">DR. JORGE CLEOFAS BOCOBO LIBRARY</p>

                        <p class="patron-name">
                            {{ $patron->first_name }}
                            {{ $patron->middle_initial ? $patron->middle_initial . '.' : '' }}
                            {{ $patron->last_name }}
                            {{ $patron->suffix }}
                        </p>
                        <p class="patron-type">{{ $patron->type }}</p>

                        @if($patron->contact_number)
                            <p class="patron-type" style="color: #475569;">{{ $patron->contact_number }}</p>
                        @endif

                        <p class="patron-address">
                            {{ $patron->street ? $patron->street . ', ' : '' }}Brgy. {{ $patron->barangay }},
                            {{ $patron->municipality }}, {{ $patron->province }}
                        </p>
                    </td>

                    <td class="card-right">
                        <div class="qr-wrapper">
                            <img class="qr-image"
                                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=be185d&data={{ $patron->library_card_number }}"
                                alt="QR Code">
                        </div>
                        <p class="id-number">{{ $patron->library_card_number }}</p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="footer">
            If you did not request this access card, please ignore this email.<br>
            &copy; {{ date('Y') }} Gerona Municipal Library. All rights reserved.
        </div>
    </div>
</body>

</html>