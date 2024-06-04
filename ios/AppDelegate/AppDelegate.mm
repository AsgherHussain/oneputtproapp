#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  /*self.moduleName = @"OnePuttProApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];*/
  
  options = launchOptions;
    [self setInitialViewController];
  return  YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (void) setInitialViewController {
  
  ///Running iOS code
 /* UIViewController *vc = [UIStoryboard storyboardWithName:@"Storyboard" bundle:nil].instantiateInitialViewController;
  
  UIViewController *rootViewController = [UIViewController new];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = vc;*/
  
  
  ///Running react native code
  NSURL *jsCodeLocation;

#if DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName:@"OnePuttProApp" initialProperties:nil launchOptions:options];
  
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = rootViewController;
  
  //Dummy Data
  /*NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  [prefs setObject:@"3" forKey:@"SLIDERVALUE"];
  [prefs setObject:@"TestDemo" forKey:@"SESSIONNAME"];
  [prefs setObject:@"2" forKey:@"SESSIONTIME"];
  [prefs setObject:@"686228DD-DD89-DAB6-CB6F-BD7D981FCEE1" forKey:@"MACADDRESS"];
  [prefs setObject:@"[1,2,3,4,5]" forKey:@"SCOREDATA"];
  [prefs setObject:@"10" forKey:@"USERID"];
  [prefs synchronize];*/
  
  viewController = rootViewController;

  [self.window makeKeyAndVisible];
}


- (void) goToNativeView  {
  
  NSLog(@"RN binding - Native View - MyViewController.swift - Load From main");
 UIViewController *vc = [UIStoryboard storyboardWithName:@"Storyboard" bundle:nil].instantiateInitialViewController;
  
  UINavigationController* navigationController = [[UINavigationController alloc] initWithRootViewController:vc];
  navigationController.modalPresentationStyle = UIModalPresentationFullScreen;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    UIViewController *topController = [self topViewController];
    [topController presentViewController:navigationController animated:YES completion:nil];
  });

}


- (UIViewController*)topViewController {
    return [self topViewControllerWithRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}

- (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController {
    if ([viewController isKindOfClass:[UITabBarController class]]) {
        UITabBarController* tabBarController = (UITabBarController*)viewController;
        return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
    } else if ([viewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController* navContObj = (UINavigationController*)viewController;
        return [self topViewControllerWithRootViewController:navContObj.visibleViewController];
    } else if (viewController.presentedViewController && !viewController.presentedViewController.isBeingDismissed) {
        UIViewController* presentedViewController = viewController.presentedViewController;
        return [self topViewControllerWithRootViewController:presentedViewController];
    }
    else {
        for (UIView *view in [viewController.view subviews])
        {
            id subViewController = [view nextResponder];
            if ( subViewController && [subViewController isKindOfClass:[UIViewController class]])
            {
                if ([(UIViewController *)subViewController presentedViewController]  && ![subViewController presentedViewController].isBeingDismissed) {
                    return [self topViewControllerWithRootViewController:[(UIViewController *)subViewController presentedViewController]];
                }
            }
        }
        return viewController;
    }
}

@end
