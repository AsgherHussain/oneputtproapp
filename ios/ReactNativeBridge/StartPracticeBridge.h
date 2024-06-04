//
//  StartPracticeBridge.h
//  OnePuttProApp
//
//  Created by PramodKumar on 22/11/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
NS_ASSUME_NONNULL_BEGIN

@interface StartPracticeBridge : NSObject <RCTBridgeModule>
- (void) practiceModuleView : (NSString *)sliderValue : (NSString *)sessionName : (NSString *)Sessiontime : (NSString *)macAddress : (NSString *)scoreData : (NSString *)userId;
- (void) updateLanguage : (NSString *) value;
@end

NS_ASSUME_NONNULL_END
