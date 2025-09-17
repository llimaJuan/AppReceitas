import { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-web';


export default function App() {

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.h1}>
          Chef's Choice
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
h1:{
  fontWeight: 'bold',
}
});