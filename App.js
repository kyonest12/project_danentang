import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { store } from "./src/Redux/store";
import { Provider } from "react-redux";
import AppNavigator from './src/Screens/AppNavigator';

console.disableYellowBox = true;
LogBox.ignoreLogs(['Warning: ...'])
LogBox.ignoreAllLogs()
//*/
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}