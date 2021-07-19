import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Styles from "../Styles";


const db = SQLite.openDatabase('Agora');

const updateArbre = (id, projet, n) => {
  db.transaction( (tx) => {
      tx.executeSql("UPDATE CURRENTDATA SET currentProjet = ?", [projet], (tx, rs) => n.push('Projets'));
      tx.executeSql("UPDATE CURRENTID SET currentProjetId = ?", [id], (tx, res) => console.log('updated'));
  }, (e) => console.log(e))
};

const supprimerProjet = (id, n) => {
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM PROJET WHERE idProjet = ?", [id], (tx, res) => n.push('Projets'));
    })
};

const Projet = ({navigation}) => {
    const [data, setData] = useState([]);
    useFocusEffect(() => {
        db.transaction( (tx) => {
            tx.executeSql("SELECT * FROM PROJET;", [] ,(tx, rs) => {
                let res = [];
                for (let i = 0; i<rs.rows.length; i++) {
                    res.push(rs.rows.item(i));
                }
                setData(res);
            })
        }, (e) => console.log(e+' transSelectProjet'));
    });

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={Styles.item} key={value.idProjet}>
                                    <Text>{value.nomProjet}</Text>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => {
                                        updateArbre(value.idProjet, value.nomProjet, navigation);
                                        navigation.navigate('Parcelle');
                                    }}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => navigation.push('AJout de projet', {action: 'mod', id: value.idProjet})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => supprimerProjet(value.idProjet, navigation)}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                    <TouchableOpacity onPress={() => navigation.push('AJout de projet', {action: 'add'})}>
                        <Text>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Projet;