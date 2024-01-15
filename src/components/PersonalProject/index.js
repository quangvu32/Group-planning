import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles.js'
import * as server from '../../server/AuthService.js';


const getRelativeTime = (date) => {
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  else if (minutes < 60) return `${minutes} minutes ago`;
  else if (hours < 24) return `${hours} hours ago`;
  else return `${days} days ago`;
};

const PersonalProject = ({ navigation }) => {
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    storeProjects(projects);
  }, [projects]);



  const storeProjects = async (projects) => {
    try {
      const tasksString = JSON.stringify(projects);
      await AsyncStorage.setItem('Projects', tasksString);
    } catch (e) {
      console.error("Error saving tasks", e);
    }
  };
  

  const loadProjects = async () => {
    try {
      server.connectSocket();
      server.getProjects().then((projects) => {
        setProjects(projects);
      });
      const localProjects = await AsyncStorage.getItem('Projects');
      if (localProjects !== null) {
        setProjects(JSON.parse(localProjects));
      }
    } catch (e) {
      console.error("Error loading tasks", e);
    }
  };


  const handleNewProjects = (newProject) => {
    setProjects([...projects, newProject]);
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleUpdateProjects = (id, newProjectcompletion) => {
    console.log(newProjectcompletion); 
    const updatedproject = projects.map(project => {
      if (project.id === id) {
        return { ...project, completionStatus: newProjectcompletion };
      }
      return project;
    });
    setProjects(updatedproject);
  };


  const handleDeleteProjects = (id) => {
    const updatedproject = projects.filter(project => project.id !== id);
    setProjects(updatedproject);
    server.connectSocket(); 
    server.deleteProject(id);
  }

  const handleNewProject = () => {
    navigation.navigate('NewProject', {
      onProjectSubmit: handleNewProjects,
    });
   
  };

  const handleProject = (project) => {
    navigation.navigate("todolist", {
      Current_project: project , 
      Project_id: project.id, 
      onNewTaskCompletion: handleUpdateProjects,
      onProjectDelete: handleDeleteProjects,
    }); 
   
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.projectCount}>You have {projects.length} projects</Text>
        {projects.map((project, index) => (
        <TouchableOpacity 
          key={project.id} 
          style={styles.projectCard} 
          
          onPress={() => handleProject(project)}
        >
          <View style={[styles.projectIcon, { backgroundColor: getRandomColor() }]} />
          <View style={styles.projectDetails}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectTimestamp}>{getRelativeTime(new Date(project.createdAt))}</Text>
            <Text style={styles.projectCompletion}>{project.completionStatus}</Text>
          </View>
        </TouchableOpacity>
      ))}
        <TouchableOpacity style={styles.newProjectButton} onPress={handleNewProject}>
          <Text style={styles.newProjectButtonText}>+ New Project</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


export default PersonalProject;