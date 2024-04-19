import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Lobby from './screens/Lobby';
import Main from './screens/Main';
import Home from './screens/Home';
import Settings from './screens/Settings';
import PasswordChange from './screens/PasswordChange';
import PasswordRecover from './screens/PasswordRecover';
import { WebSocketProvider } from './WebsocketContext';
import { I18nProvider } from './I18nContext';
import { ThemeProvider } from './ThemeContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Using Math.random']);

const Stack = createNativeStackNavigator();

export default function app() {

  return (
    <ThemeProvider>
      <I18nProvider>
        <WebSocketProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name='Login'
                component={Login}
              />
              <Stack.Screen
                name='Register'
                component={Register}
              />
              <Stack.Screen
                name='Home'
                component={Home}
                options={{
                  headerBackVisible: false
                }}
              />
              <Stack.Screen
                name='Lobby'
                component={Lobby}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={{
                  title: 'Main',
                  headerShown: false
                }}
              />
              <Stack.Screen
                name='Settings'
                component={Settings}
              />
              <Stack.Screen
                name='PasswordChange'
                component={PasswordChange}
                options={{
                  title: 'Change Password'
                }}
              />
              <Stack.Screen
                name='PasswordRecover'
                component={PasswordRecover}
                options={{
                  title: 'Forgot Password'
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </WebSocketProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
