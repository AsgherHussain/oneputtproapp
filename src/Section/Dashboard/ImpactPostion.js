import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export function ImpactPostion() {
  return (
    <View style={styles.content}>
      <Text>ImpactPostion</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        backgroundColor: '#e5e4e2',
        elevation:2,
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})