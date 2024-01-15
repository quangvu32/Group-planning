import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity , Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles.js'
import * as server from '../../server/AuthService.js';

const NewProjectScreen = ({route, navigation}) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const { onProjectSubmit } = route.params;
  
    // const generateKeyWithTimestamp = () => {
    //   return new Date().getTime().toString();
    // };
  
    const handleCreate = () => {
      if (projectName.length){

      const newProject = { 
        id: '' ,
        title: projectName, 
        createdAt: new Date(),
        completionStatus: '',
        description: projectDescription, 
        Tasks: [], 
        members: [],
      }
      console.log('Project Created:',newProject);
      onProjectSubmit(newProject); 
      server.connectSocket(); 
      server.newProject(newProject);
      navigation.goBack(); 
     }

      else{
  
        Alert.alert(
          "Oops", 
          "Project name cannot be empty", 
            [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel"
            }
            ]
          );
        }
    
    };
  
    const handleCancel = () => {
      navigation.goBack(); 
      console.log('Creation Cancelled');
    };
  
    return (
      <View style={styles.container}>
       
        <TextInput
          style={styles.ProjectNameinput}
          placeholder="Enter project title"
          value={projectName}
          onChangeText={setProjectName}
        />
      
        <TextInput
          style={styles.Descriptioninput}
          placeholder="Descriptions"
          value={projectDescription}
          onChangeText={setProjectDescription}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreate} style={[styles.button, styles.createButton]}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default NewProjectScreen; 