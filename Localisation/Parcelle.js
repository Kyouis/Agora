import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Styles from "../Styles";


const db = SQLite.openDatabase('Agora');

const updateArbre = (id, parcelle, n) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE CURRENTDATA SET currentParcelle = ?", [parcelle], (tx, rs) => n.push('Parcelles'));
        tx.executeSql("UPDATE CURRENTID SET currentParcelleId=?", [id])
    })
};

const supprimerParcelle = (id, n) => {
    console.log('TESTE0I: '+id);
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM Parcelle WHERE idParcelle = ?", [id], (tx, res) => n.push('Parcelles'));
    }, (e) => console.log(e))
};

const Parcelle = ({navigation}) => {
    const [data, setData] = useState([]);
    useFocusEffect(() => {
        db.transaction( (tx) => {
            let idp;
            tx.executeSql("SELECT currentProjetId FROM CURRENTID", [], (tx, rs) => {
                idp=rs.rows.item(0).currentProjetId;
                tx.executeSql("SELECT * FROM PARCELLE WHERE idProjet = ?;", [idp] ,(tx, rs) => {
                let res = [];
                for (let i = 0; i<rs.rows.length; i++) {
                    res.push(rs.rows.item(i));
                }
                setData(res);
            })});
        }, (e) => console.log(e+' transSelectParcelle'));
    });

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={Styles.list}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={Styles.item} key={value.idParcelle}>
                                    <Text style={Styles.label}>{value.section+value.numParcelle}</Text>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => {
                                        updateArbre(value.idParcelle,value.section+value.numParcelle, navigation);
                                        navigation.navigate('Adresse');
                                    }}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => navigation.push('Ajout de Parcelle', {action: 'mod', id: value.idParcelle})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => supprimerParcelle(value.idParcelle, navigation)}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                    <TouchableOpacity
                        style={Styles.add}
                        onPress={() => navigation.push('Ajout de Parcelle', {action: 'add'})}>
                        <Text>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Parcelle;