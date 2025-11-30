package com.a9XrB2z7.soexample.UMPush;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;

import com.umeng.message.PushAgent;
import com.umeng.message.UTrack;
import com.umeng.message.UmengMessageHandler;
import com.umeng.message.UmengMessageService;
import com.umeng.message.common.UPushNotificationChannel;
import com.umeng.message.entity.UMessage;
import com.a9XrB2z7.soexample.R;

import org.android.agoo.common.AgooConstants;
import org.json.JSONObject;

/**
 * 自定义接收并处理友盟推送消息的服务类
 */
public class MyCustomMessageService extends UmengMessageService {
    private static final String TAG = "MyCustomMessageService";

    @Override
    public void onMessage(Context context, Intent intent) {
        Log.i(TAG, "onMessage");
        try {
            String body = intent.getStringExtra(AgooConstants.MESSAGE_BODY);
            UMessage message = new UMessage(new JSONObject(body));
            if (UMessage.DISPLAY_TYPE_NOTIFICATION.equals(message.display_type)) {
                //处理通知消息
                handleNotificationMessage(message);
            } else if (UMessage.DISPLAY_TYPE_CUSTOM.equals(message.display_type)) {
                //TODO: 开发者实现：处理自定义透传消息
                handleCustomMessage(message);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleCustomMessage(UMessage message) {
        Log.i(TAG, "handleCustomMessage: " + message.getRaw().toString());
    }

    private void handleNotificationMessage(UMessage msg) {
        Notification.Builder builder;
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = UPushNotificationChannel.getDefaultMode(this);
            builder = new Notification.Builder(this, channel.getId());
        } else {
            builder = new Notification.Builder(this);
        }
        builder.setContentTitle(msg.title)
                .setContentText(msg.text)
                .setTicker(msg.ticker)
                .setWhen(System.currentTimeMillis())
                .setSmallIcon(R.drawable.umeng_push_notification_default_small_icon)
                .setAutoCancel(true);
        Notification notification = builder.getNotification();
//        PendingIntent clickIntent = getClickPendingIntent(this, msg);
        notification.deleteIntent = getDismissPendingIntent(this, msg);
//        notification.contentIntent = clickIntent;
        manager.notify((int) SystemClock.elapsedRealtime(), notification);
        UTrack.getInstance().trackMsgShow(msg, notification);
    }

    public PendingIntent getClickPendingIntent(Context context, UMessage msg) {
        return null;
    }

    public PendingIntent getDismissPendingIntent(Context context, UMessage msg) {
        return new UmengMessageHandler().getDismissPendingIntent(context, msg);
    }

}
