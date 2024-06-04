//
//  PuttEntity+CoreDataProperties.swift
//  
//
//  Created by PramodKumar on 26/11/23.
//
//

import Foundation
import CoreData


extension PuttEntity {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<PuttEntity> {
        return NSFetchRequest<PuttEntity>(entityName: "PuttEntity")
    }

    @NSManaged public var id: Int16
    @NSManaged public var userId: Int64
    @NSManaged public var sessionId: Int64
    @NSManaged public var bbstrokeRatio: String?
    @NSManaged public var elevationAtImp: Double
    @NSManaged public var offCenterImp: Double
    @NSManaged public var loftAngle: Double
    @NSManaged public var angLieStart: Double
    @NSManaged public var angLieImp: Double
    @NSManaged public var putterFaceAng: Double
    @NSManaged public var frontStroke: String?
    @NSManaged public var backStroke: String?
    @NSManaged public var velocityAbs: String?
    @NSManaged public var accelerationImpact: String?
    @NSManaged public var score_putt: Int16

}
