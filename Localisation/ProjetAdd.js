import React, {useState} from 'react';
import {Text, TextInput, View} from "react-native";
import Arbre from "./Arbre";
import DatePicker from "react-native-date-picker";

const ProjetAdd = ({navigation}) => {
    const [nom, setNom] = useState("");
    const [date, setDate] = useState(new Date());
    const [nomA, setNomA] = useState("");
    const [prenomA, setPrenomA] = useState("");
    const [organisme, setOrga] = useState("");
    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={setNom}
                        value={nom}
                        placeholder="Nom du projet"
                    />
                    <DatePicker
                        onDateChange={setDate}
                        date={date}
                        locale='fr'
                    />
                </View>
            </View>
        </>

    );
};

export default ProjetAdd;