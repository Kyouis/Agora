import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";
import ProjetAdd from "./ProjetAdd";

const db = SQLite.openDatabase('Agora');

const updateArbre = (projet) => {
  db.transaction( (tx) => {
      tx.executeSql("UPDATE CURRENTDATA SET currentProjet = ?", [projet]);
  })
};

const supprimerProjet = (id) => {
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM PROJET WHERE idProjet = ?", [id]);
    })
};

const Projet = ({navigation}) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        db.transaction( (tx) => {
            tx.executeSql("SELECT * FROM CURRENTDATA;", (tx, rs) => {
                let res = [];
                for (let i = 0; i<rs.rows.length; i++) {
                    res.push(rs.rows.item(i));
                }
                setData(res);
            })
        }, (e) => console.log(e));
    }, []);

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={{flexDirection: "row"}} key={value.idProjet}>
                                    <Text>value.nomProjet</Text>
                                    <TouchableOpacity onPress={() => updateArbre(value.nomProjet)}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.push('Ajout de projet', {action: 'mod'})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => supprimerProjet(value.idProjet)}>
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