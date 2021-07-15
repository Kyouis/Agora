import React, {useCallback, useEffect, useState} from 'react';
import {Picker, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";

const db = SQLite.openDatabase('Agora');

const Designation = () => {
    const [data, setData] = useState([]);
    const [comp, setComp] = useState();
    useFocusEffect( () => {
        useCallback(
            () => {
                db.transaction((tx) => {
                    tx.executeSql("SELECT * FROM COMPARTIMENT", [],(tx, rs) => {
                        let res = [];
                        for (let i = 0; i<rs.rows.length; i++) {
                            res.push(rs.rows.item(i));
                        }
                        setData(res);
                    }, () => {}, (tx, e) => console.log(e))
                }, (e) => console.log(e+ 'transSelectDesi'))
            }, []
        );
    });
    return (
        <View>
            <Picker
                selectedValue={comp}
                onValueChange={(v)=>{setComp(v)}}>
                {data.map((item, index) => {
                    console.log(item);
                    return (<Picker.Item label={item.refLocalisation} value={item.idComp} key={index}/>)
                })}
            </Picker>
        </View>
    );
}

export default Designation;