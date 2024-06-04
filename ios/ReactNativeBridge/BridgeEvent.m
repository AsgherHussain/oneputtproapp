//
//  BridgeEvent.m
//  OnePuttProApp
//
//  Created by PramodKumar on 27/11/23.
//

#import "BridgeEvent.h"

@implementation BridgeEvent
RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static BridgeEvent *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onEvent"];
}

- (void)doMyAction :(NSString *) SessionId  {
  [self sendEventWithName:@"onEvent" body:SessionId];
}
@end
