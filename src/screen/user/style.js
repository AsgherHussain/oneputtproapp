import {Dimensions} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {dynamicFonts} from '../../helpers/constants';
import colors from '../../styles/colors';
const {height} = Dimensions.get('screen');

export default ScaledSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.RED,
    // flexGrow: 1,
  },
  inputField: {
    borderRadius: 4,
    backgroundColor: colors.LIGHTGREY,
  },
  ImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: '30%',
  },
  Image: {
    width: height / 6,
    height: height / 6.4,
    resizeMode: 'cover',
  },
  lockImage: {
    width: '140@ms',
    height: '90@mvs',
  },
  ImageText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.WHITE,
  },
  inputWrapper: {
    marginBottom: 15,
    height: height / 22,
  },
  primaryBtn: {
    width: '100%',
    padding: 13,
    borderRadius: 4,
    backgroundColor: colors.RED,
  },
  primaryBtnTxt: {
    color: colors.WHITE,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: dynamicFonts.f16,
  },
  forgotText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomText: {
    textAlign: 'center',
    fontWeight: 600,
    marginTop: 20,
    color: colors.BLACK,
    fontSize: dynamicFonts.f14,
  },
  backBtn: {
    color: colors.DARKGREY,
    padding: 20,
    fontSize: 16,
  },
  formActions: {
    marginVertical: 10,
  },
});
