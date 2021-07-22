import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Styles from "../Styles";


const db = SQLite.openDatabase('Agora');

const updateArbre = (id, s, n) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE CURRENTDATA SET currentSef = ?", [s], (tx, rs) => n.push('Segments'));
        tx.executeSql("UPDATE CURRENTID SET currentSegId=?", [id])
    })
};

const supprimerSeg = (id, n) => {
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM SEGMENT WHERE idSegment = ?", [id], (tx, res) => n.push('Segments'));
    }, (e) => console.log(e))
};

const Segment = ({navigation}) => {
    const [data, setData] = useState([]);
    useFocusEffect(() => {
        db.transaction( (tx) => {
            let idp;
            tx.executeSql("SELECT currentEmpId FROM CURRENTID", [], (tx, rs) => {
                idp=rs.rows.item(0).currentEmpId;
                tx.executeSql("SELECT * FROM SEGMENT WHERE idEmp = ?;", [idp] ,(tx, rs) => {
                    let res = [];
                    for (let i = 0; i<rs.rows.length; i++) {
                        res.push(rs.rows.item(i));
                    }
                    setData(res);
                })});
        }, (e) => console.log(e+' transSelectSeg'));
    });

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={Styles.list}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={Styles.item} key={value.idSegment}>
                                    <Text style={Styles.label}>{value.codeSegment}</Text>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => {
                                        updateArbre(value.idSegment,value.codeSegment, navigation);
                                        navigation.navigate('Compartiment');
                                    }}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => navigation.push('Ajout de segment', {action: 'mod', id: value.idSegment})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => supprimerSeg(value.idSegment, navigation)}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                    <TouchableOpacity
                        style={Styles.add}
                        onPress={() => navigation.push('Ajout de segment', {action: 'add'})}>
                        <Text>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Segment;