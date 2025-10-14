import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CampaignsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaigns</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});