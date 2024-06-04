//
//  ColorConstant.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//

import Foundation
import SwiftUI
enum AssetsColor {
   case purple200
   case purple500
   case purple700
   case teal200
   case teal700
   case tealwhite
   case red
   case blue
   case green
}

extension Color {

  init(_ name: AssetsColor) {
        switch name {
        case .purple200:
          self = Color("purple_200")
        case .purple500:
            self = Color("purple_500")
        case .purple700:
            self = Color("purple_700")
        case .teal200:
            self = Color("teal_200")
        case .teal700:
            self = Color("teal_700")
        case .red:
            self = Color("red")
        case .blue:
            self = Color("blue")
        case .green:
            self = Color("green")
        case .tealwhite:
            self = Color("white")
          
        }
    }
}

import SwiftUI

extension Color {
  static var appPurple200: Color {
    return Color("purple_200")
  }
  
  static var appPurple500: Color {
    return Color("purple_500")
  }
  
  static var appPurple700: Color {
    return Color("purple_700")
  }
  
  static var appTeal200: Color {
    return Color("teal_200")
  }
  
  static var appTeal700: Color {
    return Color("teal_700")
  }
  
  static var appRed: Color {
    return Color("red")
  }
  
  static var appBlue: Color {
    return Color("blue")
  }
  
  static var appGreen: Color {
    return Color("green")
  }
  
  static var appWhite: Color {
    return Color("tealwhite")
  }
}

