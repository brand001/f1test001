package com.a9XrB2z7.soexample;

import android.app.ActivityManager;
import android.app.Application;
import android.content.Context;
import android.os.Build;
import android.webkit.WebView;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.a9XrB2z7.soexample.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.tinstall.tinstall.TInstall;

import com.a9XrB2z7.soexample.AnExampleReactPackage;

import com.microsoft.codepush.react.CodePush;

import com.a9XrB2z7.soexample.iovation.IovationPackage;


import com.umeng.commonsdk.UMConfigure;
import com.umeng.commonsdk.utils.UMUtils;
import com.a9XrB2z7.soexample.UMPush.PushHelper;
import com.a9XrB2z7.soexample.UMPush.MyPreferences;

public class MainApplication extends Application implements ReactApplication {

    public static Context context;


    public static Context getContext() {
        return context;
    }

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(new AnExampleReactPackage());
            packages.add(new IovationPackage());
            // packages.add(new MyReactNativePackage());
            // prod需要使用先移除auto link的code push包，再手动添加指定地址
            for(ReactPackage rp:packages){
                if(rp instanceof CodePush){
                    packages.remove(rp);
                    break;
                }
            }
            packages.add(new CodePush(getResources().getString(R.string.CodePushDeploymentKey), getApplicationContext(), BuildConfig.DEBUG,"https://ltt338.com"));
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
          @Override
          protected String getJSBundleFile() {
              return CodePush.getJSBundleFile();
          }
      };

  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

@Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        String processName = getProcessName(this);
        String packageName = this.getPackageName();
        if (!packageName.equals(processName)) {
            WebView.setDataDirectorySuffix(processName);
        }
    }

      //初始化Tinstall代理码
      TInstall.setHost("https://feaffcodegetm3.com");
      TInstall.init(this,"2O46BV");
      initUmengSDK();
  }

    private void initUmengSDK() {
        //日志开关
        UMConfigure.setLogEnabled(false);
        //预初始化
        PushHelper.preInit(this);
        //是否同意隐私政策
//        boolean agreed = MyPreferences.getInstance(this).hasAgreePrivacyAgreement();
//        if (!agreed) {
//            return;
//        }
        boolean isMainProcess = UMUtils.isMainProgress(this);
        if (isMainProcess) {
            //启动优化：建议在子线程中执行初始化
            new Thread(new Runnable() {
                @Override
                public void run() {
                    PushHelper.init(getApplicationContext());
                }
            }).start();
        }
    }

    private String getProcessName(Context context) {
        if (context == null) return null;
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningAppProcessInfo processInfo : manager.getRunningAppProcesses()) {
            if (processInfo.pid == android.os.Process.myPid()) {
                return processInfo.processName;
            }
        }
        return null;
    }


  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.a9XrB2z7.soexample.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
