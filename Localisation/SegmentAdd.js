import React, {useState} from 'react';
import {Picker, Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import Arbre from "./Arbre";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const add = (n, ni, dn, t) => {
    db.transaction( (tx) => {
        let i;
        tx.executeSql("SELECT currentEmpId FROM CURRENTID", [], (tx, rs) => {
            i = rs.rows.item(0).currentEmpId;
            tx.executeSql("INSERT INTO SEGMENT (idEmp, codeSegment, numeroNiveau, demiNiveau,typeSegment) VALUES (?,?,?, ?, ?)", [i, t.substring(0,3)+n, ni, dn, t]);
        });
    }, (e) => console.log(e))
};

const mod = (id, n, ni, dn, t) => {
    db.transaction( (tx) => {
        tx.executeSql("UPDATE SEGMENT SET codeSegment = ?, numeroNiveau = ?, demiNiveau = ?, typeSegment = ? WHERE idSegment = ?", [t.substring(0,3)+n, ni, dn, t, id], (tx ,rs) => console.log("update"))
    }, (e) => console.log(e))
};

const SegmentAdd = ({route , navigation}) => {
    const [num, setNum] = useState();
    const [niv, setNiv] = useState();
    const [demi, setDemi] = useState();
    const [type, setType] = useState('Logement');
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <TextInput
                        onChangeText={(n) => setNum(n)}
                        value={num}
                        placeholder="Numero du segment"
                    />
                    <TextInput
                        onChangeText={(n) => setNiv(n)}
                        value={niv}
                        placeholder="niveau du segment"
                    />
                    <Text>Demi Niveau</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                    >
                        <Picker.Item label='Logement' value='Logement'/>
                        <Picker.Item label='Jardin' value='Jardin'/>
                        <Picker.Item label='Cour' value='Cour'/>
                        <Picker.Item label='Salle' value='Salle'/>
                        <Picker.Item label='Aile' value='Aile'/>
                        <Picker.Item label='Nef' value='Nef'/>
                        <Picker.Item label='Transept' value='Transept'/>
                        <Picker.Item label='Toiture' value='Toiture'/>
                        <Picker.Item label='Comble' value='Comble'/>
                        <Picker.Item label='Toiture-Terrasse' value='TT'/>
                        <Picker.Item label='Terrasse' value='Terrasse'/>
                        <Picker.Item label='Segment' value='Segment'/>
                        <Picker.Item label='Aucun' value='Aucun'/>
                        <Picker.Item label='Cage Escalier' value='CE'/>
                    </Picker>
                    <TouchableOpacity
                        onPress={() => {
                            if (route.params.action === 'add') {
                                add(num, niv, demi, type);
                            } else {
                                mod(route.params.id, num, niv, demi, type)
                            }
                            navigation.push('Segments')
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

export default SegmentAdd;