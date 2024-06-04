//
//  PuttsListViewModel.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//

import Foundation
import CoreData

class PuttsListViewModel: ObservableObject {
    
    @Published var putts: [PuttEntity] = []
    @Published var particularSession: [PuttEntity] = []
    
    func getAllPutts() {
        putts =  CoreDataManager.shared.getAllPutts()
        puttData = putts
    }
    
    func addGoal(idd : Int, userID : Int,sessionId : Int,bbStrokeRatio : String,elevationAtImp : Double, offCenterImp : Double,loftAngle : Double,angLieStart : Double,angLieImp : Double,putterFaceAng : Double,frontStroke: String, backStroke: String, velocityAbs: String,accelerationImpact : String,score_putt : Int) {
      
      CoreDataManager.shared.addPutts(idd: idd, userID: userID, sessionId: sessionId, bbStrokeRatio: bbStrokeRatio, elevationAtImp: elevationAtImp, offCenterImp: offCenterImp, loftAngle: loftAngle, angLieStart: angLieStart, angLieImp: angLieImp, putterFaceAng: putterFaceAng, frontStroke: frontStroke, backStroke: backStroke, velocityAbs: velocityAbs, accelerationImpact: accelerationImpact, score_putt: score_putt)
       //getAllPutts()
    }
    
    func updatePutts() {
      CoreDataManager.shared.saveContext()
          self.getAllPutts()
    }
    
    func deletePutts(putts: PuttEntity) {
      CoreDataManager.shared.deletePutts(putts: putts)
        getAllPutts()
    }
  
  func deleteCompletsPutts() {
    CoreDataManager.shared.deleteCompletePutts()
      getAllPutts()
  }
  
  func fetchParticularSession(sessionId : Int)->[PuttEntity]
  {
    particularSession = CoreDataManager.shared.FetchParticularSession(sessionId: sessionId)
    return particularSession
   
   
  }
}
