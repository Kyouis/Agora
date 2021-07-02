import React from 'react';
import {Text, View} from "react-native";
import Arbre from "./Arbre";

const Projet = () => {
    return(
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%'}}>
                <Arbre style={{width:'30%'}}/>
                <View style={{backgroundColor: 'gray', width:'60%'}}>
                    <Text>

                    </Text>
                </View>
            </View>
        </>
    );
};

export default Projet;