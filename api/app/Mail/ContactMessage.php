<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public $fullname;
    public $email;
    public $subject;
    public $fullmessage;
    /**
     * Create a new notification instance.
     *
     * @return void
     */

    public function __construct($fullname, $email, $subject, $fullmessage)
    {
        $this->fullname = $fullname;
        $this->email = $email;
        $this->subject = $subject;
        $this->fullmessage = $fullmessage;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->email)
                    ->view('emails.contact')
                    ->with([
                      'fullname' => $this->fullname,
                      'email' => $this->email,
                      'subject' => $this->subject,
                      'fullmessage' => $this->fullmessage,
                    ]);
    }
}
