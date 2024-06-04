//
//  ExpandableListView1.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//


import Foundation
import SwiftUI
import DGCharts

struct ExpandableListView: View {
  @State var isExpandingPutting: Bool = false
  @State var isExpandingLoft: Bool = false
  @State var isExpandingPutterFaceAngle: Bool = false
  @State var isExpandingPutterFacePoistion: Bool = false
  @State var isExpandinglieAngle: Bool = false
  @State var isExpandingAccelerationImpact: Bool = false
  @State private var isTooltipVisible = false
  @State private var isTooltipText = ""
  @Binding  var PuttingTempoValue : String
  @Binding  var PuttingTempoRedArrowValue : String
  @Binding  var PuttingTempoGreenArrowValue : String
  @Binding var loftAngleValueTxt : String
  @Binding var loftAngleValue : String
  @Binding var loftAngleDecreeTxt : String
  @Binding var loftAngleStick : Int
  
  @Binding var putterFaceAngleDegreeTxt :String
  @Binding var putterFaceAngleValueTxt : String
  @Binding var putterFacePositionAngleValueTxt : String
  
  @Binding var putterFacePositionAngleDecreeTxt :String
  @Binding var lieAngleStart : String
  @Binding var lieAngleImpact : String
  @Binding var lieAngleValueTxt : String
  
  @Binding var accelerationImpactValueTxt : String
  @Binding var accelerationImpactDegreeTxt : String
  @Binding var PutterPositionImgGolfStick : Int
  @Binding var PutterFaceAngleImgGolfStickRotation : Double
  @Binding var PutterFaceAngleImgGolfStickXPosition : Double
  @Binding var PutterFaceAngleImgGolfStickYPosition : Double
  
  
  var body: some View {
        VStack{
            ///Putting Tempo
            ExpandableView(
              headerSize: CGSize(width: 380.0, height: 50.0),
              cardSize: CGSize(width: 380.0, height: 200.0), header: {
                HStack {
                  
                  Text("Putting Tempo")
                    .font(.title3)
                  Spacer()
                  
                  HStack(spacing : 20){
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "The ratio between front to backstroke"
                            showTooltip()
                          }
                        }
                    }
                    VStack{
                      Text(PuttingTempoValue)
                        .font(.title3)
                        .padding(.horizontal,5)
                        .frame(width: 90)
                        .padding(.vertical,5)
                      
                    }.background(Color.appRed)
                   
                      Image(isExpandingPutting ? "ic_arrow_up" :"ic_arrow_down")
                        .resizable()
                        .frame(width: 15,height: 15 )
                   
                  }
                  
                }
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
                
              }, content: {
                ZStack{
                  Image("stick")
                    .resizable()
                    //.padding(10)
                    .frame(width: 250,height: 200 )
                  VStack{
                    Image("red_arrow")
                      .resizable()
                      .frame(width: 70,height: 15)
                    HStack{
                      Text("\(PuttingTempoRedArrowValue) sec")
                        .font(Font.system(size: 11))
                        .foregroundColor(.black)
                        .rotationEffect(.degrees(20))
                        .padding(.leading,-30)
                      
                    }
                  } .frame(width: 70,height: 15)
                    .padding(.top,120)
                    .padding(.leading,-70)
                  
                  VStack{
                    Image("green_arrow")
                      .resizable()
                      .frame(width: 120,height: 15)
                    HStack{
                      Spacer()
                      Text("\(PuttingTempoGreenArrowValue) sec")
                        .font(Font.system(size: 11))
                        .foregroundColor(.black)
                        .rotationEffect(.degrees(-20))
                        
                    }
                    
                     
                  } .frame(width: 120,height: 15)
                    .padding(.top,10)
                    .padding(.leading,10)
                    
                  
                }
               
                
              },
              onTapped: {
                print("Header tapped!")
                isExpandingPutting.toggle()
                // Add your custom action here
              }
              
            )
            .cardBackgroundColor(.white)
            .shadow(shadowRadius: 0.0)
            .foregroundColor(.white)
            .padding(.bottom,15)
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
            
            //.dynamicCardHeight()
            //.listRowSeparator(.hidden)
            
            ///Loft Angle
            ExpandableView(
              headerSize: CGSize(width: 380.0, height: 50.0),
              cardSize: CGSize(width: 380.0, height: 200.0), header: {
                HStack {
                  Text("Loft Angle")
                    .font(.title3)
                  Spacer()
                  HStack(spacing : 20){
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "Determines the spin applied on the golf ball.(Forward/Backward)"
                            showTooltip()
                          }
                        }
                    }
                    VStack{
                      Text(loftAngleValue)
                        .font(.title3)
                        .padding(.horizontal,5)
                        .frame(width: 90)
                        .padding(.vertical,5)
                      
                    }.background(Color.appRed)
                    
                    Image(isExpandingLoft ? "ic_arrow_up" :"ic_arrow_down")
                      .resizable()
                      .frame(width: 15,height: 15 )
                  }
                  
                }
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
                
              }, content: {
                ZStack{
                  Image("ball1")
                    .resizable()
                   // .padding(10)
                  
                  HStack{
                    Text("\(loftAngleValueTxt + loftAngleDecreeTxt)\u{00B0}")
                      .font(Font.system(size: 15))
                      .bold()
                      .foregroundColor(.white)
                      .frame(width: 150,height: 80)
                      .padding(.top,10)
                      .padding(.leading,20)
                    Spacer()
                  }
                  
                  Image("golf_stick")
                    .resizable()
                    .frame(width: 50,height: 145)
                    .padding(.top, CGFloat(loftAngleStick))
                    .padding(.leading,-70)
                  
                  Image("ic_ball")
                    .resizable()
                    .frame(width: 80,height: 50)
                    .padding(.top,70)
                    .padding(.leading,50)
                }
                
              },
              onTapped: {
                print("Header tapped!")
                isExpandingLoft.toggle()
                // Add your custom action here
              }
            )
            .cardBackgroundColor(.white)
            .shadow(shadowRadius: 0.0)
            .foregroundColor(.white)
            .padding(.bottom,15)
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
            
            
            ///Putter Face Angle
            ExpandableView(
              headerSize: CGSize(width: 380.0, height: 50.0),
              cardSize: CGSize(width: 380.0, height: 200.0), header: {
                HStack {
                  Text("Putter Face Angle")
                    .font(.title3)
                  Spacer()
                  HStack(spacing : 20){
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "Determines if the face of putter is square, open or closed"
                            showTooltip()
                          }
                        }
                    }
                    VStack{
                      Text(putterFaceAngleValueTxt)
                        .font(.title3)
                        .padding(.horizontal,5)
                        .frame(width: 90)
                        .padding(.vertical,5)
                      
                    }.background(Color.appRed)
                    
                    Image(isExpandingPutterFaceAngle ? "ic_arrow_up" :"ic_arrow_down")
                      .resizable()
                      .frame(width: 15,height: 15 )
                  }
                  
                }
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
                
              }, content: {
                ZStack
                {
                  Image("ic_topview_bc")
                    .resizable()
                  //  .padding(10)
                  
                  HStack{
                    Text("\(putterFaceAngleDegreeTxt)+2\u{00B0}")
                      .font(Font.system(size: 19))
                      .bold()
                      .foregroundColor(.white)
                      .frame(width: 100,height: 80)
                      .padding(.top,PutterFaceAngleImgGolfStickXPosition)
                      .padding(.leading,PutterFaceAngleImgGolfStickYPosition)
                      .rotationEffect(.degrees(Double(PutterFaceAngleImgGolfStickRotation)))
                    Spacer()
                  }
                  
                  Image("put_stick")
                    .resizable()
                    .frame(width: 25,height: 140)
                    .padding(.top,40)
                    .padding(.leading,230)
                  
                  Image("ic_ball")
                    .resizable()
                    .frame(width: 60,height: 35)
                    .padding(.top,0)
                    .padding(.leading,50)
                }
                
                
              },
              onTapped: {
                print("Header tapped!")
                isExpandingPutterFaceAngle.toggle()
                // Add your custom action here
              }
            )
            .cardBackgroundColor(.white)
            .shadow(shadowRadius: 0.0)
            .foregroundColor(.white)
            .padding(.bottom,15)
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
            
            ///Putter Face Position
            ExpandableView(
              headerSize: CGSize(width: 380.0, height: 50.0),
              cardSize: CGSize(width: 380.0, height: 200.0), header: {
                HStack {
                  Text("Putter Face Position")
                    .font(.title3)
                  Spacer()
                  HStack(spacing : 20){
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "Determines the impact point difference from centre of putter"
                            showTooltip()
                          }
                        }
                    }
                           
                    VStack{
                      Text(putterFacePositionAngleValueTxt)
                        .font(.title3)
                        .padding(.horizontal,5)
                        .frame(width: 90)
                        .padding(.vertical,5)
                      
                    }.background(Color.appRed)
                    
                    Image(isExpandingPutterFacePoistion ? "ic_arrow_up" :"ic_arrow_down")
                      .resizable()
                      .frame(width: 15,height: 15 )
                  }
                  
                }
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
                
              }, content: {
                ZStack
                {
                  Image("ic_topview_bc")
                    .resizable()
                   // .padding(10)
                  
                  HStack{
                    Text("Face :Open : +2\u{00B0}")
                      .font(Font.system(size: 19))
                      .bold()
                      .foregroundColor(.white)
                      .frame(width: 160,height: 80)
                      .padding(.top,0)
                      .padding(.leading,20)
                    Spacer()
                  }
                  
                  Image("put_stick")
                    .resizable()
                    .frame(width: 25,height: 140)
                    .padding(.top,CGFloat(PutterPositionImgGolfStick))
                    .padding(.leading,230)
                  
                  Image("ic_ball")
                    .resizable()
                    .frame(width: 60,height: 35)
                    .padding(.top,0)
                    .padding(.leading,50)
                }
                
              },
              onTapped: {
                print("Header tapped!")
                isExpandingPutterFacePoistion.toggle()
                // Add your custom action here
              }
            )
            .cardBackgroundColor(.white)
            .shadow(shadowRadius: 0.0)
            .foregroundColor(.white)
            .padding(.bottom,15)
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
            
            
            ///Lie Angle
            ExpandableView(
              headerSize: CGSize(width: 380.0, height: 50.0),
              cardSize: CGSize(width: 380.0, height: 200.0), header: {
                HStack {
                  Text("Lie Angle")
                    .font(.title3)
                  Spacer()
                  HStack(spacing : 20){
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "Angle at which the putter is held with relation to the ground"
                            showTooltip()
                          }
                        }
                    }
                    VStack{
                      Text(lieAngleValueTxt)
                        .font(.title3)
                        .padding(.horizontal,5)
                        .frame(width: 90)
                        .padding(.vertical,5)
                      
                    }.background(Color.appRed)
                    
                    Image(isExpandinglieAngle ? "ic_arrow_up" :"ic_arrow_down")
                      .resizable()
                      .frame(width: 15,height: 15 )
                  }
                  
                }
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
                
              }, content: {
                ZStack
                {
                  Image("grass")
                    .resizable()
                   // .padding(10)
                 
                  HStack{
                    Text(lieAngleStart)
                      .font(Font.system(size: 14))
                      .bold()
                      .foregroundColor(.appPurple500)
                      .frame(width: 160,height: 80)
                      .padding(.top,120)
                      .padding(.leading,0)
                    Spacer()
                  }
                  Image("ic_lie_angle_new")
                    .resizable()
                    .frame(width: 120,height:120)
                    .padding(.top,0)
                    .padding(.leading,10)
                  
                  HStack{
                    Spacer()
                    Text(lieAngleImpact)
                      .font(Font.system(size: 14))
                      .bold()
                      .foregroundColor(.appPurple500)
                      .frame(width: 160,height: 80)
                      .padding(.top,120)
                      .padding(.leading,0)
                   
                  }
                }
                
              },
              onTapped: {
                print("Header tapped!")
                isExpandinglieAngle.toggle()
                // Add your custom action here
              }
            )
            .cardBackgroundColor(.white)
            .shadow(shadowRadius: 0.0)
            .foregroundColor(.white)
            .padding(.bottom,15)
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
            
            ///Acceleration Impact
            ExpandableView(
              headerSize: CGSize(width: 380.0, height: 50.0),
              cardSize: CGSize(width: 380.0, height: 200.0), header: {
                HStack {
                  Text("Acceleration Impact")
                    .font(.title3)
                  Spacer()
                  HStack(spacing : 20){
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "The acceleration determines the distance covered by the golf ball"
                            showTooltip()
                          }
                        }
                    }
                    VStack{
                      Text(accelerationImpactValueTxt)
                        .font(.title3)
                        .padding(.horizontal,5)
                        .frame(width: 90)
                        .padding(.vertical,5)
                      
                    }.background(Color.appRed)
                    
                    Image(isExpandingAccelerationImpact ? "ic_arrow_up" :"ic_arrow_down")
                      .resizable()
                      .frame(width: 15,height: 15 )
                  }
                  
                }
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
                
              }, content: {
                ZStack{
                  Image("ic_accel_at_impact")
                    .resizable()
                    .padding(.leading,-30)
                    .padding(.top,10)
                    .frame(width: 180,height: 200 )
                  HStack{
                    Text(accelerationImpactDegreeTxt)
                      .font(Font.system(size: 19))
                      .foregroundColor(.black)
                      .padding(.leading,50)
                    Spacer()
                    
                  }
                }
                
              },
              onTapped: {
                print("Header tapped!")
                isExpandingAccelerationImpact.toggle()
                // Add your custom action here
              }
            )
            .cardBackgroundColor(.white)
            .shadow(shadowRadius: 0.0)
            .foregroundColor(.white)
            .padding(.bottom,15)
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
            
          
        } .overlay(
          TooltipView(isVisible: $isTooltipVisible, message: $isTooltipText)
                    
        )
      
    
    
  }
  func showTooltip() {
          isTooltipVisible = true

          // Dismiss the tooltip after a certain duration (e.g., 3 seconds)
          DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
              withAnimation {
                  isTooltipVisible = false
              }
          }
      }
  
}

/*struct ExpandableListViewPreviews: PreviewProvider {
    static var previews: some View {
      ExpandableListView(PuttingTempoValue: $PuttingTempoValue, PuttingTempoRedArrowValue: <#Binding<Double>#>, PuttingTempoGreenArrowValue: <#Binding<Double>#>)
    }
}*/


struct TooltipView: View {
    @Binding var isVisible: Bool
    @Binding var message: String

    var body: some View {
        Label(
            title: { Text("\(message)") },
            icon: { Image(systemName: "info.circle") }
        )
        .padding()
        .background(Color.black)
        .foregroundColor(.white)
        .cornerRadius(8)
        .opacity(isVisible ? 1.0 : 0.0)
        .animation(.easeInOut)
        //.fixedSize()
        .padding([.top, .bottom], 5)
    }
}
