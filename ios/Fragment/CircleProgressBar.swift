//
//  CircleProgressBar.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 25/11/23.
//

import Foundation
import SwiftUI

struct CircularProgressView: View {
  
  let progress: Double
      
      var body: some View {
        ZStack {
                   // Outer Circle
                   Circle()
                          .stroke(
                              Color.gray.opacity(0.3),
                              lineWidth: 7
                          )
                          .frame(width: 180, height: 180)
                   Circle()
                       .stroke(Color.gray, lineWidth: 25)
                       .opacity(0.3)
                       .frame(width: 120, height: 120)

                   // Inner Circle
          Circle()
              .trim(from: 0, to: progress)
              .stroke(
                  Color.appRed,
                  style: StrokeStyle(
                      lineWidth: 25,
                      lineCap: .round
                  )
              )
              .frame(width: 120, height: 120)
              .rotationEffect(.degrees(-90))
              // 1
              .animation(.easeOut, value: progress)
               }
               .padding()
        
         
      }
}

struct CircularProgressView_Previews: PreviewProvider {
  static var previews: some View {
    CircularProgressView(progress: 0.5)
  }
}
