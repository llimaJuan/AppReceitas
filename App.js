import { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';



export default function App() {

  return (
    <SafeAreaView style={styles.fundo}>
      <View>
        <Text style={styles.h1}>
          Chef's Choice
        </Text>
      </View>
      <View style={styles.linha}/>
      <View>
        <TextInput placeholder='Pesquisar receitas...' style={styles.abaPesquisa}/>
      </View>
      <View>
        <TouchableOpacity style={styles.botao}>
          <Text>
            Adicionar receita:
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao}>
          <Text>
            Deletar receita:
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fundo:{
    backgroundColor: 'white',
    flex: 1
  },
  h1:{
    fontWeight: 'bold',
    textAlign: 'center'
},
abaPesquisa:{
  borderWidth: 1,
  borderColor: 'grey',
  borderRadius: 8,
  width: 370,
  height: 40,
  alignSelf: 'center'
},
linha: {
  borderBottomColor: 'gray',
  borderBottomWidth: StyleSheet.hairlineWidth,
  marginBottom: 10,
},
botao:{
  backgroundColor: '#9de0ad',
}
});