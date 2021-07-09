import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const add = (n, r, cp, v) => {
    db.transaction( (tx) => {
        let i;
        tx.executeSql("SELECT currentParcelleId FROM CURRENTID", [], (tx, rs) => {
            i = rs.rows.item(0).currentParcelleId;
            tx.executeSql("INSERT INTO Adresse (numero, rue, codePostal, ville, idParcelle) VALUES (?,?,?, ?, ?)", [n, r, cp, v, i]);
        });
    }, (e) => console.log(e))
};

const mod = (id,n, r, cp, v) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE Adresse SET numero = ?, rue = ?, codePostal = ?, ville = ? WHERE idAdresse = ?", [n, r, cp, v, id], (tx ,rs) => console.log("update"))
    }, (e) => console.log(e))
};

const AdresseAdd = ({route , navigation}) => {
    const [num, setNum] = useState();
    const [cp, setCp] = useState();
    const [rue, setRue] = useState();
    const [ville, setVille] = useState();

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={(n) => setNum(n)}
                        value={num}
                        placeholder="numéro"
                    />
                    <TextInput
                        onChangeText={(n) => setRue(n)}
                        value={rue}
                        placeholder="rue de l'adresse"
                    />
                    <TextInput
                        onChangeText={(n) => setCp(n)}
                        value={cp}
                        placeholder="Code Postal"
                    />
                    <TextInput
                        onChangeText={(n) => setVille(n)}
                        value={ville}
                        placeholder="ville de l'adresse"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (route.params.action === 'add') {
                                add(num, rue, cp, ville);
                            } else {
                                mod(route.params.id, num, rue, cp, ville)
                            }
                            navigation.push('Adresses')
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

export default AdresseAdd;