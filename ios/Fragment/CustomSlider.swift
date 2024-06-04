//
//  CustomSlider.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 25/11/23.
//

import Foundation
import SwiftUI

import SwiftUI

struct MySliderView: View {
    // this closure will be used to inform the controller that
    // the slider value changed
    var sliderDraggingClosure: ((Float) -> ())?
    var sliderReleasedClosure: ((Float) -> ())?

    
    @State private var sliderValue: Float = 1.0
    
  
    var body: some View {
        GeometryReader { geometry in
            VStack {
                VStack {
                  HStack(spacing: 0) {
                      ForEach(1..<13 ) { i in
                          if( (i) % 3 == 0)
                        {
                            Text("\(i) ft")
                              .font(.title3)
                              .bold()
                              .frame(width: geometry.size.width / 4)
                              .foregroundColor(.black)
                          }
                      }
                  }
                    Slider(
                        value: Binding(
                            get: { self.sliderValue },
                            set: { newValue in
                                self.sliderValue = newValue
                                self.sliderDraggingClosure?(newValue)
                            }
                        ),
                        in: 1...4,
                        step: 1.0
                    )
                    .onAppear{
                      if #available(iOS 16.0, *) {
                        let thumbImage = ImageRenderer(content: bullThumb).uiImage ?? UIImage()
                        UISlider.appearance().setThumbImage(thumbImage, for: .normal)
                      }
                    }
                    .accentColor(.appRed)
                    .padding(.horizontal, geometry.size.width / 10)
                     
                    
                   
                }
                .padding(.bottom, 20)
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        // Calculate the percentage of drag across the slider width
                        let percentage = (value.location.x / geometry.size.width)
                        // Calculate the corresponding value based on the percentage
                        let newValue = Float(percentage * 4) + 1
                        // Update slider value
                        self.sliderValue = max(1, min(newValue, 4))
                        // Notify the controller about dragging
                        self.sliderDraggingClosure?(self.sliderValue)
                      
                    }
                    .onEnded { _ in
                        // Round to the nearest integer value when dragging ends
                        let roundedValue = round(self.sliderValue)
                        self.sliderValue = roundedValue
                        // Notify the controller about slider release
                        self.sliderReleasedClosure?(roundedValue*3)
                    }
            )
        }.onAppear{
         
          sliderValue =  (Float(getSliderValue()) ?? 1.0)/3.0 
        }
    }
  
  var bullThumb: some View {
          VStack {
              ZStack {
                  Circle()
                    .frame(width: 30, height: 30)
                    .foregroundColor(.appRed)
                  Circle()
                    .strokeBorder(lineWidth: 6)
                    .frame(width: 24, height: 24)
                  Circle()
                    .strokeBorder(lineWidth: 6)
                    .frame(width: 4, height: 4)
              }
              .foregroundColor(.appRed)
          }
          .frame(width: 30, height: 30)
      }
  
}

struct MySliderView_Previews: PreviewProvider {
    static var previews: some View {
        MySliderView()
            .previewLayout(.sizeThatFits)
    }
}
