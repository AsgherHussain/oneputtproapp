/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import {dynamicFonts} from '../helpers/constants';

const {height} = Dimensions.get('screen');

const Circle = ({active, onPress, item, isHidden, isEven}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {!isHidden && (
        <View style={[styles.circle, active && styles.activeCircle]} />
      )}
      <Text
        style={[
          {
            position: 'absolute',
            width: 50,
            alignSelf: isEven ? 'flex-start' : 'flex-end',
            textAlign: isEven ? 'right' : 'left',
            fontWeight: '500',
            bottom: 0,
            fontSize: dynamicFonts.f14,
          },
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};
const SliderComp = ({value, option, setSliderValue, maxVal}) => {
  return (
    <View style={{alignItems: 'center', borderRadius: 12}}>
      <View style={styles.slider}>
        {option.map((i, index) => {
          return (
            <View
              key={JSON.stringify(i)}
              style={[
                styles.colorBox,
                {
                  backgroundColor: value >= i.value ? '#991e21' : '#000',
                  borderTopRightRadius:
                    index === 0 || value === i.value ? 12 : 0,
                  borderTopLeftRadius:
                    index === 0 || value === i.value ? 12 : 0,
                  width: '100%',
                  borderBottomLeftRadius: index + 1 === maxVal ? 12 : 0,
                  borderBottomRightRadius: index + 1 === maxVal ? 12 : 0,
                  alignItems: 'center',
                  height: height / 16,
                },
              ]}>
              <Circle
                active={value}
                onPress={() => setSliderValue(i.value)}
                item={i}
                isHidden={i.value < value}
                isEven={i.id % 2 === 0}
                isEnding={option.length === index}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'black',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  activeCircle: {
    backgroundColor: '#fff',
  },
  colorBox: {
    flex: 1,
    alignSelf: 'center',
    padding: 2,
  },
  slider: {
    width: 20,
    backgroundColor: '#000',
    borderRadius: 12,
  },
});

export default SliderComp;
