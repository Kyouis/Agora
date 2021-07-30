import React, {useEffect, useState} from 'react';
import {StyleSheet,Text, View} from "react-native";
import * as SQLite from "expo-sqlite";

//ouvre la bdd SQLite
const db = SQLite.openDatabase('Agora');

//composant de l'arbre afficahnt les composant sélectionnés
const Arbre = (props) => {
    const [data, setData] = useState({});
    //update les composant sélectionner
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

    //permet de n'afficher que les composant antérieur à l'endroit ou on en est dans la localisation
    let tree;
    switch (props.num) {
        case '1':
            tree = <Text style={styles.arbre}>{data.projet}</Text>;
            break;
        case '2':
            tree = <><Text style={styles.arbre}>{data.projet}</Text>
                   <Text style={styles.arbre}>{'﹂'+data.parcelle}</Text></>;
                    break;
        case '3':
            tree = <><Text style={styles.arbre}>{data.projet}</Text>
            <Text style={styles.arbre}>{'﹂'+data.parcelle}</Text>
            <Text style={styles.arbre}>{'﹂'+data.adresse}</Text></>;
            break;
        case '4':
            tree = <><Text style={styles.arbre}>{data.projet}</Text>
            <Text style={styles.arbre}>{'﹂'+data.parcelle}</Text>
            <Text style={styles.arbre}>{'﹂'+data.adresse}</Text>
            <Text style={styles.arbre}>{'﹂'+data.emplacement}</Text></>;
            break;
        case '5':
            tree = <><Text style={styles.arbre}>{data.projet}</Text>
            <Text style={styles.arbre}>{'﹂'+data.parcelle}</Text>
            <Text style={styles.arbre}>{'﹂'+data.adresse}</Text>
            <Text style={styles.arbre}>{'﹂'+data.emplacement}</Text>
            <Text style={styles.arbre}>{'﹂'+data.segment}</Text></>;
            break;
        case '6':
            tree = <><Text style={styles.arbre}>{data.projet}</Text>
            <Text style={styles.arbre}>{'﹂'+data.parcelle}</Text>
            <Text style={styles.arbre}>{'﹂'+data.adresse}</Text>
            <Text style={styles.arbre}>{'﹂'+data.emplacement}</Text>
            <Text style={styles.arbre}>{'﹂'+data.segment}</Text>
            <Text style={styles.arbre}>{'﹂'+data.compartiment}</Text></>;
            break;
    }
    return(
        <>
            <View style={{backgroundColor: '#bbccb8', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {tree}
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