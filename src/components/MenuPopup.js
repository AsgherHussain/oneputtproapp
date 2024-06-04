import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Entypo';
import {dynamicFonts} from '../helpers/constants';

const CustomMenu = ({iconName, options = [], onAction}) => {
  const menuRef = useRef();

  const openMenu = () => {
    menuRef.current.open();
  };

  return (
    <Menu ref={menuRef} onSelect={value => onAction(value)} style={styles.menu}>
      <MenuTrigger customStyles={styles.menuTrigger}>
        <TouchableOpacity onPress={openMenu}>
          <Icon name={iconName} size={18} color={colors.RED} />
        </TouchableOpacity>
      </MenuTrigger>
      <MenuOptions customStyles={styles.menuOptions}>
        {options.map(item => (
          <MenuOption key={item.id} value={item.id}>
            <View style={styles.optionContainer}>
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={18}
                  color={colors.RED}
                  style={styles.optionIcon}
                />
              )}
              <Text style={styles.optionText}>{item.title}</Text>
            </View>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  menu: {
    padding: 4,
  },
  menuTrigger: {
    // Add custom styles for MenuTrigger if needed
  },
  menuOptions: {
    // Add custom styles for MenuOptions if needed
  },
  optionContainer: {
    padding: 4,
    flexDirection: 'row',
    borderRadius: 4,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    color: 'red',
    fontSize: dynamicFonts.f16,
  },
});

export default CustomMenu;
