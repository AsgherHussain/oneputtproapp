//
//  SessionEntity+CoreDataProperties.swift
//  
//
//  Created by PramodKumar on 26/11/23.
//
//

import Foundation
import CoreData


extension SessionEntity {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<SessionEntity> {
        return NSFetchRequest<SessionEntity>(entityName: "SessionEntity")
    }

    @NSManaged public var sessionId: Int64
    @NSManaged public var user_id: Int64
    @NSManaged public var start_date_time: String?
    @NSManaged public var end_date_time: String?
    @NSManaged public var total_puts: Int64
    @NSManaged public var isSync: Bool

}
