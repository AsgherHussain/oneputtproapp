#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : RCTAppDelegate{
  NSDictionary *options;
    UIViewController *viewController;
}
@property (nonatomic, strong) UIWindow *window;
- (void) goToNativeView;
@end
