import {Dimensions} from 'react-native';

const {height} = Dimensions.get('screen');
export const fontSize = {
  h1: 30,
  h3: 22,
  h6: 16,
  p1: 15,
  p: 12,
};

export const dynamicFonts = {
  h42: height * 0.042,
  h30: height * 0.03,
  h: height * 0.028,
  h1: height * 0.026,
  h2: height * 0.022,
  f20: height * 0.02,
  f18: height * 0.018,
  f16: height * 0.016,
  f14: height * 0.014,
  f12: height * 0.012,
};
