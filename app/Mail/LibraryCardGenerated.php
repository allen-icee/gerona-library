<?php

namespace App\Mail;

use App\Models\Patron;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LibraryCardGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public $patron;

    public function __construct(Patron $patron)
    {
        $this->patron = $patron;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome! Your Gerona Library Card is Ready',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.library-card',
        );
    }
}
