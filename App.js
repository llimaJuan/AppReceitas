import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet} from 'react-native'
import {StyleSheet,Text,View,TextInput,TouchableOpacity,SafeAreaView,ScrollView,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function App() {
  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');

  useEffect(()=>{
    const loadRecipes = async ()=>{
      try{
        const storedRecipes = await AsyncStorage.getItem('@recipes');
        if(storedRecipes !== null){
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e){
        console.error("Falha ao carregar receitas.", e);
      }
    };
    loadRecipes();
  }, []);
  // o array vazio fala para ele rodar o código apenas 1 vez quando o app abrir

  const handleAddRecipe = ()=>{
    if(!title){
      return;
    }
  }

  const newRecipe = {
    id: Date.now().toString(),
    title: title, //pega a variavel useState
    ingredients: ingredients,

    setRecipes(currentRecipes => [...currentRecipes, newRecipe]);
  setTitle('');
  setIngredients('');

  setView('lista')

  };

  const handleDeleteRecipe = (id)=>{
    setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== id));
  };

  return (
   <SafeAreaView style={StyleSheet.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Meu livro de receitas</Text>

      {view === 'lista'?(
        <View>
          <TouchableOpacity style={styles.addButton} onPress={()=>
            setView('formulario')}>
              <Text style={styles.buttonText}>Adicionar nova receita</Text>
          </TouchableOpacity>
          {recipes.length === 0?(
            <Text style={styles.emptyText}>Nenhuma receita cadastrada</Text>
          ):(
            recipes.map((item)=>(
              <View key={item.id}style={styles.recipeItem}>
                <View style={styles.recipeTextContainer}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                </View>
                <TouchableOpacity
                style={styles.deleteButton}
                onPress={()=> handleDeleteRecipe(item.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
        </View>
            ))
          )}
          </View>
      ):(
        <View style={styles.formContainer}>
    </ScrollView>
   </SafeAreaView>
  );
};