import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Styles from "../Styles";


const db = SQLite.openDatabase('Agora');

const updateArbre = (id, emp, n) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE CURRENTDATA SET currentEmp = ?", [emp], (tx, rs) => n.push('Emplacements'));
        tx.executeSql("UPDATE CURRENTID SET currentEmpId=?", [id])
    })
};

const supprimerEmp = (id, n) => {
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM EMPLACEMENT WHERE idEmp = ?", [id], (tx, res) => n.push('Emplacements'));
    }, (e) => console.log(e))
};

const Parcelle = ({navigation}) => {
    const [data, setData] = useState([]);
    useFocusEffect(() => {
        db.transaction( (tx) => {
            let idp;
            tx.executeSql("SELECT currentParcelleId FROM CURRENTID", [], (tx, rs) => {
                idp=rs.rows.item(0).currentParcelleId;
                tx.executeSql("SELECT * FROM EMPLACEMENT WHERE idParcelle = ?;", [idp] ,(tx, rs) => {
                    let res = [];
                    for (let i = 0; i<rs.rows.length; i++) {
                        res.push(rs.rows.item(i));
                    }
                    setData(res);
                })});
        }, (e) => console.log(e+' transSelectEmp'));
    });

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={Styles.item} key={value.idEmp}>
                                    <Text>{value.codeEmplacement}</Text>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => {
                                        updateArbre(value.idEmp,value.codeEmplacement, navigation);
                                        navigation.navigate('Segment');
                                    }}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => navigation.push('Ajout d\'emplacement', {action: 'mod', id: value.idEmp})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => supprimerEmp(value.idEmp, navigation)}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                    <TouchableOpacity onPress={() => navigation.push('Ajout d\'emplacement', {action: 'add'})}>
                        <Text>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Parcelle;