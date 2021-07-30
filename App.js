import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
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
import CompartimentAdd from "./Localisation/CompartimentAdd";
import Designation from "./Designation/Designation";
import Garde from "./Garde";
import About from "./About";

const tab = createBottomTabNavigator();
const stackProjet = createStackNavigator();
const stackParcelle = createStackNavigator();
const stackAdresse = createStackNavigator();
const stackEmplacement = createStackNavigator();
const stackSegment = createStackNavigator();
const stackCompartiment = createStackNavigator();
const DesignationStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Acc = createStackNavigator();
const db = SQLite.openDatabase('Agora');

const createDB = () => {
    db.transaction( (tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS PROJET  (idProjet INTEGER PRIMARY KEY AUTOINCREMENT, nomProjet TEXT, dateProjet TEXT, nomAuteur TEXT, prenomAuteur TEXT, organisme TEXT);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS PARCELLE (idParcelle INTEGER PRIMARY KEY AUTOINCREMENT, section TEXT, numParcelle TEXT, idProjet INTEGER, FOREIGN KEY (idProjet) REFERENCES PROJET(idProjet) ON DELETE CASCADE );");
        tx.executeSql("CREATE TABLE IF NOT EXISTS ADRESSE (idAdresse INTEGER PRIMARY KEY AUTOINCREMENT, numero INTEGER, rue TEXT, codePostal INTEGER, ville TEXT, idParcelle INTEGER, FOREIGN KEY (idParcelle) REFERENCES PARCELLE(idParcelle) ON DELETE CASCADE);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS EMPLACEMENT (idEmp INTEGER PRIMARY KEY AUTOINCREMENT, idParcelle INTEGER, codeEmplacement TEXT, niveauInfMax INTEGER, niveauSupMax INTEGER, typeEmplacement TEXT, FOREIGN KEY (idParcelle) REFERENCES PARCELLE(idParcelle) ON DELETE CASCADE);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS SEGMENT (idSegment INTEGER PRIMARY KEY AUTOINCREMENT, idEmp INTEGER, codeSegment TEXT, numeroNiveau INTEGER, demiNiveau INTEGER, typeSegment TEXT, FOREIGN KEY (idEmp) REFERENCES EMPLACEMENT(idEmp) ON DELETE CASCADE);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS COMPARTIMENT (idComp INTEGER PRIMARY KEY AUTOINCREMENT, idSegment INTEGER, codeCompartiment TEXT, refLocalisation TEXT, surfaceAuSol REAL, typeCompartiment TEXT, idAdresse INTEGER, FOREIGN KEY (idSegment) REFERENCES  SEGMENT(idSegment) ON DELETE CASCADE, FOREIGN KEY (idAdresse) REFERENCES ADRESSE(idAdresse) ON DELETE CASCADE);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS ELEMENT (idElem INTEGER PRIMARY KEY AUTOINCREMENT , nom TEXT, strate TEXT, classe TEXT, sousClasse TEXT, denom TEXT, idComp integer, foreign key (idComp) REFERENCES COMPARTIMENT (idComp) ON DELETE CASCADE )")
        tx.executeSql("CREATE TABLE IF NOT EXISTS CURRENTDATA (currentProjet TEXT, currentParcelle TEXT, currentAdresse TEXT, currentEmp TEXT, currentSef TEXT, currentComp TEXT)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS CURRENTID (currentProjetId INTEGER, currentParcelleId INTEGER, currentAdresseId INTEGER, currentEmpId INTEGER, currentSegId INTEGER, currentCompId INTEGER)");
        tx.executeSql("CREATE TRIGGER IF NOT EXISTS dataOneRow BEFORE INSERT ON CURRENTDATA WHEN (SELECT COUNT(*) FROM CURRENTDATA) >=1 BEGIN SELECT RAISE(FAIL, 'un seul row'); END;");
        tx.executeSql("CREATE TRIGGER IF NOT EXISTS dataOneRowId BEFORE INSERT ON CURRENTID WHEN (SELECT COUNT(*) FROM CURRENTID) >=1 BEGIN SELECT RAISE(FAIL, 'un seul row id'); END;");
    }, (e) => console.log(e+' transCreate1'));
    db.transaction((tx) => {
        tx.executeSql("INSERT INTO  CURRENTDATA VALUES ('', '', '', '', '', '');");
    }, (e) => console.log(e+' transCreate2'));
    db.transaction((tx) => {
        tx.executeSql("INSERT INTO  CURRENTId VALUES (null,null, null, null, null, null);");
    }, (e) => console.log(e+' transCreate3'));
};

const DesignationStackScreen = () => {
    return (
        <DesignationStack.Navigator>
            <DesignationStack.Screen name="Designation" component={Designation}/>
        </DesignationStack.Navigator>
    );
}

const ProjetStackScreen = () => {
    return (
        <stackProjet.Navigator>
            <stackProjet.Screen name="Projets" component={Projet} />
            <stackProjet.Screen name="AJout de projet" component={ProjetAdd} />
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
            <stackProjet.Screen name="Ajout de compartiment" component={CompartimentAdd} />
        </stackCompartiment.Navigator>
    );
}

const Localisation = () =>{
    return(
        <tab.Navigator>
            <tab.Screen name="Projet" component={ProjetStackScreen} />
            <tab.Screen name="Parcelle" component={ParcelleStackScreen} />
            <tab.Screen name="Adresse" component={AdresseStackScreen} />
            <tab.Screen name="Emplacement" component={EmplacementStackScreen} />
            <tab.Screen name="Segment" component={SegmentStackScreen} />
            <tab.Screen name="Compartiment" component={CompartimentStackScreen} />
        </tab.Navigator>
    );
}

const Draw = () => {
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="Localisation" component={Localisation} />
            <Drawer.Screen name="Designations" component={DesignationStackScreen}/>
        </Drawer.Navigator>
    );
};

const Accueil = () => {
  return(
      <Acc.Navigator headerMode="none">
          <Acc.Screen name="Garde" component={Garde}/>
          <Acc.Screen name="Tirroir" component={Draw}/>
          <Acc.Screen name="About" component={About}/>
      </Acc.Navigator>
  );
};

const App = () => {
    ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE);
    StatusBar.setHidden(true);
    createDB();
    return (
        <NavigationContainer>
            <Accueil/>
        </NavigationContainer>

    );
}

export default App;
