import React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Circle, Svg} from 'react-native-svg';
import {dynamicFonts} from '../helpers/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';

const {height} = Dimensions.get('screen');
const CircularProgressComp = ({
  width = 250,
  size = 250,
  fill = 0,
  containerHeight = height / 4,
  isSmall,
}) => {
  const fillActualValue = fill;
  let icon = '';
  let color = '';
  let txt = '';

  if (fillActualValue >= 50) {
    icon = 'thumbs-up';
    color = '#2ad15c';
    txt = 'Good';
  } else if (fillActualValue >= 30 && fillActualValue < 50) {
    icon = 'sad-cry';
    color = '#FBC814';
    txt = 'Weak';
  } else {
    icon = 'heart-broken';
    color = colors.RED;
    txt = 'Not Good';
  }
  return (
    <View
      style={[
        styles.container,
        {
          height: isSmall ? containerHeight / 2 : containerHeight,
        },
      ]}>
      <AnimatedCircularProgress
        size={width}
        width={size}
        duration={0}
        fill={fill}
        tintColor={color}
        backgroundColor="#e5e4e2"
        arcSweepAngle={180}
        rotation={270}
        renderCap={({center}) => (
          <Svg style={{zIndex: 1, overflow: 'visible', padding: 10}}>
            <Circle
              cx={center.x}
              cy={center.y}
              r="12"
              fill={color}
              stroke="#fff"
              strokeWidth={3}
              strokeOpacity={0.6}
            />
          </Svg>
        )}>
        {fillValue => (
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.fillText,
                {
                  fontSize: isSmall ? dynamicFonts.h2 : dynamicFonts.h42,
                },
              ]}>
              {fillValue.toFixed(0) + '%'}
            </Text>
            <View style={[styles.goodTextContainer]}>
              <Text
                style={[
                  styles.goodText,
                  {
                    color,
                    fontSize: isSmall ? dynamicFonts.f18 : dynamicFonts.h30,
                  },
                ]}>
                {txt}
              </Text>
              {color === '#2ad15c' ? (
                <FontAwesome
                  name={icon}
                  size={isSmall ? 20 : 24}
                  color={color}
                  style={styles.icon}
                />
              ) : (
                <FontAwesome5
                  name={icon}
                  size={isSmall ? 20 : 24}
                  color={color}
                  style={styles.icon}
                />
              )}
            </View>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  circleContainer: {zIndex: 1, elevation: 2},
  textContainer: {
    position: 'absolute',
    top: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillText: {
    fontSize: dynamicFonts.h42,
    fontWeight: 'bold',
    color: '#000000',
  },
  goodTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  goodText: {
    fontSize: dynamicFonts.h30,
    fontWeight: '600',
    marginRight: 4,
  },
  icon: {
    marginLeft: 4,
  },
});

export default CircularProgressComp;
