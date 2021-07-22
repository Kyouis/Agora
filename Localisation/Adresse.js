import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Styles from "../Styles";


const db = SQLite.openDatabase('Agora');

const updateArbre = (id, adresse, n) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE CURRENTDATA SET currentAdresse = ?", [adresse], (tx, rs) => n.push('Adresses'));
        tx.executeSql("UPDATE CURRENTID SET currentAdresseId=?", [id])
    })
};

const supprimerAdresse = (id, n) => {
    db.transaction( (tx) => {
        tx.executeSql("DELETE FROM Adresse WHERE idAdresse = ?", [id], (tx, res) => n.push('Adresses'));
    }, (e) => console.log(e))
};

const Adresse = ({navigation}) => {
    const [data, setData] = useState([]);
    useFocusEffect(() => {
        db.transaction( (tx) => {
            let idp;
            tx.executeSql("SELECT currentParcelleId FROM CURRENTID", [], (tx, rs) => {
                idp=rs.rows.item(0).currentParcelleId;
                tx.executeSql("SELECT * FROM Adresse WHERE idParcelle = ?;", [idp] ,(tx, rs) => {
                    let res = [];
                    for (let i = 0; i<rs.rows.length; i++) {
                        res.push(rs.rows.item(i));
                    }
                    setData(res);
                })});
        }, (e) => console.log(e+' transSelectAdresse'));
    });

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={Styles.list}>
                    {
                        data.map( (value) => {
                            return (
                                <View style={Styles.item} key={value.idAdresse}>
                                    <Text style={Styles.label}>{value.numero+value.rue+value.codePostal+value.ville}</Text>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => {
                                            updateArbre(value.idAdresse, value.numero + value.rue + value.codePostal + value.ville, navigation);
                                            navigation.navigate('Emplacement');
                                        }}>
                                        <Text>Selectionner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => navigation.push('Ajout d\'adresse', {action: 'mod', id: value.idAdresse})}>
                                        <Text>Modifier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Styles.button}
                                        onPress={() => supprimerAdresse(value.idAdresse, navigation)}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                    <TouchableOpacity
                        style={Styles.add}
                        onPress={() => navigation.push('Ajout d\'adresse', {action: 'add'})}>
                        <Text>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Adresse;