import {StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  title: {
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 30,
  },
  text: { color: "white", textAlign: "center", marginBottom: 15, fontSize: 13 },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    marginTop: 7,
    marginBottom: 7,
    backgroundColor: "lightgray",
    borderRadius: 8,
  },
  button: {
    justifyContent: "space-around",
    backgroundColor: "lightskyblue",
    padding: 10,
    marginTop: 10,
    borderColor: "dodgerblue",
    borderRadius: 8,
    alignItems: "center",
    margin: 12,
  },
  buttonText: {
    fontSize: 15,
  },
});
