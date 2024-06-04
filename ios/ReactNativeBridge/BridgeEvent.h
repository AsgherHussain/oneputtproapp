//
//  BridgeEvent.h
//  OnePuttProApp
//
//  Created by PramodKumar on 27/11/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
NS_ASSUME_NONNULL_BEGIN

@interface BridgeEvent : RCTEventEmitter <RCTBridgeModule>
- (void)doMyAction :(NSString *) SessionId;
@end

NS_ASSUME_NONNULL_END
