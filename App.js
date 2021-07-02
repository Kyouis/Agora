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
import { createStackNavigator } from '@react-navigation/stack';
import ProjetAdd from "./Localisation/ProjetAdd";
import ParcelleAdd from "./Localisation/ParcelleAdd";
import AdresseAdd from "./Localisation/AdresseAdd";
import EmplacementAdd from "./Localisation/EmplacementAdd";
import SegmentAdd from "./Localisation/SegmentAdd";

const tab = createBottomTabNavigator();
const stackProjet = createStackNavigator();
const stackParcelle = createStackNavigator();
const stackAdresse = createStackNavigator();
const stackEmplacement = createStackNavigator();
const stackSegment = createStackNavigator();
const stackCompartiment = createStackNavigator();

const db = SQLite.openDatabase('Agora');

const createDB = () => {
    db.transaction( (tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS PROJET  (idProjet INTEGER PRIMARY KEY AUTOINCREMENT, nomProjet TEXT, dateProjet TEXT, nomAuteur TEXT, prenomAuteur TEXT, organisme TEXT);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS PARCELLE (idParcelle INTEGER PRIMARY KEY AUTOINCREMENT, section TEXT, numParcelle TEXT, idProjet INTEGER, FOREIGN KEY (idProjet) REFERENCES PROJET(idProjet));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS ADRESSE (idAdresse INTEGER PRIMARY KEY AUTOINCREMENT, numero INTEGER, rue TEXT, codePostal INTEGER, ville TEXT, idParcelle INTEGER, FOREIGN KEY (idParcelle) REFERENCES PARCELLE(idParcelle));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS EMPLACEMENT (idEmp INTEGER PRIMARY KEY AUTOINCREMENT, idParcelle INTEGER, codeEmplacement TEXT, niveauInfMax INTEGER, niveauSupMax INTEGER, typeEmplacement TEXT, FOREIGN KEY (idParcelle) REFERENCES PARCELLE(idParcelle));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS SEGMENT (idSegment INTEGER PRIMARY KEY AUTOINCREMENT, idEmp INTEGER, codeSegment TEXT, numeroNiveau INTEGER, demiNiveau INTEGER, typeSegment TEXT, FOREIGN KEY (idEmp) REFERENCES EMPLACEMENT(idEmp));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS COMPARTIMENT (idComp INTEGER PRIMARY KEY AUTOINCREMENT, idSegment INTEGER, codeCompartiment TEXT, refLocalisation TEXT, surfaceAuSol REAL, typeCompartiment TEXT, idAdresse INTEGER, FOREIGN KEY (idSegment) REFERENCES  SEGMENT(idSegment), FOREIGN KEY (idAdresse) REFERENCES ADRESSE(idAdresse));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS CURRENTDATA (currentProjet TEXT, currentParcelle TEXT, currentAdresse TEXT, currentEmp TEXT, currentSef TEXT, currentComp TEXT)");
        tx.executeSql("CREATE TRIGGER IF NOT EXISTS dataOneRow BEFORE INSERT ON CURRENTDATA WHEN (SELECT COUNT(*) FROM CURRENTDATA) >=1 BEGIN SELECT RAISE(FAIL, 'un seul row'); END;");
    }, (e) => console.log(e));
    db.transaction((tx) => {
        tx.executeSql("INSERT INTO  CURRENTDATA VALUES ('', '', '', '', '', '');");
    }, (e) => console.log(e));
};


const ProjetStackScreen = () => {
    return (
        <stackProjet.Navigator>
            <stackProjet.Screen name="Projets" component={Projet} />
            <stackProjet.Screen name="Ajout de Projet" component={ProjetAdd} />
        </stackProjet.Navigator>
    );
}

const ParcelleStackScreen = () => {
    return (
        <stackParcelle.Navigator>
            <stackProjet.Screen name="Parcelles" component={Parcelle} />
            <stackProjet.Screen name="Ajout de Parcelle" component={ParcelleAdd} />
        </stackParcelle.Navigator>
    );
}

const AdresseStackScreen = () => {
    return (
        <stackAdresse.Navigator>
            <stackProjet.Screen name="Adresses" component={Adresse} />
            <stackProjet.Screen name="Ajout d'adresse" component={AdresseAdd} />
        </stackAdresse.Navigator>
    );
}

const EmplacementStackScreen = () => {
    return (
        <stackEmplacement.Navigator>
            <stackProjet.Screen name="Emplacements" component={Emplacement} />
            <stackProjet.Screen name="Ajout d'emplacement" component={EmplacementAdd} />
        </stackEmplacement.Navigator>
    );
}

const SegmentStackScreen = () => {
    return (
        <stackSegment.Navigator>
            <stackProjet.Screen name="Segments" component={Segment} />
            <stackProjet.Screen name="Ajout de segment" component={SegmentAdd} />
        </stackSegment.Navigator>
    );
}

const CompartimentStackScreen = () => {
    return (
        <stackCompartiment.Navigator>
            <stackProjet.Screen name="Compartiments" component={Compartiment} />
            <stackProjet.Screen name="Ajout de compartiment" component={CompartimentStackScreen} />
        </stackCompartiment.Navigator>
    );
}
const App = () => {
    ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE);
    StatusBar.setHidden(true);
    createDB();
    return (
        <NavigationContainer>
            <tab.Navigator>
                <tab.Screen name="Projet" component={ProjetStackScreen} />
                <tab.Screen name="Parcelle" component={ParcelleStackScreen} />
                <tab.Screen name="Adresse" component={AdresseStackScreen} />
                <tab.Screen name="Emplacement" component={EmplacementStackScreen} />
                <tab.Screen name="Segment" component={SegmentStackScreen} />
                <tab.Screen name="Compartiment" component={CompartimentStackScreen} />
            </tab.Navigator>
        </NavigationContainer>

    );
}

export default App;
