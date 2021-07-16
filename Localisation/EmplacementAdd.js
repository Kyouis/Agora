import React, {useState} from 'react';
import {Picker, Text, TextInput, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const add = (n, ni, ns, t) => {
    db.transaction( (tx) => {
        let i;
        tx.executeSql("SELECT currentParcelleId FROM CURRENTID", [], (tx, rs) => {
            i = rs.rows.item(0).currentParcelleId;
            tx.executeSql("INSERT INTO EMPLACEMENT (idParcelle, codeEmplacement, niveauInfMax, niveauSupMax,typeEmplacement) VALUES (?,?,?, ?, ?)", [i, t.substring(0,3)+n, ni, ns, t]);
        });
    }, (e) => console.log(e))
};

const mod = (id, n, ni, ns, t) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE EMPLACEMENT SET codeEmplacement = ?, niveauInfMax = ?, niveauSupMax = ?, typeEmplacement = ? WHERE idEmp = ?", [t.substring(0,3)+n, ni, ns, t, id], (tx ,rs) => console.log("update"))
    }, (e) => console.log(e))
};

const EmplacementAdd = ({route , navigation}) => {
    const [num, setNum] = useState();
    const [inf, setInf] = useState();
    const [sup, setSup] = useState();
    const [type, setType] = useState('Batiment');

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={(n) => setNum(n)}
                        value={num}
                        placeholder="Numero de l'emplacement"
                    />
                    <TextInput
                        onChangeText={(n) => setInf(n)}
                        value={inf}
                        placeholder="Plus bas niveau"
                    />
                    <TextInput
                        onChangeText={(n) => setSup(n)}
                        value={sup}
                        placeholder="Plus haut niveau"
                    />
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                    >
                        <Picker.Item label='Batiment' value='Batiment'/>
                        <Picker.Item label='Cour' value='Cour'/>
                        <Picker.Item label='Jardin' value='Jardin'/>
                        <Picker.Item label='Site' value='Site'/>
                    </Picker>
                    <TouchableOpacity
                        onPress={() => {
                            if (route.params.action === 'add') {
                                add(num, inf, sup, type);
                            } else {
                                mod(route.params.id, num, inf, sup, type)
                            }
                            navigation.push('Emplacements')
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

export default EmplacementAdd;