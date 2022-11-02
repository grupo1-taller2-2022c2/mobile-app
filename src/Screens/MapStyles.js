import {StyleSheet, Dimensions} from "react-native"
const { width, height } = Dimensions.get("window");

export const map_styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    map_container: {
      justifyContent: "flex-start",
    },
    map: {
      width: width,
      height: height * 0.75,
    },
    title: {
      color: "black",
      marginBottom: 10,
      fontSize: 25,
    },
    button: {
      justifyContent: "space-around",
      backgroundColor: "lightskyblue",
      padding: 10,
      borderColor: "dodgerblue",
      borderRadius: 8,
      alignItems: "center",
      margin: 12,
      marginLeft: 0,
    },
    buttonText: {
      fontSize: 15,
    },
    input: {
      margin: 12,
      marginLeft: 0,
      padding: 10,
      backgroundColor: "lightgray",
      borderRadius: 8,
      flex: 1,
    },
  });
  
export const modal_styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      justifyContent: "space-around",
      backgroundColor: "lightskyblue",
      padding: 10,
      borderColor: "dodgerblue",
      borderRadius: 8,
      alignItems: "center",
      margin: 12,
      marginLeft: 0,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 20,
    },
  });
  