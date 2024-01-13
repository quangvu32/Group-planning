import io from 'socket.io-client';
import React from 'react';

const AuthContext = React.createContext({
  loggedIn: false,
  login: () => {loggedIn = true; },
  logout: () => {loggedIn = false; },
});

export default AuthContext;

let socket; // Declare socket variable at the module level to maintain its scope

export const connectSocket = () => {
  console.log("Attempting to connect to server...");
  // change the ip address according to your device 
  socket = io('https://groupplanning-26349a3e30f0.herokuapp.com'); 

  socket.on('connect', () => {
    console.log('Connected to server');
  });
  return socket;
};

export const signup = (username, email, password) => { 
  if (!socket) {
    console.warn("Socket not connected");
    return;
  }
  let unique ;
  socket.emit('checkUnique', username); 

  socket.on('UsernameUnique', async (isunique) =>{ 
    unique= isunique; 
  
  
  if (unique){
    
    socket.emit('signup', username, email, password);
    socket.on('serverLog', (text) => {
    console.log(unique)
    console.log(text);
  });
  }
  else{
    socket.on('usernametaken', (text) => {
        console.log(unique)
        console.log(text)
    });
  }
}); 
  
};

export const newProject = (projectName) => {
  if (!socket) {
    console.warn("Socket not connected");
    reject("Socket not connected");
    return;
  }
  console.log(projectName);
  socket.emit('newProject', projectName);
  socket.on('serverLog', (text) => {
    console.log(text);
  });
}



export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      console.warn("Socket not connected");
      reject("Socket not connected");
      return;
    }

    const onUsernameUnique = (isUnique) => {
      if (!isUnique) {
        socket.emit('login', username, password);
      } else {
        console.log("Account doesn't exist");
        reject("Account doesn't exist");
        socket.off('UsernameUnique', onUsernameUnique);
      }
    };

    const LoginState = (text) => {
      console.log(text); 
      if (text.success) {
        resolve(true);
      } else {
        reject(text.message);
      }
      socket.off('LoginState', LoginState);
    };
    socket.emit('checkUnique', username); 
    socket.on('UsernameUnique', onUsernameUnique);
    socket.on('LoginState', LoginState );

    
  });
};


export const getSocket = () => {
  return socket; // Return the socket instance
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket...");
    socket.disconnect();
  }
};
