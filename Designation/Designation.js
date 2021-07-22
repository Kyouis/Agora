import React, {useCallback, useEffect, useState} from 'react';
import {Picker, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Arbre from "../Localisation/Arbre";
import Styles from "../Styles";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const db = SQLite.openDatabase('Agora');

const addDesignation = (n, s, c, sc, d) => {

    db.transaction((tx) => {
        let idp;
        tx.executeSql("SELECT * FROM CURRENTID ", [], (tx, rs) => {
            idp=rs.rows.item(0).currentCompId;
            tx.executeSql("INSERT INTO ELEMENT (nom, strate, classe, sousClasse, denom, idComp) VALUES (?,?,?,?,?,?)", [n, s, c, sc, d, idp]);
        })
    })
}


const Designation = ({navigation}) => {
    const [data, setData] = useState([]);
    const [elem, setElem] = useState([]);
    const [n, setN] = useState(1);

    const selectElem = (comp) => {
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

    useFocusEffect(() => {
        db.transaction((tx) => {
            let idp;
            tx.executeSql("SELECT * FROM CURRENTID ", [], (tx, rs) => {
                idp=rs.rows.item(0).currentCompId;
                selectElem(idp);
            })
        })

    });

    return (
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{flex: 2}}>
                    <View style={{backgroundColor: 'gray', flex:2, flexDirection: "column"}}>
                        {
                            elem.map(value => {
                               return(
                                 <View key={value.idElem} style={{flexDirection: "row"}}>
                                     <TextInput
                                         style={Styles.designPicker}
                                         onChangeText={(n) => {}}
                                         value={value.nom}
                                         placeholder="Nom de l'élément"
                                     />
                                     <Picker
                                         style={Styles.designPicker}
                                         selectedValue={value.strate}
                                         onValueChange={(itemValue, itemIndex) =>{}}
                                     >
                                         <Picker.Item label='test' value='test'/>
                                     </Picker>
                                     <Picker
                                         style={Styles.designPicker}
                                         selectedValue={value.classe}
                                         onValueChange={(itemValue, itemIndex) => {}}
                                     >
                                         <Picker.Item label='test' value='test'/>
                                     </Picker>
                                     <Picker
                                         style={Styles.designPicker}
                                         selectedValue={value.sousClasse}
                                         onValueChange={(itemValue, itemIndex) => {}}
                                     >
                                         <Picker.Item label='test' value='test'/>
                                     </Picker>
                                     <Picker
                                         style={Styles.designPicker}
                                         selectedValue={value.denom}
                                         onValueChange={(itemValue, itemIndex) => {}}
                                     >
                                         <Picker.Item label='test' value='test'/>
                                     </Picker>
                                     <TouchableOpacity
                                         onPress={addDesignation}
                                     >
                                         <AntDesign name="pluscircle" size={24} color="black"/>
                                     </TouchableOpacity>
                                 </View>
                               );
                            })

                            /*[...Array(n)].map((value, index) => {
                                let nom;
                                let strate;
                                let classe;
                                let sc;
                                let denom;
                                return (
                                    <View key={index} style={{flexDirection: "row"}}>
                                        <TextInput
                                            style={Styles.designPicker}
                                            onChangeText={(n) => nom=n}
                                            value={nom}
                                            placeholder="Nom de l'élément"
                                        />
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={strate}
                                            onValueChange={(itemValue, itemIndex) => strate=itemValue}
                                        >
                                            <Picker.Item label='test' value='test'/>
                                        </Picker>
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={classe}
                                            onValueChange={(itemValue, itemIndex) => classe=itemValue}
                                        >
                                            <Picker.Item label='test' value='test'/>
                                        </Picker>
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={sc}
                                            onValueChange={(itemValue, itemIndex) => sc=itemValue}
                                        >
                                            <Picker.Item label='test' value='test'/>
                                        </Picker>
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={denom}
                                            onValueChange={(itemValue, itemIndex) => denom=itemValue}
                                        >
                                            <Picker.Item label='test' value='test'/>
                                        </Picker>
                                        <TouchableOpacity
                                            onPress={addDesignation}
                                        >
                                            <AntDesign name="pluscircle" size={24} color="black"/>
                                        </TouchableOpacity>
                                    </View>

                                );
                            })*/
                        }
                    </View>
                </View>

            </View>
        </>
    );
}

export default Designation;