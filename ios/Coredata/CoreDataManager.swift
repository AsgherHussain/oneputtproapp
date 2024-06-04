//
//  DataManager.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//


import CoreData
import Foundation

class CoreDataManager {
    
    static let shared = CoreDataManager()
    let persistentContainer: NSPersistentContainer
    
    var viewContext: NSManagedObjectContext {
        return persistentContainer.viewContext
    }
    
    private init() {
        // pass the data model filename to NSPersistentContainer initializer
        persistentContainer = NSPersistentContainer(name: "OneputtModel")
      let paths = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)
      print(paths[0])
        // load any persistent stores
        persistentContainer.loadPersistentStores { (description, error) in
            if let error = error {
                fatalError("Unable to initialize Core Data \(error)")
            }
        }
    }
    
    // save the changes on your context to the persistent store
    func saveContext() {
        do {
            try viewContext.save()
        } catch {
            viewContext.rollback()
            print(error.localizedDescription)
        }
    }
  
  // fetch all the putts data from Putts Entity using NSFetchRequest
  func getAllPutts() -> [PuttEntity] {
      let request = NSFetchRequest<PuttEntity>(entityName: "PuttEntity")

      do {
          return try viewContext.fetch(request)
      } catch {
          return []
      }
  }

  // assign the data and don't forget to save the
  // changes using saveContext function
  func addPutts(idd : Int, userID : Int,sessionId : Int,bbStrokeRatio : String,elevationAtImp : Double, offCenterImp : Double,loftAngle : Double,angLieStart : Double,angLieImp : Double,putterFaceAng : Double,frontStroke: String, backStroke: String, velocityAbs: String,accelerationImpact : String,score_putt : Int) {
      let newPutts = PuttEntity(context: viewContext)

    newPutts.id = Int16(idd)
    newPutts.userId = Int64(userID)
    newPutts.sessionId = Int64(sessionId)
    newPutts.bbstrokeRatio = bbStrokeRatio
    newPutts.elevationAtImp = elevationAtImp
    newPutts.offCenterImp = offCenterImp
    newPutts.loftAngle = loftAngle
    newPutts.angLieStart = angLieStart
    newPutts.angLieImp = angLieImp
    newPutts.putterFaceAng = putterFaceAng
    newPutts.frontStroke = frontStroke
    newPutts.backStroke = backStroke
    newPutts.velocityAbs = velocityAbs
    newPutts.accelerationImpact = accelerationImpact
    newPutts.score_putt = Int16(score_putt)
    

      saveContext()
  }

  // delete the putts based on the selected putts you want to delete
  func deletePutts(putts: PuttEntity) {
      viewContext.delete(putts)
      saveContext()
  }
  
  func deleteCompletePutts() {
    let request = NSFetchRequest<PuttEntity>(entityName: "PuttEntity")

    do {
        let records = try viewContext.fetch(request)
          for record in records {
            viewContext.delete(record)
          }
          try viewContext.save()
    } catch {
      print("Error deleting records: \(error.localizedDescription)")
    }
      
  }
  
  // fetch all the putts data from Putts Entity using NSFetchRequest
  func getAllSession() -> [SessionEntity] {
      let request = NSFetchRequest<SessionEntity>(entityName: "SessionEntity")

    do {
        let sessions = try viewContext.fetch(request)
        print("Fetched sessions: \(sessions)")
        return sessions
    } catch {
        print("Error fetching sessions: \(error)")
        return []
    }
  }

  // assign the data and don't forget to save the
  // changes using saveContext function
  func addSession(sessionId : Int, userID : Int,start_date_time : String,end_date_time : String,total_puts : Int, isSync : Bool) {
    
    let newSession = SessionEntity(context: viewContext)
  
    newSession.sessionId = Int64(sessionId)
    newSession.user_id = Int64(userID)
    newSession.start_date_time = start_date_time
    newSession.end_date_time = end_date_time
    newSession.total_puts = Int64(total_puts)
    newSession.isSync = isSync
    
      saveContext()
  }
  
  func FetchParticularSession(sessionId : Int) -> [PuttEntity]  {
    
    let request = NSFetchRequest<PuttEntity>(entityName: "PuttEntity")
    
  
    request.predicate = NSPredicate(format: "sessionId == %@", String(sessionId))

    do {
        return try viewContext.fetch(request)

    } catch {
        print("Error fetching record: \(error.localizedDescription)")
       return []
    }
  }
  
  func UpdateParticularSession(sessionId : Int,endDatTime : String) {
  
    let request = NSFetchRequest<SessionEntity>(entityName: "SessionEntity")
    
    
    request.predicate = NSPredicate(format: "sessionId == %@", String(sessionId))

    do {
        let records = try viewContext.fetch(request)

        if let matchingRecord = records.first {
            // Update the attribute 'end_date_time'
            matchingRecord.end_date_time = endDatTime

            do {
                // Save the changes to the managed object context
                try viewContext.save()
                print("Record updated successfully.")
            } catch {
                print("Error saving context: \(error.localizedDescription)")
            }
        } else {
            print("No matching records found.")
        }

    } catch {
        print("Error fetching record: \(error.localizedDescription)")
    }
      
  }

  // delete the putts based on the selected putts you want to delete
  func deleteSession(session: SessionEntity) {
      viewContext.delete(session)
      saveContext()
  }
}

