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
            <View style={{backgroundColor: '#bbccb8'}}>
                <Text>
                    {
                        data.projet+'\n﹂'+
                        data.parcelle+'\n\t﹂'+
                        data.adresse+'\n\t\t﹂'+
                        data.emplacement+'\n\t\t\t﹂'+
                        data.segment+'\n\t\t\t\t﹂'+
                        data.compartiment
                    }
                </Text>
            </View>
        </>
    );
};

export default Arbre;