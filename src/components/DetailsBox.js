import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {dynamicFonts} from '../helpers/constants';

const {width, height} = Dimensions.get('screen');

const DetailsBox = ({heading = 'Heading', value, subHeading = 'inches'}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>{heading}</Text>
      <Text style={styles.valueText}>
        {value} <Text style={styles.subHeadingText}>{subHeading}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 3.5,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#e3e2e1',
    height: height / 11,
    justifyContent: 'space-between',
  },
  headingText: {
    fontSize: dynamicFonts.f14,
    fontWeight: '300',
  },
  valueText: {
    fontSize: dynamicFonts.h,
    fontWeight: '600',
  },
  subHeadingText: {
    fontSize: dynamicFonts.f14,
    fontWeight: '300',
  },
});

export default DetailsBox;
