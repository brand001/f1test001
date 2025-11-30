package com.a9XrB2z7.soexample;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import org.devio.rn.splashscreen.SplashScreen;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.os.Build;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.content.res.Configuration;
import android.app.Application;
import android.content.res.Resources;
import android.widget.Toast;

import com.tinstall.tinstall.TInstall;
import org.json.JSONObject;
import org.json.JSONException;

import com.umeng.message.PushAgent;
import java.util.Locale;
import android.content.ComponentName;
import android.content.pm.PackageManager;

public class MainActivity extends ReactActivity {

  public static String Affcodes = "";
  public static String Rafcodes = "";
  public static String Language = "CN"; // ✅ 默认语言设为 CN
  public static String LanguageJS = "";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // 先初始化 TInstall，获取语言设置
    getTinstall();

    // 显示启动图
    SplashScreen.show(this, true);

    // 设置全屏和刘海屏适配
    setupFullScreen();

    super.onCreate(savedInstanceState);
//    PushAgent.getInstance(this).onAppStart();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // 屏幕方向改变时重新设置刘海屏适配
    setupFullScreen();
  }

  private void setupFullScreen() {
    // 获取窗口
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
        WindowManager.LayoutParams.FLAG_FULLSCREEN);

    // 检查当前屏幕方向
    int orientation = getResources().getConfiguration().orientation;

    // 只在横屏时设置刘海屏适配
    if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
      // 横屏时才设置刘海屏适配
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        // 横屏时使用always模式，实现完全全面屏
        lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
        getWindow().setAttributes(lp);
      }

      // Android 11+ 的沉浸式模式
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        getWindow().setDecorFitsSystemWindows(false);
        WindowInsetsController controller = getWindow().getInsetsController();
        if (controller != null) {
          controller.hide(WindowInsets.Type.systemBars());
          controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
      } else {
        // Android 10 及以下版本
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
      }
    }
    // 竖屏时不做特殊处理，保持原始状态
  }


  private void applyLanguageConfiguration() {
    // 添加 Toast 显示当前 Language
    //Toast.makeText(this, "Current Language: " + Language, Toast.LENGTH_LONG).show();

    // 根据语言设置 Configuration
    Configuration config = new Configuration(getResources().getConfiguration());
    switch (Language) {
      case "TH":
        config.setLocale(new Locale("th"));
        break;
      case "VN":
        config.setLocale(new Locale("vi"));
        break;
      default:
        config.setLocale(Locale.CHINESE);
    }

    // 更新 Configuration
    getResources().updateConfiguration(config, getResources().getDisplayMetrics());

  }


  private void getTinstall() {
    TInstall.getInstall(this, new TInstall.TInstallCallback() {
      @Override
      public void installBack(JSONObject object) {
        // 确定最终语言的优先级逻辑
        determineFinalLanguage(object);

        // 根据最终语言执行配置
        applyLanguageConfiguration();

        // 保留原有的 affCode 和 raf 处理逻辑
        try {
          Affcodes = object.getString("affCode");
        } catch (JSONException e) {
          try {
            Affcodes = object.getString("affcode");
          } catch (JSONException s) {
            try {
              Affcodes = object.getString("aff");
            } catch (JSONException d) {
              Affcodes = "err";
              d.printStackTrace();
            }
            s.printStackTrace();
          }
          e.printStackTrace();
        }

        try {
          Rafcodes = object.getString("raf");
        } catch (JSONException e) {
          Rafcodes = "err";
          e.printStackTrace();
        }
      }
    });
  }

  private void determineFinalLanguage(JSONObject object) {
    // 1. 最高优先级：TInstall 的 language 参数
    try {
      String tinstallLang = object.getString("language").toUpperCase();
      if (tinstallLang != null && !tinstallLang.isEmpty()) {
        Language = tinstallLang;
        LanguageJS = tinstallLang;
        return; // 找到有效的 TInstall 语言，直接返回
      }
    } catch (JSONException e) {
      // TInstall 语言获取失败，继续下一步
    }

    // 2. 其次优先级：系统语言
    String systemLang = getResources().getConfiguration().locale.getLanguage().toUpperCase();
    if (systemLang.equals("TH")) {
      Language = "TH";
    } else if (systemLang.equals("VI")) { // 越南语的locale代码是VI
      Language = "VN";
    } else {
      // 默认使用中文
      Language = "CN";
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FedevProject";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
