import React, {useEffect, useState} from 'react';
import {StyleSheet,Text, View} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('Agora');

const Arbre = () => {
    const [data, setData] = useState({});
    useEffect(() => {
        db.transaction( (tx) => {
            tx.executeSql("SELECT * FROM CURRENTDATA;", [], (tx, rs) => {
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
            <View style={{backgroundColor: '#bbccb8', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.arbre}>{data.projet}</Text>
                <Text style={styles.arbre}>{'﹂'+data.parcelle}</Text>
                <Text style={styles.arbre}>{'﹂'+data.adresse}</Text>
                <Text style={styles.arbre}>{'﹂'+data.emplacement}</Text>
                <Text style={styles.arbre}>{'﹂'+data.segment}</Text>
                <Text style={styles.arbre}>{'﹂'+data.compartiment}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    arbre: {
        fontSize: 21,
        paddingBottom: '20%'
    }
});

export default Arbre;