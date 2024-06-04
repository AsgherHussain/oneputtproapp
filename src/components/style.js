import {Dimensions} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {dynamicFonts, fontSize} from '../helpers/constants';
import colors from '../styles/colors';

const {width} = Dimensions.get('screen');

export default ScaledSheet.create({
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHTGREY,
    maxWidth: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '45@ms',
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.LIGHTGREY,
    color: colors.BLACK,
    fontSize: dynamicFonts.f16,
  },
});
