import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const add = (n, d, na, pa, o) => {
    db.transaction( (tx) => {
        tx.executeSql("INSERT INTO PROJET (nomProjet, dateProjet, nomAuteur, prenomAuteur, organisme) VALUES (?,?,?,?,?)", [n, d, na, pa, o])
    }, (e) => console.log(e))
};

const mod = (id, n, d, na, pa, o) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE PROJET SET nomProjet = ?, dateProjet = ?, nomAuteur = ?, prenomAuteur = ?, organisme = ? WHERE idProjet = ?", [n, d, na, pa, o, id], (tx ,rs) => console.log("update"))
    }, (e) => console.log(e))
};

const ProjetAdd = ({route , navigation}) => {
    const [show, setShow] = useState(false);
    const [nom, setNom] = useState("");
    const [date, setDate] = useState(new Date(1598051730000));
    const [nomA, setNomA] = useState("");
    const [prenomA, setPrenomA] = useState("");
    const [organisme, setOrga] = useState("");
    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={(n) => setNom(n)}
                        value={nom}
                        placeholder="Nom du projet"
                    />
                    <TouchableOpacity
                        onPress={() => setShow(true)}
                    >
                        <Text>
                            Date du projet : {date.toDateString()}
                        </Text>
                    </TouchableOpacity>
                    {show &&  (
                        <DateTimePicker
                            value={date}
                            onChange={(e, d) => {
                                console.log(date);
                                console.log(d);
                                setDate(d);
                                console.log(date.toDateString());
                                setShow(false);
                            }}
                            dateFormat='day month year'
                        />
                    )}
                    <TextInput
                        onChangeText={(n) => setNomA(n)}
                        value={nomA}
                        placeholder="Nom de l'auteur"
                    />
                    <TextInput
                        onChangeText={(n) => setPrenomA(n)}
                        value={prenomA}
                        placeholder="Prénom de l'auteur"
                    />
                    <TextInput
                        onChangeText={(n) => setOrga(n)}
                        value={organisme}
                        placeholder="Organisme de l'auteur"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (route.params.action === 'add') {
                                add(nom, date.toDateString(), nomA, prenomA, organisme);
                            } else {
                                mod(route.params.id, nom, date.toDateString(), nomA, prenomA, organisme)
                            }
                            navigation.push('Projets')
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

export default ProjetAdd;