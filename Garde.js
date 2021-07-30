import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";


const Garde = ({navigation}) => {
    return(
        <View style={{alignItems: 'center', textAlign: 'center'}}>
            <Text style={{fontSize: 130}}>AGORA</Text>
            <Text style={{fontSize: 30, paddingBottom: '4%'}}>Application de Gestion et d’Orientation des Ressources Architecturales</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tirroir')}>
                <Text style={{fontSize: 30}}>Localisation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Text style={{fontSize: 30}}>A propos</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Garde;