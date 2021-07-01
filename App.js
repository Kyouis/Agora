import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import * as ScreenOrientation from 'expo-screen-orientation';
import Projet from "./Localisation/Projet";
import Parcelle from "./Localisation/Parcelle";
import Adresse from "./Localisation/Adresse";
import Emplacement from "./Localisation/Emplacement";
import Segment from "./Localisation/Segment";
import Compartiment from "./Localisation/Compartiment";
import {OrientationLock} from "expo-screen-orientation";
import * as SQLite from 'expo-sqlite';
import { StatusBar } from "react-native";

const tab = createBottomTabNavigator();
const db = SQLite.openDatabase('Agora');

const createDB = () => {
db.transaction( (tx) => {
    tx.executeSql("CREATE TABLE IF NOT EXISTS PROJET  (idProjet INTEGER PRIMARY KEY AUTOINCREMENT, nomProjet TEXT, dateProjet TEXT, nomAuteur TEXT, prenomAuteur TEXT, organisme TEXT);");
    tx.executeSql("CREATE TABLE IF NOT EXISTS PARCELLE (idParcelle INTEGER PRIMARY KEY AUTOINCREMENT, section TEXT, numParcelle TEXT, idProjet INTEGER, FOREIGN KEY (idProjet) REFERENCES PROJET(idProjet));");
    tx.executeSql("CREATE TABLE IF NOT EXISTS ADRESSE (idAdresse INTEGER PRIMARY KEY AUTOINCREMENT, numero INTEGER, rue TEXT, codePostal INTEGER, ville TEXT, idParcelle INTEGER, FOREIGN KEY (idParcelle) REFERENCES PARCELLE(idParcelle));");
    tx.executeSql("CREATE TABLE IF NOT EXISTS EMPLACEMENT (idEmp INTEGER PRIMARY KEY AUTOINCREMENT, idParcelle INTEGER, codeEmplacement TEXT, niveauInfMax INTEGER, niveauSupMax INTEGER, typeEmplacement TEXT, FOREIGN KEY (idParcelle) REFERENCES PARCELLE(idParcelle));");
    tx.executeSql("CREATE TABLE IF NOT EXISTS SEGMENT (idSegment INTEGER PRIMARY KEY AUTOINCREMENT, idEmp INTEGER, codeSegment TEXT, numeroNiveau INTEGER, demiNiveau INTEGER, typeSegment TEXT, FOREIGN KEY (idEmp) REFERENCES EMPLACEMENT(idEmp));");
    tx.executeSql("CREATE TABLE IF NOT EXISTS COMPARTIMENT (idComp INTEGER PRIMARY KEY AUTOINCREMENT, idSegment INTEGER, codeCompartiment TEXT, refLocalisation TEXT, surfaceAuSol REAL, typeCompartiment TEXT, idAdresse INTEGER, FOREIGN KEY (idSegment) REFERENCES  SEGMENT(idSegment), FOREIGN KEY (idAdresse) REFERENCES ADRESSE(idAdresse));");
}, (e) => console.log(e))
};

const App = () => {
    ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE);
    StatusBar.setHidden(true);
    createDB();
  return (
      <NavigationContainer>
        <tab.Navigator>
            <tab.Screen name="Projet" component={Projet} />
            <tab.Screen name="Parcelle" component={Parcelle} />
            <tab.Screen name="Adresse" component={Adresse} />
            <tab.Screen name="Emplacement" component={Emplacement} />
            <tab.Screen name="Segment" component={Segment} />
            <tab.Screen name="Compartiment" component={Compartiment} />
        </tab.Navigator>
      </NavigationContainer>

  );
}

export default App;
