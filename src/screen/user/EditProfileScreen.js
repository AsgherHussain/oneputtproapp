import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const EditProfileScreen = ({ navigation, route }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [newImage, setNewImage] = useState(/* Initial image or current user image */);
    const { updateProfileImage,userId } = route.params || {};
    const popAction = StackActions.pop(1);


console.log(userId,"userId5")
  const handleChooseImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 150,
        height: 150,
        cropping: true,
      });

      setSelectedImage({ uri: image.path });
    } catch (error) {
      console.error('Error choosing image:', error);
    }
  };
  const handleSave = async () => {
    try {
      if (selectedImage) {
        // Step 1: Upload the selected image to the server
        const formData = new FormData();
        formData.append('profile_image', {
          uri: selectedImage.uri,
          type: 'image/jpeg', // Adjust the type based on the selected image format
          name: 'profile_image.jpg', // You may want to set a unique name for each image
  
        });
  
        const uploadResponse = await fetch('http://185.146.166.147:21004/saveprofileimage', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }); 
  
        const uploadResult = await uploadResponse.json();

        if (uploadResult.status===200) {
   
        //   // Step 2: Update the user's profile image URL in the backend
        // // Replace this with the actual user ID
          const profileImageUrl = uploadResult.profile_image; // Use the URL returned from the upload
  
          const updateResponse = await fetch('http://185.146.166.147:21000/UserManagement/editprofileimage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              profile_image: profileImageUrl,
            }),
          });
  
          const updateResult = await updateResponse.json();
  
          if (updateResult.status===200) {
            // Update was successful
       
          } else {
            console.error('Error updating profile image:', updateResult.error);
          }
        } else {
          console.error('Error uploading image:', uploadResult.error);
        }
      }
  
      // Navigate back or close the modal
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  
  
  return (
    <View style={styles.container}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderBack}>
        <TouchableOpacity
          onPress={() =>  navigation.dispatch(popAction)}
          style={styles.headerText}>
           <MaterialCommunityIcons name="chevron-left" color="#fff" size={40} />
          <Text style={styles.sectionHeaderText}>Edit Profile</Text>
          <Text></Text>
        </TouchableOpacity>
        </View>
        </View>
    
     <View style={styles.subContainer}>
      <TouchableOpacity onPress={handleChooseImage}>
        <View style={styles.profileImageContainer}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.profileImage} />
          ) : (
            <Text style={styles.placeholderText}>Choose Image</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      </View>
      {/* Add other profile information and save button here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    height: '80%',
    width : '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 250,
    height: 250,
    borderRadius:150,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop : 50,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 150,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#991e21',
    padding: 10,
    borderRadius: 5,
    width: '50%'
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign : 'center'
  },
  placeholderText: {
    fontSize: 16,
    color: '#777777',
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically in the center
    padding: 10,
  },
  sectionHeaderBack:{
  // alignItems : 'center',
   justifyContent: 'space-between',
   top : 30
  },
  sectionHeaderText:{
    color:'#fff',
    fontSize: 22,
  },
  sectionHeader:{
    //flex: 1,
    alignSelf:'stretch',
    height : 80,
    backgroundColor : "#000000"
  },
  

});

export default EditProfileScreen;
