//
//  openinstall.m
//  UMComponent
//
//  Created by Benjie Lai on 2018/11/26.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "openinstall.h"
#import <TInstallSDK/TInstallSDK.h>


@import Eagleeyes.DevicePrint;
@implementation Openinstall {
  BOOL hasListeners; // 是否有 JS 监听器
}


RCT_EXPORT_MODULE();
//  对外提供调用方法,演示Callback

// 支持的事件
- (NSArray<NSString *> *)supportedEvents {
  return @[@"NotificationClick"];
}

// 开始监听
- (void)startObserving {
  hasListeners = YES;
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleNotificationTapped:)
                                               name:@"NotificationClick"
                                             object:nil];
}

// 停止监听
- (void)stopObserving {
  hasListeners = NO;
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// 处理通知点击事件
- (void)handleNotificationTapped:(NSNotification *)notification {
  if (hasListeners) {
    [self sendEventWithName:@"NotificationClick" body:notification.userInfo];
  }
}

RCT_EXPORT_METHOD(getDevicetoken:(RCTResponseSenderBlock)callback)
{
    callback(@[GetDeviceToken]);
  
}


RCT_EXPORT_METHOD(getAffCode:(RCTResponseSenderBlock)callback)
{
  NSString * _Nullable FixedAffCode = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"AffCode"];
//  NSLog(@"123qwe%@", FixedAffCode);
  if(FixedAffCode.length != 0) {
    //写死固定代理码affcode
    callback(@[FixedAffCode]);
  } else {
    //TInstall代理码affcode
    [TInstall getWithInstallResult:^(NSDictionary * _Nullable data) {
        NSString *err = @"err";
        if (data) {
            NSArray *dicArr = data.allKeys;
            if (dicArr.count > 0) {
              NSString * _Nullable affCodeMax = [data valueForKey:@"affCode"];
              NSString * _Nullable affcodeMin = [data valueForKey:@"affcode"];
              NSString * _Nullable aff = [data valueForKey:@"aff"];
              if (affCodeMax.length != 0) {
                callback(@[affCodeMax]);
              } else if (affcodeMin.length != 0) {
                callback(@[affcodeMin]);
              } else if (aff.length != 0) {
                callback(@[aff]);
              } else {
                callback(@[err]);
              }
            } else {
              callback(@[err]);
            }
        } else {
          callback(@[err]);
        }
    }];
  }
  
}

RCT_EXPORT_METHOD(getRafCode:(RCTResponseSenderBlock)callback)
{
  //推荐好友rafcode
  [TInstall getWithInstallResult:^(NSDictionary * _Nullable data) {
      NSString *rafErr = @"err";
      if (data) {
          NSArray *rafDicArr = data.allKeys;
          if (rafDicArr.count > 0) {
            NSString * _Nullable raf = [data valueForKey:@"raf"];
            if (raf.length != 0) {
              callback(@[raf]);
            } else {
              callback(@[rafErr]);
            }
          } else {
            callback(@[rafErr]);
          }
      } else {
        callback(@[rafErr]);
      }
  }];

}

RCT_EXPORT_METHOD(getPackageName:(RCTResponseSenderBlock)callback)
{
  //packageName
    NSString *packageName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];
    callback(@[packageName]);
  
}


RCT_EXPORT_METHOD(getE2BlackBox:(RCTResponseSenderBlock)callback)
{
  //E2
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *blackbox = [DevicePrint getBlackBox];
    callback(@[[NSNull null],blackbox]);
    
  });
}






@end
