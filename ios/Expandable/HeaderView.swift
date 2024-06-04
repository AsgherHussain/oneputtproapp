//
//  HeaderView.swift
//  SimpleExpandableView
//
//  
//

import SwiftUI

struct HeaderView<V: View>: View {
    
    let headerView: V
    
    let size: CGSize
    var cornerRadius: CGFloat = 1.0
    
    init(size: CGSize, @ViewBuilder header: () -> V) {
        self.headerView = header()
        self.size = size
    }
    
    var body: some View {
        ZStack {
            headerView
        }
        .frame(width: size.width, height: size.height)
        .cornerRadius(cornerRadius)
    }
}

extension HeaderView {
    func cornerRadius(_ radius: CGFloat) -> Self {
        var copied = self
        copied.cornerRadius = radius
        return self
    }
}
