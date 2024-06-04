//
//  SessionListViewModel.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//

import Foundation
import CoreData

class SessionListViewModel: ObservableObject {
    
    @Published var session: [SessionEntity] = []
   
    
    func getAllSessions() {
        session =  CoreDataManager.shared.getAllSession()
        sessionData = session
    }
    
    func addSession(sessionId : Int, userID : Int,start_date_time : String,end_date_time : String,total_puts : Int, isSync : Bool) {
      
      CoreDataManager.shared.addSession(sessionId: sessionId, userID: userID, start_date_time: start_date_time, end_date_time: end_date_time, total_puts: total_puts, isSync: isSync)
      
     // getAllSessions()
    }
    
    func updatePutts() {
        CoreDataManager.shared.saveContext()
      getAllSessions()
    }
    
    func deletePutts(session: SessionEntity) {
      CoreDataManager.shared.deleteSession(session: session)
      getAllSessions()
    }
  
  func updateRecords(sessionId : Int , endDateTime : String){
    CoreDataManager.shared.UpdateParticularSession(sessionId: sessionId, endDatTime: endDateTime)
        self.getAllSessions()
   
  }
  
}
