import React from 'react';
import {Text, View} from "react-native";
import Arbre from "./Arbre";

const Projet = () => {
    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre/>
                <View style={{backgroundColor: 'gray', flex:2}}>
                    <Text>

                    </Text>
                </View>
            </View>
        </>
    );
};

export default Projet;