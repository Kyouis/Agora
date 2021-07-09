import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const add = (s, np) => {
    db.transaction( (tx) => {
        let i;
        tx.executeSql("SELECT currentProjetId FROM CURRENTID", [], (tx, rs) => {
            i = rs.rows.item(0).currentProjetId;
            tx.executeSql("INSERT INTO PARCELLE (section, numParcelle, idProjet) VALUES (?,?,?)", [s, np, i]);
        });
    }, (e) => console.log(e))
};

const mod = (id, s, np) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE PARCELLE SET section = ?, numParcelle = ? WHERE idParcelle = ?", [s, np, id], (tx ,rs) => console.log("update"))
    }, (e) => console.log(e))
};

const ParcelleAdd = ({route , navigation}) => {
    const [sec, setSec] = useState();
    const [num, setNum] = useState();

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={(n) => setSec(n)}
                        value={sec}
                        placeholder="Section de la parcelle"
                    />
                    <TextInput
                        onChangeText={(n) => setNum(n)}
                        value={num}
                        placeholder="Numéro de la parcelle"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (route.params.action === 'add') {
                                add(sec, num);
                            } else {
                                mod(route.params.id, sec, num)
                            }
                            navigation.push('Parcelles')
                        }}
                    >
                        <Text>
                            Ajouter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>

    );
};

export default ParcelleAdd;