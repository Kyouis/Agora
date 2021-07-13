import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";


const db = SQLite.openDatabase('Agora');

const updateArbre = (id, emp, n) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE CURRENTDATA SET currentComp = ?", [emp], (tx, rs) => n.push('Compartiments'));
        tx.executeSql("UPDATE CURRENTID SET currentCompId=?", [id])
    })
};

const supprimerEmp = (id, n) => {
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM COMPARTIMENT WHERE idComp = ?", [id], (tx, res) => n.push('Compartiments'));
    }, (e) => console.log(e))
};

const Parcelle = ({navigation}) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        db.transaction( (tx) => {
            let idp;
            let idp2;
            tx.executeSql("SELECT * FROM CURRENTID", [], (tx, rs) => {
                idp=rs.rows.item(0).currentSegId;
                idp2=rs.rows.item(0).currentAdresseId;
                console.log('current id from list : '+idp+' '+idp2);
                tx.executeSql("SELECT * FROM COMPARTIMENT WHERE idSegment = ? AND idAdresse= ?;", [idp, idp2] ,(tx, rs) => {
                    let res = [];
                    for (let i = 0; i<rs.rows.length; i++) {
                        res.push(rs.rows.item(i));
                    }
                    setData(res);
                })});
        }, (e) => console.log(e+' transSelectComp'));
    }, []);

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={{flexDirection: "row"}} key={value.idComp}>
                                    <Text>{value.codeCompartiment}</Text>
                                    <TouchableOpacity onPress={() => updateArbre(value.idComp,value.codeCompartiment, navigation)}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.push('Ajout de compartiment', {action: 'mod', id: value.idComp})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => supprimerEmp(value.idComp, navigation)}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                    <TouchableOpacity onPress={() => navigation.push('Ajout de compartiment', {action: 'add'})}>
                        <Text>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Parcelle;