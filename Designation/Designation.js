import React, {useCallback, useEffect, useState} from 'react';
import {Picker, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Arbre from "../Localisation/Arbre";

const db = SQLite.openDatabase('Agora');



const Designation = () => {
    const [data, setData] = useState([]);
    const [elem, setElem] = useState([]);
    const [comp, setComp] = useState();

    const selectElem = (comp) => {
        setComp(comp);
        db.transaction( (tx) => {
            tx.executeSql("SELECT * FROM ELEMENT WHERE idCOmp = ?", [comp], (tx, rs) => {
                let res = [];
                for (let i = 0; i<rs.rows.length; i++) {
                    res.push(rs.rows.item(i));
                }
                setElem(res);
            })
        });
    };

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM COMPARTIMENT", [],(tx, rs) => {
                let res = [];
                for (let i = 0; i<rs.rows.length; i++) {
                    res.push(rs.rows.item(i));
                }
                setData(res);
            }, () => {}, (tx, e) => console.log(e))
        }, (e) => console.log(e+ 'transSelectDesi'));
    }, []);

    return (
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View>
                    <Picker
                        selectedValue={comp}
                        onValueChange={(v)=>{selectElem(v)}}>
                        {data.map((item, index) => {
                            console.log(item);
                            return (<Picker.Item label={item.refLocalisation} value={item.idComp} key={index}/>)
                        })}
                    </Picker>
                    <View style={{backgroundColor: 'gray', flex:2}}>
                        {
                            elem.map( (value) => {
                                return (
                                    <View style={{flexDirection: "row"}} key={value.idElem}>
                                        <Text>{value.denom || value.sousClasse || value.classe || value.strate}</Text>
                                        <TouchableOpacity onPress={() => updateArbre(value.idEmp,value.codeEmplacement, navigation)}>
                                            <Text>Selectionner</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.push('Ajout d\'emplacement', {action: 'mod', id: value.idEmp})}>
                                            <Text>Modifier</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => supprimerEmp(value.idEmp, navigation)}>
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
            </View>
        </>
    );
}

export default Designation;