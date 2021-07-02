import React, {useEffect, useState} from 'react';
import {Text, View} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const Arbre = () => {
    const [data, setData] = useState({});
    useEffect(() => {
        db.transaction( (tx) => {
           tx.executeSql("SELECT * FROM CURRENTDATA;", (tx, rs) => {
               const row = rs.rows.item(0);
               const res = {
                   projet: row.currentProjet,
                   parcelle: row.currentParcelle,
                   adresse: row.currentAdresse,
                   emplacement: row.currentEmp,
                   segment: row.currentSef,
                   compartiment: row.currentComp
               }
               setData(res);
           })
        }, (e) => console.log(e));
    }, []);
    return(
        <>
            <View style={{backgroundColor: '#bbccb8', minWidth: 200, maxWidth: 300, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 21}}>
                    {
                        data.projet+'\n\n\n\n﹂'+
                        data.parcelle+'\n\n\n\n﹂'+
                        data.adresse+'\n\n\n\n﹂'+
                        data.emplacement+'\n\n\n\n﹂'+
                        data.segment+'\n\n\n\n﹂'+
                        data.compartiment
                    }
                </Text>
            </View>
        </>
    );
};

export default Arbre;