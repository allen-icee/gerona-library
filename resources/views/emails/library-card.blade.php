<!--resources\views\emails\library-card.blade.php-->
<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #fdf2f8;
            padding: 20px;
            color: #000000;
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
        .card-replica {
            background: #ffffff;
            border: 1px solid #fbcfe8;
            border-radius: 6px;
            width: 100%;
            box-sizing: border-box;
            margin-top: 20px;
            overflow: hidden;
        }

        .card-inner-table {
            width: 100%;
            border-collapse: collapse;
        }

        .card-left {
            width: 65%;
            vertical-align: top;
            padding: 16px;
            padding-right: 8px;
        }

        .card-right {
            width: 35%;
            vertical-align: middle;
            text-align: center;
            padding: 16px;
            padding-left: 0;
            background-color: #fff0f5;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            line-height: 1.5;
        }

        @media screen and (max-width: 480px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 15px;
            }
            .card-left, .card-right {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
                text-align: center !important;
                padding: 20px !important;
            }
            .card-left {
                border-bottom: 2px dashed #fbcfe8 !important;
            }
            .card-header-table {
                margin: 0 auto 15px auto !important;
            }
            .patron-info {
                text-align: center !important;
            }
            .patron-address {
                margin: 0 auto !important;
            }
            .qr-image {
                width: 180px !important;
                height: 180px !important;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="title">Gerona Municipal Library</div>
            <div class="subtitle">DR. JORGE CLEOFAS BOCOBO LIBRARY</div>
        </div>

        <p style="font-size: 14px; color: #374151; text-align: center;">Hi <strong>{{ $patron->first_name }}</strong>,</p>
        <p style="font-size: 14px; color: #374151; line-height: 1.5; text-align: center;">Your registration was successful! Please present
            this QR code at the kiosk when you visit the library.</p>

        <div class="card-replica">
            <table class="card-inner-table">
                <tr>
                    <td class="card-left">
                        <table class="card-header-table" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                            <tr>
                                <td valign="middle" style="padding-right: 8px;">
                                    <img src="{{ $message->embed(public_path('images/MunicipalityLogo.png')) }}" alt="LGU" width="28" height="28" style="display: block; object-fit: contain;">
                                </td>
                                <td valign="middle" style="padding-right: 8px;">
                                    <img src="{{ $message->embed(public_path('images/GeronaLibraryLogo.png')) }}" alt="Library" width="30" height="30" style="display: block; object-fit: contain;">
                                </td>
                                <td valign="middle" style="text-align: left;">
                                    <div style="font-size: 11px; font-weight: 900; color: #be185d; letter-spacing: 0.02em; line-height: 1; white-space: nowrap; margin: 0;">
                                        GERONA MUNICIPAL LIBRARY
                                    </div>
                                    <div style="font-size: 8px; font-weight: bold; color: #db2777; letter-spacing: 0.05em; white-space: nowrap; margin: 2px 0 0 0;">
                                        Dr. Jorge Cleofas Bocobo Library
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <div class="patron-info" style="text-align: left;">
                            <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 4px; line-height: 1.1;">
                                {{ $patron->first_name }}
                                {{ $patron->middle_initial ? $patron->middle_initial . '. ' : '' }}{{ $patron->last_name }}{{ $patron->suffix ? ' ' . $patron->suffix : '' }}
                            </div>
                            <div style="font-size: 11px; font-weight: 600; color: #334155; margin-bottom: 4px; text-transform: uppercase;">
                                {{ $patron->type }}
                            </div>
                            @if($patron->contact_number)
                                <div style="font-size: 10px; font-weight: 600; color: #475569; margin-bottom: 6px;">
                                    {{ $patron->contact_number }}
                                </div>
                            @endif
                            <div class="patron-address" style="font-size: 10px; color: #64748b; line-height: 1.4; max-width: 95%;">
                                {{ $patron->street ? $patron->street . ', ' : '' }}Brgy. {{ $patron->barangay }},<br>
                                {{ $patron->municipality }}, {{ $patron->province }}
                            </div>
                        </div>
                    </td>

                    <td class="card-right">
                        <img
                            class="qr-image"
                            src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=000000&bgcolor=FFFFFF&margin=0&ecc=M&data={{ urlencode($patron->library_card_number) }}"
                            width="100"
                            height="100"
                            style="display: block; margin: 0 auto; border-radius: 4px; border: 4px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"
                            alt="QR Code"
                        >
                        <div style="font-family: monospace; font-size: 13px; font-weight: 900; color: #be185d; letter-spacing: 0.1em; margin-top: 10px; text-align: center;">
                            {{ $patron->library_card_number }}
                        </div>
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
