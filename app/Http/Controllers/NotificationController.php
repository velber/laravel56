<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{

    public function notify()
    {
        $endpoint = '';
        $user = \App\User::find(1);

        $user->updatePushSubscription($endpoint);
        $user->notify(new \App\Notifications\WebPushNotification());

        return back();
    }
}
