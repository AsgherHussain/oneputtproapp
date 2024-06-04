//
//  StartPracticeBridge.m
//  OnePuttProApp
//
//  Created by PramodKumar on 22/11/23.
//

#import "StartPracticeBridge.h"
#import "AppDelegate.h"

@implementation StartPracticeBridge
RCT_EXPORT_MODULE(StartPracticeBridge);

RCT_EXPORT_METHOD(practiceModuleView : (NSString *)sliderValue : (NSString *)sessionName : (NSString *)Sessiontime : (NSString *)macAddress : (NSString *)scoreData : (NSString *)userId) {
  NSLog(@"RN binding - Native View");
  NSLog(@"SliderVlaue : %@ , Sess Name : %@ ,Session Time : %@, Mac Add : %@,Score: %@,UserId : %@",sliderValue,sessionName,Sessiontime,macAddress,scoreData,userId);
  
  NSArray *ScoreArray = [scoreData componentsSeparatedByString:@","];
  NSLog(@"scorearray :%@",ScoreArray);
  
  NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  [prefs setObject:sliderValue forKey:@"REACTSLIDERVALUE"];
  [prefs setObject:sessionName forKey:@"SESSIONNAME"];
  [prefs setObject:Sessiontime forKey:@"SESSIONTIME"];
  [prefs setObject:macAddress forKey:@"MACADDRESS"];
  [prefs setObject:ScoreArray forKey:@"REACTSCOREDATA"];
  [prefs setObject:userId forKey:@"USERID"];
  [prefs synchronize];
   
  
  
  dispatch_async(dispatch_get_main_queue(), ^{
      AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
       [appDelegate goToNativeView];
   
   
  });
 
}


RCT_EXPORT_METHOD(updateLanguage : (NSString *) value) {
  NSLog(@"RN binding - Native View - Loading MyViewController.swift");
  dispatch_async(dispatch_get_main_queue(), ^{
    NSLog(@"%@", value);
    [[NSUserDefaults standardUserDefaults] setObject:value forKey:@"Language"];
    [[NSUserDefaults standardUserDefaults] synchronize];
   
  });
 
}
@end
