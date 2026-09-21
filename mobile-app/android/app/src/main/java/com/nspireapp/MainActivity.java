package com.nspireapp;

import android.os.Bundle;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // On low-RAM devices the WebView's renderer process can be killed by Android
        // under memory pressure during normal use (large photo previews, big forms).
        // Capacitor's default behavior for this event returns false, which tells
        // Android to terminate the whole app process — on relaunch it reloads
        // server.url from scratch, replaying the splash screen and losing all
        // in-memory app state. Handling the event ourselves and reloading the
        // WebView keeps the app alive instead.
        this.getBridge()
            .addWebViewListener(
                new WebViewListener() {
                    @Override
                    public boolean onRenderProcessGone(WebView webView, RenderProcessGoneDetail detail) {
                        if (webView != null) {
                            webView.post(webView::reload);
                        }
                        return true;
                    }
                }
            );
    }
}
