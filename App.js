import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function App() {
  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparationMethod, setPreparationMethod] = useState('');
  // 1. NOVO ESTADO: Armazena a receita que está sendo editada (ou null)
  const [editingRecipe, setEditingRecipe] = useState(null); 

  // Carregar receitas ao iniciar o app
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('@recipes');
        if (storedRecipes !== null) {
          const loadedRecipes = JSON.parse(storedRecipes);
          setRecipes(loadedRecipes.map(recipe => ({
            ...recipe,
            preparationMethod: recipe.preparationMethod || '', 
          })));
        }
      } catch (e) {
        console.error("Falha ao carregar receitas.", e);
      }
    };
    loadRecipes();
  }, []);

  // Salvar receitas toda vez que o estado 'recipes' for alterado
  useEffect(() => {
    const saveRecipes = async () => {
      try {
        await AsyncStorage.setItem('@recipes', JSON.stringify(recipes));
      } catch (e) {
        console.error("Falha ao salvar receitas.", e);
      }
    };
    saveRecipes();
  }, [recipes]);


  // Função para Limpar o Formulário (Usada em Cancelar e Adicionar)
  const clearForm = () => {
    setTitle('');
    setIngredients('');
    setPreparationMethod('');
    setEditingRecipe(null); // Limpa a receita em edição
    setView('lista');
  };

  // Função para começar a editar uma receita
  const handleEditStart = (recipe) => {
    // 3. Preenche os estados com os dados da receita
    setEditingRecipe(recipe);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setPreparationMethod(recipe.preparationMethod);
    // Muda para a view de formulário
    setView('formulario'); 
  };
  
  // Função para ADICIONAR uma nova receita
  const handleAddRecipe = () => {
    if (!title || !ingredients || !preparationMethod) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      title: title,
      ingredients: ingredients,
      preparationMethod: preparationMethod,
    };

    setRecipes(currentRecipes => [...currentRecipes, newRecipe]);
    clearForm();
  };

  // Função para SALVAR EDIÇÃO de uma receita existente
  const handleSaveEdit = () => {
    if (!title || !ingredients || !preparationMethod) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    const updatedRecipe = {
      // Mantém o ID original da receita em edição
      id: editingRecipe.id, 
      title: title,
      ingredients: ingredients,
      preparationMethod: preparationMethod,
    };

    // Mapeia o array de receitas, substitui a receita editada pelo novo objeto
    setRecipes(currentRecipes => 
      currentRecipes.map(recipe => 
        recipe.id === editingRecipe.id ? updatedRecipe : recipe
      )
    );

    Alert.alert('Sucesso', 'Receita atualizada com sucesso!');
    clearForm();
  };
  
  const handleDeleteRecipe = (id) => {
    setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== id));
  };


  // Define qual função de salvar deve ser usada (Adicionar ou Editar)
  const handleFormSubmit = editingRecipe ? handleSaveEdit : handleAddRecipe;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Meu livro de receitas 🍲</Text>

        {view === 'lista' ? (
          <View>
            <TouchableOpacity style={styles.addButton} onPress={() =>
              setView('formulario')}>
              <Text style={styles.buttonText}>Adicionar nova receita</Text>
            </TouchableOpacity>
            {recipes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma receita cadastrada</Text>
            ) : (
              recipes.map((item) => (
                <View key={item.id} style={styles.recipeItem}>
                  <View style={styles.recipeTextContainer}>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                    
                    <Text style={styles.recipeSubtitle}>Ingredientes:</Text>
                    <Text style={styles.recipeText}>{item.ingredients}</Text>
                    
                    <Text style={styles.recipeSubtitle}>Modo de preparo:</Text>
                    <Text style={styles.recipeText}>{item.preparationMethod}</Text>
                  </View>
                  <View style={styles.recipeActions}>
                     {/* 5. BOTÃO EDITAR */}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => handleEditStart(item)}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                     {/* BOTÃO EXCLUIR */}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteRecipe(item.id)}>
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
           // FORMULÁRIO (Usado para Adicionar e Editar)
          <View style={styles.formContainer}>
            {/* 6. Título dinâmico no formulário */}
            <Text style={styles.formHeader}>
              {editingRecipe ? 'Editar Receita' : 'Adicionar Receita'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Título da receita'
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder='Ingredientes'
              value={ingredients}
              onChangeText={setIngredients}
              multiline={true}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder='Modo de Preparo'
              value={preparationMethod}
              onChangeText={setPreparationMethod}
              multiline={true}
            />
            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.formButton, styles.cancelButton]}
                onPress={clearForm}> 
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.formButton, styles.saveButton]}
                onPress={handleFormSubmit}> {/* Usa a função dinâmica */}
                <Text style={styles.buttonText}>Salvar Edição</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#e67e22',
  },
  // Formulário
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  // Lista
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recipeTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 10,
    marginBottom: 3,
  },
  recipeText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  recipeActions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 8, // Espaço entre os botões
  },
  editButton: {
    backgroundColor: '#f39c12', // Cor para o botão Editar
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
});