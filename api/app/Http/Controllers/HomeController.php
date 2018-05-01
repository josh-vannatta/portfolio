<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

class HomeController extends Controller
{

  public function contact(Request $request)
  {
      $request->validate([
        'sender' => 'required',
        'email' => 'required|email',
        'subject' => 'required',
        'message' => 'required'
      ]);

      Mail::to('josh@joshuavn.dev')->send(
        new ContactMessage(
          $request['sender'],
          $request['email'],
          $request['subject'],
          $request['message']
        )
     );
  }

  public function test(Request $request)
  {
    $items = $request['skills'];
    return response()->json($items);
  }

}
