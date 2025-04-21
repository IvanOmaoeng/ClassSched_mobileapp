import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import StudentLoginScreen from './screens/StudentLoginScreen';
import StudentRegisterScreen from './screens/StudentRegisterScreen';
import InstructorLoginScreen from './screens/InstructorLoginScreen';
import InstructorRegisterScreen from './screens/InstructorRegisterScreen';
import VerificationScreen from './screens/VerificationScreen';
import ChooseYourInstituteScreen from './screens/ChooseYourInstituteScreen';
import MainScreen from './screens/MainScreen';
import ManageProfileScreen from './screens/ManageProfileScreen';
import RoomsScreen from './screens/RoomsScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import NewBuildingScreen from './screens/NewBuildingScreen'; 
import OldBuildingScreen from './screens/OldBuildingScreen'; 
import InstructorLogs from './screens/InstructorLogs';
import './firebaseConfig';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={
        {
          headerShown: false,
        }
      }
      initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="StudentRegister" component={StudentRegisterScreen} />
        <Stack.Screen name="InstructorLogin" component={InstructorLoginScreen} />
        <Stack.Screen name="InstructorRegister" component={InstructorRegisterScreen} />
        <Stack.Screen name="EmailVerificationScreen" component={EmailVerificationScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="ChooseYourInstitute" component={ChooseYourInstituteScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="ManageProfile" component={ManageProfileScreen}/>
        <Stack.Screen name="RoomsScreen" component={RoomsScreen}/>
        <Stack.Screen name="NewBuildingScreen" component={NewBuildingScreen}/>
        <Stack.Screen name="OldBuildingScreen" component={OldBuildingScreen}/>
        <Stack.Screen name="InstructorLogs" component={InstructorLogs} />

      </Stack.Navigator>
    </NavigationContainer>

    
  );
}