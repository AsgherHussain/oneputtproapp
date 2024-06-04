//
//  CommonFunction.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 29/11/23.
//

import Foundation


func getCurrentDateTime(format : String) -> String
{
  let dateFormat = DateFormatter()
  dateFormat.dateFormat = format
  let timeStamp = dateFormat.string(from: Date())
  return timeStamp
}
