import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

const Styles = StyleSheet.create({
    button: {
        backgroundColor: '#33b100',
        marginHorizontal: '3%',
        borderWidth: 2,
        borderColor: '#1d6300',
        padding: '0.5%'
    },
    item: {
        flexDirection: "row",
        marginVertical: '1%',
        paddingVertical: '1%',
        borderWidth: 3,
        backgroundColor: '#FFFFFF',
        width: '60%'
    },
    label: {
        padding: '0.5%'
    },
    add: {
        backgroundColor: '#33b100',
        marginHorizontal: '3%',
        borderWidth: 2,
        borderColor: '#1d6300',
        padding: '0.5%',
        width: '10%',
        alignItems: 'center'
    },
    list: {
        backgroundColor: 'gray',
        flex:2,
        alignItems: 'center'
    },
    designPicker: {
        width: '10%',
        paddingHorizontal: '9%'
    }
});

export default Styles;