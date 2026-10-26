import UIKit
import WebKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // The client could not pinch-zoom inside the app even though the site's
        // viewport allows it (user-scalable=yes, maximum-scale=5) and Safari on
        // the same phone zooms fine — WKWebView applies its own scale limits.
        // ignoresViewportScaleLimits is Apple's switch for exactly this, and it
        // must be set on the webview's configuration once it exists; Capacitor
        // has no config flag for it.
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            func findWebView(_ view: UIView?) -> WKWebView? {
                guard let view = view else { return nil }
                if let webView = view as? WKWebView { return webView }
                for subview in view.subviews {
                    if let found = findWebView(subview) { return found }
                }
                return nil
            }
            let root = self?.window?.rootViewController?.view
                ?? UIApplication.shared.windows.first?.rootViewController?.view
            if let webView = findWebView(root) {
                webView.configuration.ignoresViewportScaleLimits = true
                webView.scrollView.minimumZoomScale = 1.0
                webView.scrollView.maximumZoomScale = 5.0
                webView.scrollView.bouncesZoom = true
            }
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}
