import React, {useState} from 'react';
import {Picker, Text, TextInput, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const add = (n, su,t) => {
    db.transaction( (tx) => {
        let i;
        let i2;
        let s, e, a, pa, pr;
        tx.executeSql("SELECT * FROM CURRENTDATA", [], (tx, rs) => {
            s = rs.rows.item(0).currentSef;
            e = rs.rows.item(0).currentEmp;
            a = rs.rows.item(0).currentAdresse;
            pa = rs.rows.item(0).currentParcelle;
            pr = rs.rows.item(0).currentProjet;
            tx.executeSql("SELECT * FROM CURRENTID", [], (tx, rs) => {
                i = rs.rows.item(0).currentSegId;
                i2 = rs.rows.item(0).currentAdresseId;
                console.log('current id from add '+i+' '+i2);
                tx.executeSql("INSERT INTO COMPARTIMENT (idSegment, codeCompartiment, refLocalisation, surfaceAuSol,typeCompartiment, idAdresse) VALUES (?,?,?, ?, ?, ?)", [i, t.substring(0,3)+n, t.substring(0,3)+n+'_'+s+'-'+e+'_'+a+'_'+pa+'_'+pr, su, t, i2], (tx, rs) =>   console.log('1111'));
            });

        }, )

    }, (e) => console.log(e))
};

const mod = (id, n, su, t) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE COMPARTIMENT SET codeCompartiment = ?, surfaceAuSol = ?, typeCompartiment = ? WHERE idComp = ?", [t.substring(0,3)+n, su, t, id], (tx ,rs) => console.log("update"))
    }, (e) => console.log(e))
};

const EmplacementAdd = ({route , navigation}) => {
    const [num, setNum] = useState();
    const [sur, setSur] = useState();
    const [type, setType] = useState('Local');

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={(n) => setNum(n)}
                        value={num}
                        placeholder="Numero de compartiment"
                    />
                    <TextInput
                        onChangeText={(n) => setSur(n)}
                        value={sur}
                        placeholder="surface au sol"
                    />
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                    >
                        <Picker.Item label='Local' value='Local'/>
                        <Picker.Item label='Travee' value='Travee'/>
                        <Picker.Item label='Jardin' value='Jardin'/>
                        <Picker.Item label='Cour' value='Cour'/>
                        <Picker.Item label='Terrasse' value='Terrasse'/>
                        <Picker.Item label='Patio' value='Patio'/>
                        <Picker.Item label='Aucun' value='Aucun'/>
                    </Picker>
                    <TouchableOpacity
                        onPress={() => {
                            if (route.params.action === 'add') {
                                add(num, sur, type);
                            } else {
                                mod(route.params.id, num, sur, type)
                            }
                            navigation.push('Compartiments')
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